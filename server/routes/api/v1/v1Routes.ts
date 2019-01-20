import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import authRoutes from "./authRoutes";
import inventoriesRoutes from "./inventoriesRoutes";
import AuthController, { auth } from "../../../controllers/authController";

const v1Routes: Router = Router();
const authController: AuthController = new AuthController();

// Default welcome message
v1Routes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Connected to ExDateMan API version 1"
  });
});

// Use the inventories routes
// v1Routes.use("/inv", auth, inventoriesRoutes);
// v1Routes.use("/inv", new AuthController().authenticate, inventoriesRoutes);
v1Routes.use("/inv", authController.authenticate, inventoriesRoutes);

// Authentication test
v1Routes.use("/auth", authRoutes);

export default v1Routes;
