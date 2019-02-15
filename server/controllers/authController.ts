import { Request, Response, NextFunction } from "express";
import UserController from "./userController";
import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { User } from "../models/userModel";
import * as expressJwt from "express-jwt";
import { log } from "util";
import { hash, compareSync } from "bcrypt";
import {
  InventoryUserAccessRightsEnum,
  InventoryUser,
  compareInventoryUserAccessRights
} from "../models/inventoryUserModel";
import { Inventory } from "./../models/inventoryModel";
import InventoryController from "./inventoryController";
import InventoryUserController from "./inventoryUserController";
import { EntityManager, getManager } from "typeorm";

/**
 * The private key either as a string or a buffer
 */
const RSA_PRIVATE_KEY: string | Buffer =
  process.env.EDM_RSA_PRIVATE_KEY_VAL ||
  readFileSync(process.env.EDM_RSA_PRIVATE_KEY);

/**
 * The public key either as a string or a buffer
 */
const PUBLIC_KEY: string | Buffer =
  process.env.EDM_PUBLIC_KEY_VAL || readFileSync(process.env.EDM_PUBLIC_KEY);

export default class AuthController {
  static getAuthDetails(req: Request, res: Response): any {
    const actingUser: User = res.locals.actingUser;
    res.status(200).json({
      status: "Authenticated",
      "logged in as": {
        userId: actingUser.UserId,
        name: actingUser.UserName,
        email: actingUser.Email
      }
    });
  }
  /**
   * Checks if a user is allowed to do something in a given inventory
   *
   * @returns true if the acting user may access a inventory
   */
  public static async isAuthorized(
    user: User,
    inventory: Inventory,
    desiredAccess: InventoryUserAccessRightsEnum
  ): Promise<boolean> {
    // const user: User = await UserController.getUserByIdOrFail(userId);
    // const inventory: Inventory = await InventoryController.getInventoryOrFail(
    //   inventoryId
    // );
    let inventoryUser: InventoryUser;
    try {
      const entityManager: EntityManager = getManager();
      inventoryUser = await entityManager.findOneOrFail(InventoryUser, {
        where: {
          user: user,
          inventory: inventory
        }
      });
    } catch (error) {
      log("Error in isAuthorized: " + error);
      return false;
    }

    // Needs to have the same access level (0) or higher (1)
    return (
      -1 <
      compareInventoryUserAccessRights(
        inventoryUser.InventoryUserAccessRights,
        desiredAccess
      )
    );
  }

  /**
   * Registers new users
   */
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    /**
     * The number of rounds the passwords hash will be salted for
     */
    const saltRounds: number = 10 as number;

    /**
     * The user to be added to the db
     */
    const newUser: User = new User();

    newUser.Email = req.body.email;

    // The current date
    newUser.UserCreatedOn = new Date(new Date().setHours(0, 0, 0, 0));

    newUser.UserName = req.body.name;

    // Testing... // TODO remove the following line
    newUser.SaltedPwdHash = "Hello World";

    // Calculate and set the hash
    await hash(
      req.body.pwd,
      saltRounds,
      async (err: Error, hashValue: string) => {
        // Add the user to the db
        try {
          newUser.SaltedPwdHash = hashValue;
          await UserController.addNewUserOrFail(newUser);
        } catch (error) {
          res.status(400).json({
            status: 400,
            error: "Email already in use or user data incomplete"
          });
          return;
        }

        // Login the new user
        let jwtBearerToken: string;
        try {
          jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
            algorithm: "RS256",
            expiresIn: "10h",
            subject: newUser.UserId + ""
          });
        } catch (error) {
          console.error(error);
        }

        res
          .status(201)
          .cookie("JWT", jwtBearerToken, { httpOnly: true })
          .json({
            status: 201,
            message: "Created new user",
            email: newUser.Email,
            id: newUser.UserId
          });
      }
    );
  }

  /**
   * Login using JWT
   *
   * This method handles the login process and
   * provides JWTs for the authenticated users
   */
  public static async login(req: Request, res: Response): Promise<void> {
    /**
     * The email address provided in the login request
     */
    const email: string = req.body.email;

    /**
     * The password provided in the login request
     */
    const password: string = req.body.pwd;

    /**
     * Try to get the acting user (the one making the request) and set its res.locals field to it.
     * Returns a 400 status code when the user couldn't be found
     */
    let actingUser: User;
    try {
      actingUser = await UserController.findUserByEmailOrFail(email);
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: "Couldn't find email address"
      });
      return;
    }

    // Credential validation, return 401 on invalid credentials
    log(compareSync(password, actingUser.SaltedPwdHash) + "");
    // TODO Implement PWD check

    let jwtBearerToken: string;
    try {
      jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: "RS256",
        expiresIn: "10h",
        subject: actingUser.UserId + ""
      });
    } catch (error) {
      console.error(error);
    }

    res
      .status(200)
      .cookie("JWT", jwtBearerToken, { httpOnly: true })
      .json({
        status: 200,
        user: actingUser.UserName
      });
  }

  /**
   * Authenticates a user's JWT and extracts the userId into res.locals.actingUser
   */
  public static async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Decode and verify the JWT
    let decoded: any;
    try {
      decoded = jwt.verify(req.cookies["JWT"], PUBLIC_KEY);
    } catch (e) {
      // If the token is invalid
      res.status(401).json({
        status: 401,
        error: "Invalid credentials (need valid JWT as cookie)"
      });
      return;
    }

    // Load the user form the db
    try {
      res.locals.actingUser = await UserController.getUserByIdOrFail(
        decoded.sub as number
      );
    } catch (error) {
      // If the user couldn't be found
      res
        .status(401)
        .clearCookie("JWT")
        .json({
          status: 401,
          error: "Account doesn't exist; token invalid"
        });
      return;
    }

    // If the token is valid and the user was loaded
    next();
  }

  /**
   * Checks for authorization in the current inventory for the acting user
   *
   * @static
   * @param {Response} res The Express response object
   * @param {InventoryUserAccessRightsEnum} accessRights
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  public static async authOrError(
    res: Response,
    accessRights: InventoryUserAccessRightsEnum
  ): Promise<void> {
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory as Inventory,
        accessRights
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the " + accessRights + " role or higher for this inventory."
      });
      return;
    }
  }
}
