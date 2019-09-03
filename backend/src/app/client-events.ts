import { Router, Request, Response, NextFunction } from "express";
import { log, error } from "console";
import db from "./db";
import { ServerEvents } from "./server-events";

export class Events {
  /**
   * The template routes
   */
  public routes: Router;

  constructor() {
    // Instantiate the router
    this.routes = Router();

    // Get the events of one inventory
    this.routes.get(
      "/:inventoryUuid",
      this.checkForManagementEventLogs,
      (req: Request, res: Response) => this.getInventoryEvents(req, res),
    );

    // Add an event to an inventory
    this.routes.post(
      "/",
      this.checkForManagementEventLogs,
      (req: Request, res: Response) => this.appendInventoryEvent(req, res),
    );

    // Return an error for an empty get
    this.routes.get("/", this.emptyGet);
  }

  /**
   * Check for the management inventory uuids, and deny access to them
   */
  private checkForManagementEventLogs(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (
      req.body.inventoryUuid == ServerEvents.authorizationEventStreamUuid ||
      req.body.inventoryUuid == ServerEvents.authenticationEventStreamUuid
    ) {
      res.status(403).json({
        message: "You may not access that",
        oof: true,
      });
      return;
    } else {
      next();
    }
  }
  /**
   * Returns an error when the events of all inventories are requested
   */
  private emptyGet(req: Request, res: Response) {
    res
      .status(400)
      .json({ error: "Cannot get events of all inventories at once" });
  }

  private async getInventoryEvents(req: Request, res: Response) {
    // Deny access to management event-logs

    // TODO check for read access #99

    try {
      // Get the events from the db
      const result = await (await db()).query(
        `
        SELECT date, data
          FROM ${process.env.EDM_DB_SCHEMA}.events
        WHERE stream_id = $1
        ORDER BY date ASC;
        `,
        [req.params.inventoryUuid],
      );

      // Send the events back
      res.json(result.rows);
    } catch (err) {
      error(err);
      res.status(400).json({
        message: "That didn't work",
        oof: true,
      });
      return;
    }
  }

  private async appendInventoryEvent(req: Request, res: Response) {
    // TODO check for write access #99

    try {
      // Get the events from the db
      const result = await (await db()).query(
        `
        INSERT INTO ${process.env.EDM_DB_SCHEMA}.events
         (stream_id, date, data)
        VALUES ($1, $2, $3)
        `,
        [
          (req.body as Event).inventoryUuid,
          (req.body as Event).date,
          (req.body as Event).data,
        ],
      );

      // Send the events back
      res.json(result);
    } catch (err) {
      error(err);
      res.status(400).json({
        message: "That didn't work",
        oof: true,
      });
      return;
    }
  }
}

/**
 * The data structure of an event
 */
interface Event {
  /**,
   * The date of the event
   */
  date: Date;

  /**
   * The uuid of the inventory-event-stream this event belongs to
   */
  inventoryUuid: string;

  /**
   * The data of the event
   */
  data: {
    /**
     * The uuid of the item this event is about
     * This information is redundant (but still required) on inventory events
     */
    uuid: string;

    /**
     * The uuid of the user who issued this event
     */
    userUuid: string;

    /**
     * Defines what type of item is this event about
     */
    itemType: itemType;

    /**
     * Defines what type of operation was performed
     */
    crudType: crudType;

    /**
     * The inventory-specific data (if this event is about an inventory)
     */
    inventoryData?: {
      /**
       * The name of this inventory
       */
      name?: string;

      /**
       * The uuid of the owner of this inventory
       */
      ownerUuid?: string;

      /**
       * An array of users who have the admin privilege for this inventory
       */
      adminsUuids?: string[];

      /**
       * An array of user uuids who have the write privilege for this inventory
       */
      writeablesUuids?: string[];

      /**
       * An array of user uuids who have the read privilege for this inventory
       */
      readablesUuids?: string[];

      /**
       * The date of the creation of this inventory
       *
       * This field may only be set in an inventory-created event
       */
      createdOn?: Date;
    };
    /**
     * The category-specific data (if this event is about a category)
     */
    categoryData?: {
      /**
       * The name of the category
       */
      name?: string;

      /**
       * The parent-category of this category
       *
       * Top-level categories are their own parent
       */
      parentUuid?: string;

      /**
       * The date of the creation of this category
       *
       * This field may only be set in an category-created event
       */
      createdOn?: Date;
    };

    /**
     * The thing-specific data (if this event is about a thing)
     */
    thingData?: {
      /**
       * The name of the thing
       */
      name: string;

      /**
       * The date of the creation of this category
       *
       * This field may only be set in an category-created event
       */
      createdOn?: Date;
    };

    /**
     * The stock-specific data (if this event is about a stock)
     */
    stockData?: {
      /**
       * The expiration date of the stock
       */
      exDate?: Date;

      /**
       * How many days after the opening of this stock is it still usable?
       */
      useUpIn?: number;

      /**
       * Text description of the quantity of the stock
       */
      quantity?: string;

      /**
       * When was this stock opened?
       */
      openedOn: Date;

      /**
       * The date of the creation of this category
       *
       * This field may only be set in an category-created event
       */
      createdOn?: Date;
    };
  };
}

/**
 * Used to describe on which type of item an operation was performed on
 */
enum itemType {
  INVENTORY = "inventory",
  CATEGORY = "category",
  THING = "thing",
  STOCK = "stock",
}

/**
 * Used to describe which type of operation was performed
 *
 * (read is excluded from this list since it doesn't affect the data)
 */
enum crudType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
}
