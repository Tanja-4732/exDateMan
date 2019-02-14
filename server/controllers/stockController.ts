import { EntityManager, getManager } from "typeorm";
import { User } from "../models/userModel";
import { log } from "util";
import { Response, Request } from "express";

/**
 * Contains db handling code for Stock-class operations
 *
 * All operations involving the Stock-class and a db connection
 * should be implemented here.
 */
export default class StockController {
  public static async getStocks(req: Request, res: Response): Promise<void> {
    const entityManager: EntityManager = getManager();

    let stocks: Stock

    try {
      en
    } catch (error) {

    }
  }
}
