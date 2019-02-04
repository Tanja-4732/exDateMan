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
  public static async setInventoryInResDotLocals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try{
        res.locals.inventory = await InventoryController.getInventoryOrFail(
          req.params.inventoryId
        );
    } catch (error) {
      res.status(404).json({
        status: 404,
        error: "Inventory " + req.params.inventoryId + "couldn't be found."
      });
    }
    log("Parsed inv id: " + res.locals.inventory.InventoryId);
    next();
  }

  public static async disallowInventoryEnumeration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    res.status(403).json({
      message: "The enumeration of all inventories is not permitted."
    });
  }

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

    const entityManager: EntityManager = getManager();
    let inventory: Inventory;
    try {
      inventory = await entityManager.findOneOrFail(
        Inventory,
        res.locals.inventory.InventoryId
      );
    } catch (error) {
      res.status(404).json({
        status: 404,
        error: "Not found",
        message: "The requested inventory couldn't be found"
      });
      return;
    }

    if (
      !AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory,
        InventoryUserAccessRightsEnum.READ
      )
    ) {
      res.status(403).json({
        status: 403,
        error: "Forbidden",
        message:
          "The requesting user must have " +
          "at least the READ permission in this inventory."
      });
      return;
    }

    // Return requested info with 200
    res.status(200).json({
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

    log(
      "invController: " +
        invToAdd.inventoryUsers[0].inventory.InventoryId +
        " " +
        invToAdd.inventoryUsers[0].user.Email +
        " " +
        invToAdd.inventoryUsers[0].InventoryUserAccessRights
    );

    // Add the inventory to the db
    await entityManager.save(invToAdd);

    log(
      "invController: " +
        invToAdd.inventoryUsers[0].inventory.InventoryId +
        " " +
        invToAdd.inventoryUsers[0].user.Email +
        " " +
        invToAdd.inventoryUsers[0].InventoryUserAccessRights
    );

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
    // TODO implement this
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const entityManager: EntityManager = getManager();

    // Get the inventory object to be replaced on the db
    log("Requested inv name: " + req.body.name);
    log("Req admins:" + req.body.admins);
    const invToEdit: Inventory = res.locals.inventory;

    // Check for authorization
    AuthController.isAuthorized(
      res.locals.actingUser,
      res.locals.inventory,
      InventoryUserAccessRightsEnum.ADMIN
    );

    // Make an array of inventoryUser // TODO Implement loops to add multiple with permissions
    const invUsers: InventoryUser[] = [];

    // Set the inventory reference in each inventoryUser
    invUsers.forEach((invUser: InventoryUser) => {
      invUser.inventory = invToEdit;
    });

    // Set the array of users
    invToEdit.inventoryUsers = invUsers;

    // Add the inventory to the db
    entityManager.save(invToEdit);

    res.status(200).json({
      message: "Replaced inventory",
      id: invToEdit.InventoryId,
      name: invToEdit.InventoryName
      // owner: requestingUser.Email
    });
  }
}
