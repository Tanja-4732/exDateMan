import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";
import StockController from "../../../controllers/stockController";

const stocksRoutes: Router = Router();

// Return all stocks
// TODO implement
stocksRoutes.get("/", StockController.getStocks);

export default stocksRoutes;
