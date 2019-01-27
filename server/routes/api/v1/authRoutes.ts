import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import AuthController from "../../../controllers/authController";

const authRoutes: Router = Router();
const authController: AuthController = new AuthController();

// Return details about the session
authRoutes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "You are authenticated."
  });
});

// Handle login requests
authRoutes.post("/login", authController.login);

// Handle registration requests
authRoutes.post("/register", authController.register);

export default authRoutes;
