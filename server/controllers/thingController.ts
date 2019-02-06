import { model } from "mongoose";
import { ThingSchema } from "../models/mongodb/thingModel";
import { Request, Response } from "express";
import { EntityManager, getManager } from "typeorm";
import { Thing } from "../models/thingModel";
import { Inventory } from "../models/inventoryModel";
import AuthController from "./authController";
import { InventoryUserAccessRightsEnum } from "../models/inventoryUserModel";
import { Category } from "../models/categoryModel";
import { User } from "../models/userModel";

interface ThingRequest {
  number: number;
  name: string;
  categories: Category[]; // originally number[]
}

/**
 * Implements the middleware for the API endpoints for express
 *
 * @export
 * @class ThingController
 */
export class ThingController {
  /**
   * Returns one thing object based on its number and inventory or fails
   */
  public static async getThingOrFail(
    thingNo: number,
    inventory: Inventory
  ): Promise<Thing> {
    const entityManager: EntityManager = getManager();
    return await entityManager.findOneOrFail(Thing, {
      where: {
        ThingNo: thingNo,
        Inventory: inventory
      }
    });
  }

  /**
   * Implements the middleware for adding a new thing
   *
   * @param {Request} req The express request
   * @param {Response} res The express response
   * @memberof ThingController
   */
  public static async createNewThing(req: Request, res: Response): Promise<void> {
    // Check for authorization
    if (
      ! await AuthController.isAuthorized(
        res.locals.actingUser as User,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.WRITE
      )
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the WRITE role or higher for this inventory."
      });
      return;
    }

    // Get the entity manager
    const entityManager: EntityManager = getManager();

    // Create and set thing // TODO implement thing constructor
    const thingToAdd: Thing = new Thing();
    thingToAdd.Inventory = res.locals.inventory as Inventory;
    thingToAdd.ThingName = (req.body as ThingRequest).name;
    thingToAdd.ThingNo = (req.body as ThingRequest).number;

    try {
      entityManager.save(thingToAdd);
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: "Bad request"
      });
      return;
    }
    res.status(201).json({
      status: 201,
      message: "Created thing",
      thing: {
        inventoryId: thingToAdd.Inventory.InventoryId,
        name: thingToAdd.ThingName,
        number: thingToAdd.ThingNo,
        categories: thingToAdd.Categories
      }
    });
  }

  public static async getAllThings(req: Request, res: Response): Promise<void> {
    // Check authorization
    AuthController.isAuthorized(
      res.locals.actingUser,
      res.locals.inventory.Inventory,
      InventoryUserAccessRightsEnum.READ
    );

    // Get the things
    const entityManager: EntityManager = getManager();
    let things: Thing[];
    try {
      things = await entityManager.find(Thing, {
        where: {
          Inventory: res.locals.inventory as Inventory
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        error: "Bad request",
        message: "Invalid parameters. Couldn't execute request."
      });
    }
    // Send success response with data
    res.status(200).json({
      inventoryId: res.locals.inventory.InventoryId,
      things: things
    });
  }

  public static getThing(req: Request, res: Response): void {
    // TODO
  }

  public static replaceThing(req: Request, res: Response): void {
    // TODO
  }

  public static deleteThing(req: Request, res: Response): void {
    // TODO
  }
}
