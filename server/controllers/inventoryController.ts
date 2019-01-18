import { getManager, EntityManager } from "typeorm";
import { Inventory } from "../models/inventoryModel";
import { Request, Response, NextFunction, Router } from "express";
import { User } from "server/models/userModel";

export default class InventoryController {

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
      const entityManager: EntityManager = getManager();
    const inventory: Inventory = await entityManager.findOne(
      Inventory,
      res.locals.inventoryId
    );
    res.json({
      id: inventory.InventoryId,
      name: inventory.InventoryName,
      users: inventory.inventoryUsers
    });
  }

  /**
   * Adds a new inventory to the db based on the received JSON
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof InventoryController
   */
  public addNewInventory(
    req: Request,
    res: Response,
    next: NextFunction
    ): void {
      const entityManager: EntityManager = getManager();
      // Generate the inventory object to later be saved to the db
      const invToAdd: Inventory = new Inventory(req.body.name);
      // Find the user who issued this request
      const creatingUser: User = entityManager.findOne(req)
      // Make an array of users
      // TODO
      // Set the array of users
      invToAdd.inventoryUsers.push()
      // Add the inventory to the db
      entityManager.save(invToAdd);
    }
}
