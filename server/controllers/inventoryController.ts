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
import UserController from "./userController";
import { Thing } from "../models/thingModel";

interface InventoryRequest {
  name: string;
  owner: User;
  admins: number[];
  writeables: number[];
  readables: number[];
}

export default class InventoryController {
  public static async setInventoryInResDotLocals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // log("setting inv");
    try {
      res.locals.inventory = await InventoryController.getInventoryOrFail(
        req.params.inventoryId
      );
    } catch (error) {
      res.status(404).json({
        status: 404,
        error: "Inventory " + req.params.inventoryId + " couldn't be found."
      });
      return;
    }
    // log("Set inv to:\n" + JSON.stringify(res.locals.))
    next();
  }

  // TODO implement listing of all accessible inventories
  public static async getInventories(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const entityManager: EntityManager = getManager();
    const inventories: Inventory[] = [];
    let inventoryUsers: InventoryUser[] = [];

    try {
      // Get the inventoryUsers associated with the acting user
      inventoryUsers = await entityManager.find(InventoryUser, {
        relations: ["inventory"],
        where: {
          user: res.locals.actingUser
        }
      });
    } catch (error) {
      // Return server error
      log("Error in getInventories:\n" + error);
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
    }

    for (const inventory of inventoryUsers) {
      inventories.push(inventory.inventory);
    }

    res.status(200).json({
      status: 200,
      message: "All accessible inventories have been retrieved.",
      inventories: inventories
    });

    // TODO remove dead code
    /* res.status(403).json({
      message: "The enumeration of all inventories is not permitted."
    }); */
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
        error: "The requested inventory couldn't be found"
      });
      return;
    }

    if (
      (await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory,
        InventoryUserAccessRightsEnum.READ
      )) === false
    ) {
      res.status(403).json({
        status: 403,
        error:
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
    res: Response
  ): Promise<void> {
    // Generate the inventory object to later be saved to the db
    const invToAdd: Inventory = new Inventory(req.body.name);

    // Set the owner to the acting user
    req.body.owner = res.locals.actingUser;

    // Try to write changes to the db
    switch (
      (await InventoryController.setInventory(invToAdd, req.body)) as number
    ) {
      case 200:
        res.status(200).json({
          message: "Added inventory",
          inventory: {
            id: invToAdd.InventoryId,
            name: invToAdd.InventoryName
          }
        });
        break;
      case 400:
        res.status(400).json({
          status: 400,
          error: "Can't assign a user multiple roles for one inventory"
        });
        break;
      case 404:
        res.status(404).json({
          status: 404,
          error: "Couldn't find one or more specified users"
        });
        break;
    }
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
    res: Response
  ): Promise<void> {
    // Get the inventory object to later be updated on the db
    const invToEdit: Inventory = res.locals.inventory;

    // Check authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        invToEdit,
        InventoryUserAccessRightsEnum.ADMIN
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the ADMIN or OWNER role for this inventory."
      });
      return;
    }

    try {
      // Read the requested owners userId from the request
      // and replace it with its corresponding user object
      req.body.owner = await UserController.getUserByIdOrFail(req.body
        .owner as number);
    } catch (error) {
      res.status(404).json({
        status: 404,
        error: "Couldn't find one or more specified users"
      });
    }

    // Try to write changes to the db
    switch (
      (await InventoryController.setInventory(invToEdit, req.body)) as number
    ) {
      case 200:
        res.status(200).json({
          message: "Updated inventory",
          inventory: {
            id: invToEdit.InventoryId,
            name: invToEdit.InventoryName
          }
        });
        break;
      case 400:
        res.status(400).json({
          status: 400,
          error: "Can't assign a user multiple roles for one inventory"
        });
        break;
      case 404:
        res.status(404).json({
          status: 404,
          error: "Couldn't find one or more specified users"
        });
        break;
    }
  }

  public static async deleteInventory(
    req: Request,
    res: Response
  ): Promise<void> {
    // Get the inventory object to later be updated on the db
    const invToDelete: Inventory = res.locals.inventory;

    // Get the entity manager
    const entityManager: EntityManager = getManager();

    // Check authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        invToDelete,
        InventoryUserAccessRightsEnum.ADMIN
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the ADMIN or OWNER role for this inventory."
      });
      return;
    }

    try {
      /*  Old code // TODO delete when ready
      // Delete all InventoryUsers
      await entityManager.delete(InventoryUser, {
        inventory: invToDelete
      });

      // Delete all things
      await entityManager.delete(Thing, {
        Inventory: invToDelete.InventoryId
      }); */

    /*Remove the inventory.
      This should be sufficient because of
      the CASCADE option set in the inventoryModel. */
      entityManager.remove(invToDelete);
    } catch (error) {
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
      return;
    }
    res.status(200).json({
      status: 200,
      error: "The inventory was deleted."
    });
  }

  /**
   * Writes inventory-related data to the db
   *
   * Business logic method; doesn't do http requests
   */
  private static async setInventory(
    invToSet: Inventory,
    invReq: InventoryRequest
  ): Promise<number> {
    const entityManager: EntityManager = getManager();

    // Make an array of inventoryUser
    const invUsers: InventoryUser[] = [];

    try {
      // Set inventory owner
      invUsers[0] = new InventoryUser(
        invToSet,
        invReq.owner,
        InventoryUserAccessRightsEnum.OWNER
      );

      // Admins
      for (const userId of invReq.admins) {
        invUsers.push(
          new InventoryUser(
            invToSet,
            await UserController.getUserByIdOrFail(userId),
            InventoryUserAccessRightsEnum.ADMIN
          )
        );
      }

      // Writeables
      for (const userId of invReq.writeables) {
        invUsers.push(
          new InventoryUser(
            invToSet,
            await UserController.getUserByIdOrFail(userId),
            InventoryUserAccessRightsEnum.WRITE
          )
        );
      }

      // Readables
      for (const userId of invReq.readables) {
        invUsers.push(
          new InventoryUser(
            invToSet,
            await UserController.getUserByIdOrFail(userId),
            InventoryUserAccessRightsEnum.READ
          )
        );
      }
    } catch (error) {
      return 404;
    }

    // Validate for unique
    const userSet: Set<number> = new Set<number>([]);
    for (const iu of invUsers as InventoryUser[]) {
      log("User: " + JSON.stringify(iu.user.UserId, null, 2));
      if (userSet.has(iu.user.UserId)) {
        return 400;
      } else {
        userSet.add(iu.user.UserId);
      }
    }

    // Set the array of users
    invToSet.inventoryUsers = invUsers;

    try {
      // Use a transaction to roll back a delete if the inserting process fails
      await getManager().transaction(
        "SERIALIZABLE",
        async (transactionalEntityManager: EntityManager) => {
          // Remove the InventoryUsers form the inventory
          await transactionalEntityManager.delete(InventoryUser, {
            inventory: invToSet
          });

          // Add the inventory to the db
          await transactionalEntityManager.save(invToSet);
        }
      );
    } catch (err) {
      return 400;
    }
    return 200;
  }
}
