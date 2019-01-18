import { getManager, EntityManager } from "typeorm";
import { Inventory } from "../models/inventoryModel";
import { Request, Response, NextFunction, Router } from "express";
import { User } from "../models/userModel";
import { log } from "util";
import {
  InventoryUser,
  InventoryUserAccessRightsEnum
} from "../models/inventoryUserModel";

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
    log("Requested inv name: " + req.body.name);
    log("Req admins:" + req.body.admins);
    const invToAdd: Inventory = new Inventory(req.body.name);

    // Find the user who issued this request
    const owningUser: User = entityManager.findOne(User, res.locals.userId);

    // Make an array of inventoryUser // TODO Implement loops to add multiple with permissions
    const invUsers: InventoryUser[] = InventoryUser[];

    // Add all of the admins
    req.body.admins.forEach(adminId => {
      const adminToAdd: User = entityManager.findOne(User, adminId);
      const invUser = new InventoryUser();
      invUser.user = adminToAdd;
      invUser.inventory = invToAdd;
      invUsers.push(invUser);
    });

    invUsers.user = owningUser;
    invUsers.inventory = invToAdd;
    invUsers.InventoryUserAccessRights = InventoryUserAccessRightsEnum.OWNER;

    // Set the array of users
    invToAdd.inventoryUsers.push(invUsers);

    // Add the inventory to the db
    entityManager.save(invToAdd);
  }
}
