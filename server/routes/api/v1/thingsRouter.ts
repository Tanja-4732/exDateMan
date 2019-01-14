import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import stocksRoutes from "./stocksRouter";

const thingsRoutes: Router = Router();

// Set the thingNo
thingsRoutes.use(
  "/:thingNo",
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.thingNo = req.params.thingNo;
    next();
  }
);

// Use stocks routes
thingsRoutes.use("/:thingNo/stocks", stocksRoutes);

// CRUD
// Return all things
thingsRoutes.get("/", (req: Request, res: Response) => {
  // TODO
  log("inventoryId=" + req.params.inventoryId);
  req.res.status(200).json({
    message: "These are all the things of the inventory with id: " + res.locals.inventoryId
  });
});

// Return one thing
thingsRoutes.get("/:thingNo", (req: Request, res: Response) => {
  // TODO

});

// Create new thing
thingsRoutes.post("/", (req: Request, res: Response) => {
  // TODO

});

// Replace thing
thingsRoutes.put("/:thingNo", (req: Request, res: Response) => {
  // TODO

});

// Remove thing
thingsRoutes.delete("/:thingNo", (req: Request, res: Response) => {
  // TODO

});

// Set thingNo
thingsRoutes.use(
  "/:thingNo",
   (req: Request, res: Response, next: NextFunction) => {
       res.locals.thingNo = req.params.thingNo;
    next();
  }
);

// Use stocks routes
thingsRoutes.use("/:thingNo/stocks", stocksRoutes);

export default thingsRoutes;
