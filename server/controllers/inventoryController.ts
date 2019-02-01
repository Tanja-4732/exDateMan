import { getManager, EntityManager } from "typeorm";
import { Inventory } from "../models/inventoryModel";
import { Request, Response, NextFunction, Router } from "express";
import { User } from "../models/userModel";
import { log } from "util";
import {
  InventoryUser,
  InventoryUserAccessRightsEnum
} from "../models/inventoryUserModel";
import AuthController from "./authController";

export default class InventoryController {
  /**
   * Handles queries about general inventory information.
   *
   * @export
   * @param {Request} req The request object
   * @param {Response} res The Response object
   * @param {NextFunction} next The next function
   */
  public static async getInventoryDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Check for authorization: READ
    if (!AuthController.isAuthorized(
      res.locals.actingUserId,
      res.locals.inventoryId,
      InventoryUserAccessRightsEnum.READ
    )) {
      res.status(403).json({
        status: 403,
        error: "Forbidden",
        message: "The requesting user must have " +
        "at least the READ permission in this inventory."
      });
      return;
    }

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
   * Returns one inventory object based on its id or fails
   */
  public static async getInventoryOrFail(
    inventoryId: number
  ): Promise<Inventory> {
    const entityManager: EntityManager = getManager();
    return await entityManager.findOneOrFail(Inventory, {
      where: {
        InventoryId: inventoryId
      }
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
  public static async addNewInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const entityManager: EntityManager = getManager();

    // Generate the inventory object to later be saved to the db
    log("Requested inv name: " + req.body.name);
    log("Req admins:" + req.body.admins);
    const invToAdd: Inventory = new Inventory(req.body.name);

    // Find the user who issued this request
    const owningUser: User = await entityManager.findOne(
      User,
      res.locals.actingUserId
    );
    log("Owning user: " + owningUser.Email);

    // Make an array of inventoryUser // TODO Implement loops to add multiple with permissions
    const invUsers: InventoryUser[] = [];

    // Add all of the admins
    // req.body.admins.forEach((adminId: number) => {
    //   const adminToAdd: User = entityManager.findOne(User, adminId);
    //   const invUser = new InventoryUser();
    //   invUser.user = adminToAdd;
    //   invUser.inventory = invToAdd;
    //   invUsers.push(invUser);
    // });

    // Set inventory owner
    invUsers[0] = new InventoryUser();
    invUsers[0].user = owningUser;
    invUsers[0].InventoryUserAccessRights = InventoryUserAccessRightsEnum.OWNER;

    // Set the inventory reference in each inventoryUser
    invUsers.forEach((invUser: InventoryUser) => {
      invUser.inventory = invToAdd;
    });

    // Set the array of users
    invToAdd.inventoryUsers = invUsers;

    // Add the inventory to the db
    entityManager.save(invToAdd);

    res.status(200).json({
      message: "Added inventory",
      id: invToAdd.InventoryId,
      name: invToAdd.InventoryName,
      owner: owningUser.Email
    });
  }

  /**
   * Replaces an existing inventory on the db based on the received JSON
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @memberof InventoryController
   */
  public static async replaceInventory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const entityManager: EntityManager = getManager();

    // Get the inventory object to be replaced on the db
    log("Requested inv name: " + req.body.name);
    log("Req admins:" + req.body.admins);
    const invToEdit: Inventory = res.locals.inventory;

    // Find the user who issued this request
    // TODO change to handeling code of userController
    const requestingUser: User = await entityManager.findOne(
      User,
      res.locals.actingUserId
    );
    log("Requesting user: " + requestingUser.Email);

    // Check for authorization
    AuthController.isAuthorized()

    // Make an array of inventoryUser // TODO Implement loops to add multiple with permissions
    const invUsers: InventoryUser[] = [];

    // Add all of the admins
    // req.body.admins.forEach((adminId: number) => {
    //   const adminToAdd: User = entityManager.findOne(User, adminId);
    //   const invUser = new InventoryUser();
    //   invUser.user = adminToAdd;
    //   invUser.inventory = invToAdd;
    //   invUsers.push(invUser);
    // });

    // Set inventory owner
    invUsers[0] = new InventoryUser();
    invUsers[0].user = requestingUser;
    invUsers[0].InventoryUserAccessRights = InventoryUserAccessRightsEnum.OWNER;

    // Set the inventory reference in each inventoryUser
    invUsers.forEach((invUser: InventoryUser) => {
      invUser.inventory = invToEdit;
    });

    // Set the array of users
    invToEdit.inventoryUsers = invUsers;

    // Add the inventory to the db
    entityManager.save(invToEdit);

    res.status(200).json({
      message: "Added inventory",
      id: invToEdit.InventoryId,
      name: invToEdit.InventoryName,
      owner: requestingUser.Email
    });
  }
}
