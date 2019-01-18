import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import thingsRoutes from "./thingsRouter";
import InventoryController from "../../../controllers/inventoryController";

const inventoriesRoutes: Router = Router();

/**
 * Security
 *
 * Validate user token and set the userId in the res.locals object
 */
inventoriesRoutes.use(
  "/",
  // jwt({ secret: "sneak-around" }),
  (req: Request, res: Response, next: NextFunction) => {
    log("So secure.");
    res.locals.userId = 42;
    next();
  }
);

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
inventoriesRoutes.get(
  "/:inventoryId",
  new InventoryController().getInventoryDetails
);

// Create new inventory
inventoriesRoutes.post("/", new InventoryController().addNewInventory);

export default inventoriesRoutes;
