import { EntityManager, getManager } from "typeorm";
import { log } from "util";
import { Response, Request } from "express";
import { Stock } from "../models/stockModel";
import { Thing } from "../models/thingModel";
import AuthController from "./authController";
import { Inventory } from "../models/inventoryModel";
import { InventoryUserAccessRightsEnum } from "../models/inventoryUserModel";
import { NextFunction } from "connect";

export interface StockRequest {
  exDate: string;
  quantity: string;
  useUpIn: number;
  percentLeft: number;
  openedOn: string;
}

/**
 * Contains db handling code for Stock-class operations
 *
 * All operations involving the Stock-class and a db connection
 * should be implemented here.
 */
export default class StockController {
  public static async getStocks(req: Request, res: Response): Promise<void> {
    // Check for authorization
    await AuthController.authOrError(res, InventoryUserAccessRightsEnum.READ);

    const entityManager: EntityManager = getManager();

    let stocks: Stock[];

    try {
      stocks = await entityManager.find(Stock, {
        where: {
          thingNumber: (res.locals.thing as Thing).number, // TODO #3
          inventory: res.locals.inventory as Inventory
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Something went wrong server-side."
      });
      return;
    }

    res.status(200).json(stocks);
  }

  public static async addStock(req: Request, res: Response): Promise<void> {
    // Check for authorization
    await AuthController.authOrError(res, InventoryUserAccessRightsEnum.WRITE);

    const entityManager: EntityManager = getManager();

    const stockToAdd: Stock = new Stock();

    try {
      stockToAdd.exDate = new Date((req.body as StockRequest).exDate);
      stockToAdd.exDate.setHours(stockToAdd.exDate.getHours() + 1); // Correct for CET
      stockToAdd.percentLeft = (req.body as StockRequest).percentLeft;
      stockToAdd.quantity = (req.body as StockRequest).quantity;
      stockToAdd.useUpIn = (req.body as StockRequest).useUpIn;
      stockToAdd.thingNumber = (res.locals.thing as Thing).number; // TODO #3
      stockToAdd.inventory = res.locals.inventory as Inventory;
      stockToAdd.addedOn = new Date(new Date().setHours(0, 0, 0, 0));
      const schema: string = process.env.EDM_SCHEMA || "edm_dev";
      const numberSuggestion: {
        the_number: number;
      }[] = await entityManager.query( // TODO add one more collumn (addedOn)
        // Get the first gap or 1
        `
        SELECT  "number" + 1 AS the_number
        FROM    (SELECT * FROM ${schema}.stock foo
                WHERE foo."inventoryId" = $1
                AND foo."thingNumber" = $2 UNION ALL
                SELECT 0 AS "number", $2 AS "thingNumber",
                CURRENT_DATE AS "exDate", '' AS "quantity",
                0 AS "useUpIn", 100 AS "percentLeft",
                $1 AS "inventoryId", NULL as "openedOn",
                CURRENT_DATE AS "addedOn") foo
        WHERE   NOT EXISTS
                (
                SELECT  NULL
                FROM    ${schema}.stock bar
                WHERE   bar."number" = foo."number" + 1
                  AND bar."inventoryId" = $1
                  AND foo."inventoryId" = $1

                  AND bar."thingNumber" = $2
                  AND foo."thingNumber" = $2
                )
        ORDER BY
                "number"
        LIMIT 1;
        `,
        [
          (res.locals.inventory as Inventory).id,
          (res.locals.thing as Thing).number
        ]
      );
      stockToAdd.number = numberSuggestion[0].the_number;
    } catch (error) {
      log("Error in addStock:\n" + error);
      res.status(400).json({
        status: 400,
        error: "Invalid request syntax or parameters"
      });
      return;
    }

    try {
      entityManager.save(stockToAdd);
    } catch (error) {
      log("Error in addStock: \n" + error);
      // Report failure
      res.status(500).json({
        error: "Something went wrong server-side."
      });
      return;
    }

    res.status(200).json({ stock: stockToAdd });
  }

  public static async setStockInDotLocals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.locals.stock = await getManager().findOneOrFail(Stock, {
        relations: ["inventory"],
        where: {
          number: req.params.stockNo,
          thingNumber: (res.locals.thing as Thing).number, // TODO #3
          inventory: res.locals.inventory as Inventory
        }
      });
    } catch (error) {
      res.status(404).json({ error: "Stock couldn't be found." });
      return;
    }
    next();
  }

  public static async getStock(req: Request, res: Response): Promise<void> {
    AuthController.authOrError(res, InventoryUserAccessRightsEnum.READ);
    res.status(200).json(res.locals.stock as Stock);
  }

  public static async updateStock(req: Request, res: Response): Promise<void> {
    // Check for authorization
    AuthController.authOrError(res, InventoryUserAccessRightsEnum.WRITE);

    const entityManager: EntityManager = getManager();
    const stockToUpdate: Stock = res.locals.stock as Stock;

    stockToUpdate.exDate = (req.body as StockRequest).exDate
      ? new Date((req.body as StockRequest).exDate)
      : stockToUpdate.exDate;

      stockToUpdate.openedOn = (req.body as StockRequest).openedOn
      ? new Date((req.body as StockRequest).openedOn)
      : stockToUpdate.openedOn;

    stockToUpdate.percentLeft = (req.body as StockRequest).percentLeft
      ? (req.body as StockRequest).percentLeft
      : stockToUpdate.percentLeft;

    stockToUpdate.quantity = (req.body as StockRequest).quantity
      ? (req.body as StockRequest).quantity
      : stockToUpdate.quantity;

    stockToUpdate.useUpIn = (req.body as StockRequest).useUpIn
      ? (req.body as StockRequest).useUpIn
      : stockToUpdate.useUpIn;

    try {
      entityManager.save(stockToUpdate);
    } catch (error) {
      log("Error in addStock: \n" + error);
      // Report failure
      res.status(500).json({
        error: "Something went wrong server-side."
      });
      return;
    }

    res.status(200).json(stockToUpdate);
  }

  public static async removeStock(req: Request, res: Response): Promise<void> {
    await AuthController.authOrError(res, InventoryUserAccessRightsEnum.WRITE);

    const entityManager: EntityManager = getManager();
    const stockToUpdate: Stock = res.locals.stock as Stock;

    try {
      entityManager.remove(stockToUpdate);
    } catch (error) {
      log("Error in addStock: \n" + error);
      // Report failure
      res.status(500).json({
        error: "Something went wrong server-side."
      });
      return;
    }

    res.status(200).json({ removed: stockToUpdate.number });
  }
}
