import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import StockController from "../../../controllers/stockController";

const stocksRoutes: Router = Router();

// Return all stocks
// TODO implement
stocksRoutes.get("/", StockController.getStocks);

// Add stock
stocksRoutes.post("/", StockController.addStock);

// Set stock into res.locals.stock
stocksRoutes.use("/:stockNo", StockController.setStockInDotLocals);

// Get stock
stocksRoutes.get("/:stockNo", StockController.getStock);

// Update stock
stocksRoutes.put("/:stockNo", StockController.updateStock);

// Delete stock
stocksRoutes.delete("/:stockNo", StockController.removeStock);

export default stocksRoutes;
