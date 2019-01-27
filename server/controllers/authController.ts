import { Request, Response, NextFunction } from "express";
import UserController from "./userController";
import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { User } from "server/models/userModel";
import * as expressJwt from "express-jwt";
import { log } from "util";
import { hash, compareSync } from "bcrypt";

const RSA_PRIVATE_KEY: Buffer = readFileSync(process.env.EDM_RSA_PRIVATE_KEY);
const PUBLIC_KEY: Buffer = readFileSync(process.env.EDM_PUBLIC_KEY);

export default class AuthController {
  /**
   * Registers new users
   */
  public register(req: Request, res: Response, next: NextFunction): any {
    /**
     * The number of rounds the passwords hash will be salted for
     */
    const saltRounds: number = 10 as number;

    /**
     * The password requested to be set
     * for the new account by the applicant
     * in plain text
     */
    const plaintextPassword: string = req.body.pwd as string;

    hash(plaintextPassword, saltRounds, (err: Error, hash: string) => {
      log(hash);
    });
  }

  /**
   * Login using JWT
   *
   * This method handles the login process and
   * provides JWTs for the authenticated users
   */
  public async login(req: Request, res: Response): Promise<void> {
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
      actingUser = await new UserController().findUserForEmailOrFail(email);
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: "Bad request",
        message: "Couldn't find email address"
      });
    }

    // Credential validation, return 401 on invalid credentials
    log(compareSync(password, actingUser.SaltedPwdHash) + "");

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

    res.cookie("JWT", jwtBearerToken, { httpOnly: true }).json({
      // res.cookie("JWT", jwtBearerToken).json({
      status: "Success",
      user: actingUser.UserName
    });
  }

  // TODO password salter & hasher

  /**
   * Authenticates a user's JWT and extracts the userId into res.locals.actingUser
   */
  public async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    log("Authentication stared"); // TODO remove log

    let decoded: any;
    try {
      log("All cookies: " + req.cookies);
      decoded = jwt.verify(req.cookies["JWT"], PUBLIC_KEY);
    } catch (e) {
      // log(e);
      res.status(401).json({
        status: 401,
        error: "Unauthorized",
        message: "Invalid credentials (need valid JWT as cookie)"
      });
    }

    res.locals.actingUser = decoded.sub;
    next();
  }
}
