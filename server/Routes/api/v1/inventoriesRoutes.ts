import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";


const inventoriesRoutes: Router = Router();

// Don't return all inventories
inventoriesRoutes.get("/", (req: Request, res: Response) => {
  res.status(304).json({
    message: "The enumeration of all inventories is not supported."
  });
});

export default inventoriesRoutes;
