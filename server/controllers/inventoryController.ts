import { getManager, EntityManager } from "typeorm";
import { Inventory } from "../models/inventoryModel";
import { Request, Response, NextFunction, Router } from "express";

const inventory: Inventory = new Inventory();

export default class InventoryController {
  private entityManager: EntityManager = getManager();

  /**
   * Handles queries about general inventory information.
   *
   * @export
   * @param {Request} req The request object
   * @param {Response} res The Response object
   * @param {NextFunction} next The next function
   */
  public async getInventoryDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const inventory: Inventory = await this.entityManager.findOne(
      Inventory,
      res.locals.inventoryId
    );
    res.json({
      id: inventory.InventoryId,
      name: inventory.InventoryName,
      users: inventory.inventoryUsers
    });
  }
}
