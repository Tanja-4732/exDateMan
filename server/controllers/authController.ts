import { Request, Response, NextFunction } from "express";
import UserController from "./userController";
import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { User } from "server/models/userModel";
// import expressJwt = require("express-jwt");
import * as expressJwt from "express-jwt";
import { log } from "util";

const RSA_PRIVATE_KEY: Buffer = readFileSync(process.env.EDM_RSA_PRIVATE_KEY);
const PUBLIC_KEY: Buffer = readFileSync(process.env.EDM_PUBLIC_KEY);

export default class AuthController {
  public setTestCookie(req: Request, res: Response, next: NextFunction): any {
    res.cookie("test", "testing").json({
      message: "success"
    });
  }

  /**
   * Login to JWT
   *
   * This method handles the login process and
   * provides JWTs for the authenticated users
   */
  public async login(req: Request, res: Response): Promise<void> {
    const email: string = req.body.email,
      password: string = req.body.pwd;

    // TODO Implement credential validation here 401

    // The user who makes the request
    const actingUser: User = await new UserController().findUserForEmail(email);

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
      status: "success",
      user: actingUser.UserName
    });
  }

  // TODO password salter & hasher

  /**
   * Authenticates a user's JWT and extracts the userId into the res.userId
   */
  public async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    log("So secure 2");
    log("All cookies: " + req.cookies);

    let decoded;
    try {
      decoded = jwt.verify(req.cookies["JWT"], PUBLIC_KEY);
    } catch (e) {
      log(e);
      res.status(401).json({
        status: 401,
        error: "unauthorized",
        message: "invalid credentials (need valid JWT as cookie)"
      });
    }
    res.locals.userId = decoded.sub;
    log("UserId: " + res.locals.userId);
    next();
  }
}
