import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import AccountController from "../../../controllers/accountController";

const accountRoutes: Router = Router();

// Return details about the session
accountRoutes.get("/", AccountController.authenticate, AccountController.getAuthDetails);

// Handle registration requests
accountRoutes.post("/", AccountController.register);

// Modify the user
accountRoutes.put("/", AccountController.authenticate, AccountController.alterUser);

export default accountRoutes;
