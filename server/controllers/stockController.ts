import { EntityManager, getManager } from "typeorm";
import { User } from "../models/userModel";
import { log } from "util";
import { Response, Request } from "express";
import { Stock } from "../models/stockModel";
import { Thing } from "../models/thingModel";
import AuthController from "./authController";
import { Inventory } from "../models/inventoryModel";
import { InventoryUserAccessRightsEnum } from "../models/inventoryUserModel";

/**
 * Contains db handling code for Stock-class operations
 *
 * All operations involving the Stock-class and a db connection
 * should be implemented here.
 */
export default class StockController {
  public static async getStocks(req: Request, res: Response): Promise<void> {
    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.READ
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the READ role or higher for this inventory."
      });
      return;
    }

    const entityManager: EntityManager = getManager();

    let stocks: Stock[];

    try {
      stocks = await entityManager.find(Stock, {
        where: {
          thing: res.locals.thing as Thing
        }
      });
    } catch (error) {
      res.status(500).json({
        error: "Something went wrong server-side."
      });
      return;
    }

    res.status(200).json({
      stocks: stocks
    });
  }
}
