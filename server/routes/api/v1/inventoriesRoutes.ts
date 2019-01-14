import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import thingsRoutes from "./thingsRouter";

const inventoriesRoutes: Router = Router();

// Don't return all inventories
inventoriesRoutes.get("/", (req: Request, res: Response) => {
  res.status(403).json({
    message: "The enumeration of all inventories is not permitted."
  });
});

// Set inventoryId
inventoriesRoutes.use(
  "/:inventoryId",
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.inventoryId = req.params.inventoryId;
    next();
  }
);

// Use things routes
inventoriesRoutes.use("/:inventoryId/things", thingsRoutes);

// Give information about a specific inventory, if the user is authorized to do so
inventoriesRoutes.use("/:inventoryId", (req: Request, res: Response) => {
  // if (existsInDB(req.params.inventoryId)) { // TODO implement
  res.status(200).json({
    owner: {
      userId: "userId",
      name: "name",
      userEmail: "email"
    },
    readPermitted: [23424, 167542, 457457, 896722],
    writePermitted: [23424, 457457]
  });
  // } else { // TODO implement
  res.status(400).json({
    message: "The enumeration of all inventories is not permitted."
  });
  // } // TODO implement
});

export default inventoriesRoutes;
