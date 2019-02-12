import { Router } from "express";
import thingsRoutes from "./thingsRouter";
import categoriesRoutes from "./categoriesRoutes";
import InventoryController from "../../../controllers/inventoryController";

const inventoriesRoutes: Router = Router();

// Don't return all inventories
inventoriesRoutes.get("/", InventoryController.getInventories);

// Set inventory
inventoriesRoutes.use(
  "/:inventoryId",
  InventoryController.setInventoryInResDotLocals
);

// Use things routes
inventoriesRoutes.use("/:inventoryId/things", thingsRoutes);

// Use categories routes
inventoriesRoutes.use("/:inventoryId/categories", categoriesRoutes);

// Return one inventory
inventoriesRoutes.get("/:inventoryId", InventoryController.getInventoryDetails);

// Create new inventory
inventoriesRoutes.post("/", InventoryController.addNewInventory);

// Replace existing inventory
inventoriesRoutes.put("/:inventoryId", InventoryController.replaceInventory);

// Delete inventory
inventoriesRoutes.delete("/:inventoryId", InventoryController.deleteInventory);

export default inventoriesRoutes;
