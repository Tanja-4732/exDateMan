import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import stocksRoutes from "./stocksRoutes";
import { ThingController } from "../../../controllers/thingController";

const thingsRoutes: Router = Router();

// CRUD
// Return all things
thingsRoutes.get("/", ThingController.getAllThings);

// Create new thing
thingsRoutes.post("/", ThingController.createNewThing);

// Resolve barcode
thingsRoutes.get("/code/:code", ThingController.getByCode);

// Set the thingNo
thingsRoutes.use("/:thingNo", ThingController.setThingInDotLocals);

// Use stocks routes
thingsRoutes.use("/:thingNo/stocks", stocksRoutes);

// Return one thing
thingsRoutes.get("/:thingNo", ThingController.getThing);

// Replace thing
thingsRoutes.put("/:thingNo", ThingController.replaceThing);

// Remove thing
thingsRoutes.delete("/:thingNo", ThingController.deleteThing);

export default thingsRoutes;
