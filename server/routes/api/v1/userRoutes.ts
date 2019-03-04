import { Router } from "express";

import UserController from "../../../controllers/userController";

const userRoutes: Router = Router();

// Get one user by email
userRoutes.get("/:email", UserController.getUserByEmail);

export default userRoutes;
