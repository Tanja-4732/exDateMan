import { Router, Request, Response, NextFunction } from "express";
import { readFileSync } from "fs";
import * as jwt from "jsonwebtoken";
import { ServerEvents, crudType } from "./server-events";
import { hash, compareSync, hashSync, genSaltSync } from "bcrypt";
import { v4 } from "uuid";
import { log } from "console";
import { totp } from "speakeasy";
import { inspect } from "util";

/**
 * The structure of the state of a user
 */
export interface User {
  /**
   * Identifies the user
   */
  uuid: string;

  /**
   * Used for login
   */
  email: string;

  /**
   * A salted hash of a users password
   */
  saltedPwdHash: string;

  /**
   * The TOTP secret used to generate TOTP codes (used for 2FA)
   */
  totpSecret: string | null;

  /**
   * A friendly name for the user
   */
  name: string;
}

export class Authentication {
  /**
   * The authentication routes
   */
  public routes: Router;

  /**
   * The private key either as a string or a buffer
   */
  private JWT_PRIVATE_KEY: string | Buffer;

  /**
   * The public key either as a string or a buffer
   */
  private JWT_PUBLIC_KEY: string | Buffer;

  /**
   * A serverEvents instance
   */
  private es: ServerEvents;

  constructor() {
    // Prepare a ServerEvents instance
    this.es = new ServerEvents();

    // Instantiate the router
    this.routes = Router();

    // Mount the routes
    // Authentication
    this.routes.post("/login", this.login);

    this.routes.post("/register", (req: Request, res: Response) =>
      this.register(req, res),
    );

    this.routes.post("/logout", Authentication.logout);

    // Setup JWT keys
    this.getJwtKeys();
  }

  /**
   * Obtains the private & public key for JWT signing & verifying
   *
   * Throws an error when they are not defined
   */
  private getJwtKeys(): void {
    try {
      this.JWT_PRIVATE_KEY =
        process.env.EDM_JWT_PRIVATE_KEY_VAL ||
        readFileSync(process.env.EDM_JWT_PRIVATE_KEY);
      this.JWT_PUBLIC_KEY =
        process.env.EDM_JWT_PUBLIC_KEY_VAL ||
        readFileSync(process.env.EDM_JWT_PUBLIC_KEY);
    } catch (err) {
      throw new Error("Couldn't obtain JWT keys from environment.");
    }
  }

  /**
   * Log a user in
   *
   * This method handles the login process and
   * provides JWTs for the authenticated users
   */
  private async login(req: Request, res: Response) {
    try {
      /**
       * The saltedPwdHash from the users projection
       */
      let user = this.es.users.find((user: User) => {
        // Find the user in the projection with a matching email
        return user.email === req.body.email;
      });

      // Credential validation, return 401 on invalid credentials
      if (!compareSync(req.body.pwd, user.saltedPwdHash)) {
        res.status(401).json({
          error: "Invalid credentials",
        });
        return;
      }

      // Check for 2FA
      if (user.totpSecret != null) {
        if (
          !totp.verify({
            token: req.body.totpToken,
            encoding: "base32",
            secret: user.totpSecret,
          })
        ) {
          // On failed TOTP authentication
          res.status(401).json({
            error: "Invalid TOTP token",
          });
          return;
        }
      }

      // Issue a JWT
      this.issueJWT(user.uuid, res);
    } catch (error) {
      res.status(400).json({
        error: "Couldn't find email address",
      });
      return;
    }
  }

  /**
   * Handles the API call to create a new user
   */
  private async register(req: Request, res: Response) {
    // Check for duplicate email
    if (
      this.es.users.find((user: User) => {
        return user.email === req.body.email;
      })
    ) {
      // Return an error when the email was found
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    try {
      const userUuid = v4();
      // Append the event
      await ServerEvents.appendAuthenticationEvent({
        date: new Date(),
        data: {
          createdOn: new Date(),
          crudType: crudType.CREATE,
          email: req.body.email,
          saltedPwdHash: Authentication.makePwdHash(req.body.pwd),
          totpSecret: null,
          userUuid,
        },
      });

      // Issue a JWT for the new user
      this.issueJWT(userUuid, res);
    } catch (err) {
      log("Couldn't append user creation event; " + err);
      res.status(400).json({ oof: true });
      return;
    }
  }

  /**
   * Issues (and sends) a JWT for a user.
   *
   * @param user The user uuid for which to generate a token for
   * @param res The Express response object
   */
  private issueJWT(userUuid: string, res: Response) {
    // Generate a JWT
    let jwtBearerToken: string;
    try {
      jwtBearerToken = jwt.sign({}, this.JWT_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: "10h",
        subject: userUuid + "",
      });
    } catch (error) {
      error("Couldn't sign JWT; " + error);
    }

    // Send the token back to the user
    res
      .cookie("JWT", jwtBearerToken, {
        httpOnly: true,
        secure: process.env.EDM_JWT_SECURE === "true",
      })
      .send();
  }

  /**
   * Slats and hashes a password
   *
   * @param pwd The password to be hashed
   */
  private static makePwdHash(pwd: string): string {
    /**
     * The number of rounds the passwords hash will be salted for
     */
    const saltRounds = 10;

    // Calculate and set the hash
    return hashSync(pwd, saltRounds);
  }

  /**
   * Removes the JWT cookie form the user
   */
  static logout(req: Request, res: Response): void {
    res
      .clearCookie("JWT")
      .status(200)
      .json({ message: "Logout successful" });
    return;
  }

  //
  //
  // * Old code below; try to reuse
  //
  //

  // /**
  //  * Generates and adds 2FA TOTP data to a user
  //  *
  //  * @param user The actingUser
  //  */
  // static async addNewSecretToUser(user: User): Promise<any> {
  //   const secret: GeneratedSecret = generateSecret({
  //     name: "ExDateMan (" + user.email + ")",
  //     length: 32,
  //   });

  //   user.tfaSecret = secret.base32;
  //   user.tfaUrl = secret.otpauth_url;

  //   // Save the generated result to the db
  //   await UserController.saveUser(user);
  // }

  /**
   * Responds with all non-sensitive user data.
   * If 2FA is disabled and no secret exists, one will be created.
   */
  // static async getAuthDetails(req: Request, res: Response): Promise<void> {
  // const actingUser: User = res.locals.actingUser;
  // // Check if the user has 2FA enabled
  // if (actingUser.tfaEnabled) {
  //   // If the user has 2FA enabled, hide the 2FA data
  //   delete actingUser.tfaSecret;
  //   delete actingUser.tfaUrl;
  // } else {
  //   // If the user lacks 2FA data, generate it
  //   if (actingUser.tfaSecret == null || actingUser.tfaUrl == null) {
  //     await AccountController.addNewSecretToUser(actingUser);
  //   }
  // }
  // // Hide the users inventories
  // delete actingUser.inventoryUsers;
  // // Hide salted & hashed password
  // delete actingUser.saltedPwdHash;
  // res.status(200).json({
  //   status: "Authenticated",
  //   user: actingUser,
  // });
  // }

  // /**
  //  * Checks if a user is allowed to do something in a given inventory
  //  *
  //  * @returns true if the acting user may access a inventory
  //  */
  // public static async isAuthorized(
  //   user: User,
  //   inventory: Inventory,
  //   desiredAccess: InventoryUserAccessRightsEnum,
  // ): Promise<boolean> {
  //   /**
  //    * The inventoryUser to check permissions for
  //    */
  //   let inventoryUser: InventoryUser;
  //   try {
  //     // Get the TypeORM entity manager
  //     const entityManager: EntityManager = getManager();
  //
  //     // Try to get an inventoryUser matching both the user and the inventory specified
  //     inventoryUser = await entityManager.findOneOrFail(InventoryUser, {
  //       where: {
  //         user: user,
  //         inventory: inventory,
  //       },
  //     });
  //   } catch (error) {
  //     return false;
  //   }
  //
  //   // Needs to have the same access level (0) or higher (1)
  //   return (
  //     -1 <
  //     compareInventoryUserAccessRights(
  //       inventoryUser.InventoryUserAccessRights,
  //       desiredAccess,
  //     )
  //   );
  // }
  //
  //   // Check for 2FA
  //   if (actingUser.tfaEnabled) {
  //     if (
  //       !totp.verify({
  //         token: tfaToken,
  //         encoding: "base32",
  //         secret: actingUser.tfaSecret,
  //       })
  //     ) {
  //       // On failed TOTP authentication
  //       res.status(401).json({
  //         error: "Invalid TOTP token",
  //       });
  //       return;
  //     }
  //     // On successful TOTP authentication
  //   }
  //
  //   // Generate a JWT
  //   let jwtBearerToken: string;
  //   try {
  //     jwtBearerToken = jwt.sign({}, PRIVATE_KEY, {
  //       algorithm: "RS256",
  //       expiresIn: "10h",
  //       subject: actingUser.id + "",
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  //
  //   // Send the token back to the user
  //   res
  //     .status(200)
  //     .cookie("JWT", jwtBearerToken, {
  //       httpOnly: true,
  //       secure: process.env.EDM_MODE !== "development",
  //     })
  //     .json({
  //       status: 200,
  //       user: actingUser.name,
  //     });
  // }

  // /**
  //  * Authenticates a user's JWT and extracts the userId into res.locals.actingUser
  //  */
  // public static async authenticate(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> {
  //   // Decode and verify the JWT
  //   let decoded: any;
  //   try {
  //     decoded = jwt.verify(req.cookies["JWT"], this.PUBLIC_KEY);
  //   } catch (e) {
  //     // If the token is invalid
  //     res.status(401).json({
  //       status: 401,
  //       error: "Invalid credentials (need valid JWT as cookie)",
  //     });
  //     return;
  //   }
  //
  //   // Load the user form the db
  //   try {
  //     res.locals.actingUser = await UserController.getUserByIdOrFail(
  //       decoded.sub as number,
  //     );
  //   } catch (error) {
  //     // If the user couldn't be found
  //     res
  //       .status(401)
  //       .clearCookie("JWT")
  //       .json({
  //         status: 401,
  //         error: "Account doesn't exist; token invalid",
  //       });
  //     return;
  //   }
  //
  //   // If the token is valid and the user was loaded
  //   next();
  // }

  // /**
  //  * Checks for authorization in the current inventory for the acting user
  //  *
  //  * @static
  //  * @param {Response} res The Express response object
  //  * @param {InventoryUserAccessRightsEnum} accessRights
  //  * @returns {Promise<void>}
  //  * @memberof AuthController
  //  */
  // public static async authOrError(
  //   res: Response,
  //   accessRights: InventoryUserAccessRightsEnum,
  // ): Promise<void> {
  //   if (
  //     !(await AccountController.isAuthorized(
  //       res.locals.actingUser,
  //       res.locals.inventory as Inventory,
  //       accessRights,
  //     ))
  //   ) {
  //     res.status(403).json({
  //       status: 403,
  //       error:
  //         "Requestor doesn't have the " +
  //         accessRights +
  //         " role or higher for this inventory.",
  //     });
  //     return;
  //   }
  // }

  // /**
  //  * This method alters a users account
  //  * @param req
  //  * @param res
  //  * @param next
  //  */
  // public static async alterUser(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> {
  // /**
  //  * The user to alter and subsequently save to the db
  //  */
  // const alteredUser: User = req.body;
  // // Check if the acting user is the one to be altered
  // if ((res.locals.actingUser as User).id !== alteredUser.id) {
  //   res.status(403).json({ error: "Cannot alter other user" });
  //   return;
  // }
  // // Return error on bad request
  // if (
  //   alteredUser.tfaEnabled == null ||
  //   alteredUser.name == null ||
  //   alteredUser.name === "" ||
  //   alteredUser.email == null ||
  //   alteredUser.email === ""
  // ) {
  //   res.status(400).json({ error: "Bad request" });
  // }
  // // Change the password if desired
  // if (alteredUser.pwd === "" || alteredUser.pwd == null) {
  //   // Do not change the password
  // } else {
  //   // Change password
  //   alteredUser.saltedPwdHash = AccountController.makePwdHash(
  //     alteredUser.pwd,
  //   );
  // }
  // // Check for existing 2FA
  // if ((res.locals.actingUser as User).tfaEnabled) {
  //   // Disable 2FA if desired
  //   if (!alteredUser.tfaEnabled) {
  //     // Regenerate the 2FA secret
  //     await AccountController.addNewSecretToUser(res.locals
  //       .actingUser as User);
  //   }
  // } else {
  //   // Check if enabling 2FA is desired
  //   if (alteredUser.tfaEnabled) {
  //     // Try enabling 2FA
  //     if (
  //       totp.verify({
  //         secret: (res.locals.actingUser as User).tfaSecret,
  //         encoding: "base32",
  //         token: alteredUser.tfaToken,
  //       })
  //     ) {
  //       // Enable 2FA
  //       alteredUser.tfaEnabled = true;
  //     } else {
  //       // Return error because 2FA was wrong
  //       res.status(400).json({ error: "Invalid 2FA token" });
  //       return;
  //     }
  //   }
  // }
  // // Clean the request
  // delete alteredUser.createdOn;
  // delete alteredUser.inventoryUsers;
  // delete alteredUser.pwd;
  // delete alteredUser.tfaToken;
  // delete alteredUser.tfaSecret;
  // delete alteredUser.tfaUrl;
  // try {
  //   await UserController.saveUser(alteredUser);
  // } catch (error) {
  //   // Report duplicate email
  //   res.status(400).json({ error: "Email already in use" });
  //   return;
  // }
  // // Return auth details on success
  // AccountController.getAuthDetails(req, res);
  // }
}
