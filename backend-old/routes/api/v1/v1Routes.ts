import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import accountRoutes from "./accountRoutes";
import inventoriesRoutes from "./inventoriesRoutes";
import AccountController from "../../../controllers/accountController";
import userRoutes from "./userRoutes";

const v1Routes: Router = Router();

// Default welcome message
v1Routes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Connected to ExDateMan API version 1"
  });
  return;
});

// Authenticate and use the inventories routes
v1Routes.use("/inv", AccountController.authenticate, inventoriesRoutes);

// Use authentication routes
v1Routes.use("/account", accountRoutes);

// Handle login requests
v1Routes.post("/login", AccountController.login);

// Handle logout requests
v1Routes.post("/logout", AccountController.logout);

// Use user routes
v1Routes.use("/users", AccountController.authenticate, userRoutes);

export default v1Routes;
