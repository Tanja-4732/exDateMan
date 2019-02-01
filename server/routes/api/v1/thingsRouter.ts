import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import stocksRoutes from "./stocksRouter";
import { ThingController } from "../../../controllers/thingController";

const thingsRoutes: Router = Router();

// Set the thingNo
thingsRoutes.use(
  "/:thingNo",
  async (req: Request, res: Response, next: NextFunction) => {
    res.locals.thing = await ThingController.getThingOrFail(req.params.thingNo, res.locals.inventory);
    next();
  }
);

// Use stocks routes
thingsRoutes.use("/:thingNo/stocks", stocksRoutes);

// CRUD
// Return all things
thingsRoutes.get("/", ThingController.getAllThings);

// Return one thing
thingsRoutes.get("/:thingNo", ThingController.getThing);

// Create new thing
thingsRoutes.post("/", ThingController.createNewThing);

// Replace thing
thingsRoutes.put("/:thingNo", ThingController.replaceThing);

// Remove thing
thingsRoutes.delete("/:thingNo", ThingController.deleteThing);

export default thingsRoutes;
