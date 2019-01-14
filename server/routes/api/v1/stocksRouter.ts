import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

const stocksRoutes: Router = Router();

// Return all stocks
stocksRoutes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "These are all stocks of thingNo " + res.locals.thingNo
    + " in the inventory with Id of " + res.locals.inventoryId
  });
});



export default stocksRoutes;
