import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import thingsRoutes from "./thingsRouter";
import InventoryController from "../../../controllers/inventoryController";

const inventoriesRoutes: Router = Router();

// Don't return all inventories
inventoriesRoutes.get("/", InventoryController.disallowInventoryEnumeration);

// Set inventory
inventoriesRoutes.use(
  "/:inventoryId",
  InventoryController.setInventoryInResDotLocals
);

// Use things routes
inventoriesRoutes.use("/:inventoryId/things", thingsRoutes);

// Give information about a specific inventory, if the user is authorized to do so
inventoriesRoutes.get("/:inventoryId", InventoryController.getInventoryDetails);

// Create new inventory
inventoriesRoutes.post("/", InventoryController.addNewInventory);

// Replace existing inventory
inventoriesRoutes.post("/", InventoryController.replaceInventory);

// TODO delete inventory

export default inventoriesRoutes;
