import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import v1Routes from "./stocksRouter";

const thingsRoutes: Router = Router();

// Return all things
thingsRoutes.get("/", (req: Request, res: Response) => {
  // TODO
  log("inventoryId=" + req.params.inventoryId);
  req.res.status(200).json({
    message: "These are all the things of the inventory with id: " + res.locals.inventoryId
  });
});

// Return one thing
thingsRoutes.get("/:thingNb", (req: Request, res: Response) => {
  // TODO

});

thingsRoutes.use("/v1", v1Routes);

export default thingsRoutes;
