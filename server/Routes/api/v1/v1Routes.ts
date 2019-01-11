import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import authRoutes from "./authRoutes";
import inventoriesRoutes from "./inventoriesRoutes";

const v1Routes: Router = Router();

// Default welcome message
v1Routes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Connected to ExDateMan API version 1"
  });
});

// Use the things routes
v1Routes.use("/things", thingsRoutes);

// Authentication test
v1Routes.use("/auth", authRoutes);

export default v1Routes;
