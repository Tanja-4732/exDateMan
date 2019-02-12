import { model } from "mongoose";
import { ThingSchema } from "../models/mongodb/thingModel";
import { Request, Response, NextFunction } from "express";
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
   * Sets the thing variable in res.locals or responds with 404
   *
   * @static
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<void>}
   * @memberof ThingController
   */
  public static async setThingInDotLocals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.locals.thing = await ThingController.getThingOrFail(
        req.params.thingNo,
        res.locals.inventory
      );
    } catch (err) {
      res.status(404).json({
        status: 404,
        error: "The requested thing could not be found."
      });
      return;
    }
    next();
  }

  /**
   * Implements the middleware for adding a new thing
   *
   * @param {Request} req The express request
   * @param {Response} res The express response
   * @memberof ThingController
   */
  public static async createNewThing(
    req: Request,
    res: Response
  ): Promise<void> {
    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser as User,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.WRITE
      ))
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
        error: "Invalid request syntax or parameters"
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
    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.READ
      )) // TODO implement one unified pass or denied method; preferably with fake-404 toggle
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the READ role or higher for this inventory."
      });
      return;
    }

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
        error: "Invalid parameters. Couldn't execute request."
      });
    }
    // Send success response with data
    res.status(200).json({
      inventoryId: res.locals.inventory.InventoryId,
      things: things
    });
  }

  public static async getThing(req: Request, res: Response): Promise<void> {
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
    res.status(200).json({
      status: 200,
      message: "Returned thing",
      thing: res.locals.thing as Thing
    });
  }

  public static async replaceThing(req: Request, res: Response): Promise<void> {
    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser as User,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.WRITE
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the WRITE role or higher for this inventory."
      });
      return;
    }

    // TODO
  }

  public static async deleteThing(req: Request, res: Response): Promise<void> {
    // Check for authorization
    if (
      !(await AuthController.isAuthorized(
        res.locals.actingUser as User,
        res.locals.inventory as Inventory,
        InventoryUserAccessRightsEnum.WRITE
      ))
    ) {
      res.status(403).json({
        status: 403,
        error:
          "Requestor doesn't have the WRITE role or higher for this inventory."
      });
      return;
    }

    // Get entityManager
    const entityManager: EntityManager = getManager();
    try {
      // Delete thing
      entityManager.remove(res.locals.thing as Thing);
    } catch (err) {
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
      return;
    }

    res.status(200).json({
      status: 200,
      message: "Thing deleted"
    });
  }
}
