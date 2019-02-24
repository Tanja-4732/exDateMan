import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import AuthController from "../../../controllers/authController";

const authRoutes: Router = Router();

// Return details about the session
authRoutes.get("/", AuthController.authenticate, AuthController.getAuthDetails);

// Handle login requests
authRoutes.post("/login", AuthController.login);

// Handle registration requests
authRoutes.post("/register", AuthController.register);

export default authRoutes;
