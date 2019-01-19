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


authRoutes.post("/login", authController.loginRoute);

export default authRoutes;
