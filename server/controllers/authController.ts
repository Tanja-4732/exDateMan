import { Request, Response, NextFunction } from "express";
import UserController from "./userController";
import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { User } from "server/models/userModel";

const RSA_PRIVATE_KEY: Buffer = readFileSync(process.env.EDM_RSA_PRIVATE_KEY);

export default class AuthController {
  /**
   * Login to JWT
   *
   * This method handles the login process and
   * provides JWTs for the authenticated users
   */
  public async loginRoute(req: Request, res: Response): Promise<void> {
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

    res.cookie("JWT", jwtBearerToken, { httpOnly: true, secure: true }).json({
      status: "success",
      user: actingUser.UserName
    });
  }
}
