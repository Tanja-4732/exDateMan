import { Request, Response, NextFunction } from "express";
import UserController from "./userController";
import * as jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { User } from "server/models/userModel";

const RSA_PRIVATE_KEY: Buffer = readFileSync("./demos/private.key");

export default class AuthController {
  public loginRoute(req: Request, res: Response, next: NextFunction) {
    const email: string = req.body.email,
      password: string = req.body.pwd;

    // TODO Implement credential validation here 401

    const user: User = new UserController().findUserForEmail(email);

    const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "10h",
      subject: user.UserId
    });

    res.cookie("JWT", jwtBearerToken, { httpOnly: true, secure: true });
  }
}
