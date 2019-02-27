import { model } from "mongoose";
import { Request, Response, NextFunction } from "express";
import { EntityManager, getManager, In } from "typeorm";
import { Thing } from "../models/thingModel";
import { Inventory } from "../models/inventoryModel";
import AuthController from "./authController";
import { InventoryUserAccessRightsEnum } from "../models/inventoryUserModel";
import { Category } from "../models/categoryModel";
import { User } from "../models/userModel";
import { log, debug } from "util";

interface ThingRequest {
  name: string;
  categories: number[];
}

/**
 * Implements the middleware for the API endpoints for express
 *
 * @export
 * @class ThingController
 */
export class ThingController {
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
    const entityManager: EntityManager = getManager();
    try {
      res.locals.thing = await entityManager.findOneOrFail(Thing, {
        relations: ["inventory", "categories"],
        where: {
          number: req.params.thingNo as number,
          inventory: res.locals.inventory as Inventory
        }
      });
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
    thingToAdd.inventory = res.locals.inventory as Inventory;
    thingToAdd.name = (req.body as ThingRequest).name;

    // Query collection
    const queries: string[] = [
      // Second attempt
      `
      SELECT  "number" + 1 AS "THE_NUMBER"
      FROM    thing mo
      WHERE   NOT EXISTS
              (
              SELECT  NULL
              FROM    thing mi
              WHERE   mi."number" = mo."number" + 1
                AND mi."inventoryId" = $1
                AND mo."inventoryId" = $1
              )
              AND mo."inventoryId" = $1
      ORDER BY
              "number"
      LIMIT 1;
      `
    ];

    try {
      thingToAdd.number = // req.params.thingNo ||
        // Find the first gap
        (await entityManager.query(queries[0], [
          (res.locals.inventory as Inventory).id
        ]))[0].THE_NUMBER;
    } catch (err) {
      thingToAdd.number = 1;
    }

    // Check for duplicates

    try {
      if (
        (req.body as ThingRequest).categories != null &&
        (req.body as ThingRequest).categories.length !== 0
      ) {
        // Get the categories
        thingToAdd.categories = await entityManager.find(Category, {
          where: {
            // Only the categories from this inventory
            inventory: res.locals.inventory as Inventory,

            // Only the specified ones
            number: In((req.body as ThingRequest).categories)
          }
        });
      }

      // Write changes to the db
      entityManager.save(thingToAdd);
    } catch (error) {
      log("Error in createNewThing:\n" + error);
      // On error, respond with error
      res.status(400).json({
        status: 400,
        error: "Invalid request syntax or parameters"
      });
      return;
    }

    // On success respond with OK and the data
    res.status(201).json({
      inventoryId: thingToAdd.inventory.id,
      name: thingToAdd.name,
      number: thingToAdd.number,
      categories: thingToAdd.categories
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
        relations: ["categories"],
        where: {
          inventory: res.locals.inventory as Inventory
        }
      });
    } catch (error) {
      log("Exception in getAllThings:\n" + error);
      res.status(500).json({
        status: 500,
        error: "Something went wrong server-side."
      });
      return;
    }
    // Send success response with data
    res.status(200).json(
      // inventoryId: res.locals.inventory.InventoryId, // TODO remove line when ready; doesn't work (doesn't need to)
      things
    );
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
    res.status(200).json(res.locals.thing as Thing);
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

    // Get the entity manager
    const entityManager: EntityManager = getManager();

    // Get and set thing
    const thingToEdit: Thing = res.locals.thing; // TODO implement moveToOtherInv
    thingToEdit.name = (req.body as ThingRequest).name;
    thingToEdit.categories = [];

    try {
      if ((req.body as ThingRequest).categories != null && (req.body as ThingRequest).categories.length !== 0) {
        // Set the categories
        for (const category of await entityManager.find(Category, {
          where: {
            // Only the categories from this inventory
            inventory: res.locals.inventory as Inventory,

            // Only the specified ones
            number: In((req.body as ThingRequest).categories)
          }
        })) {
          // Add the category to the array
          thingToEdit.categories.push(category);
        }
      }

      // Write changes to the db
      entityManager.save(thingToEdit);
    } catch (error) {
      log("Error in replaceThing:\n" + error);
      // On error, respond with error
      res.status(400).json({
        status: 400,
        error: "Invalid request syntax or parameters"
      });
      return;
    }

    // On success respond with OK and the data
    res.status(201).json({
      status: 201,
      message: "Created thing",
      thing: {
        inventoryId: thingToEdit.inventory.id,
        name: thingToEdit.name,
        number: thingToEdit.number,
        categories: thingToEdit.categories
      }
    });
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
