import { Router } from "express";

import UserController from "../../../controllers/userController";

const thingsRoutes: Router = Router();

// Get one user by email
thingsRoutes.get("/:email", UserController.getUserByEmail);

export default thingsRoutes;
