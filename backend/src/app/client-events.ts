import { Router, Request, Response, NextFunction } from "express";
import { log, error } from "console";
import db from "./db";
import { ServerEvents } from "./server-events";
import { ExdatemanApplication } from "./application";
import { crudType } from "./authentication";

export class ClientEvents {
  private static singletonFlag = false;

  /**
   * The ClientEvents routes
   */
  public routes: Router;

  /**
   * The event-logs (every inventory has its own)
   *
   * Works like a dict
   */
  private static eventLogs: { [uuid: string]: InventoryEvent[] } = {};

  /**
   * Public accessor for the event log
   */
  get events(): { [uuid: string]: InventoryEvent[] } {
    return ClientEvents.eventLogs;
  }

  constructor() {
    // Enforce singleton
    if (ClientEvents.singletonFlag) {
      throw new Error("A ClientEvents instance already exists.");
    } else ClientEvents.singletonFlag = true;

    // Fetch all event logs available on the db and load them into the dict
    this.fetchAllInventoryEvents();

    // Instantiate the router
    this.routes = Router();

    // Get the events of one inventory
    this.routes.get(
      "/:inventoryUuid",
      this.checkForManagementEventLogs,
      (req: Request, res: Response) =>
        this.handleGetInventoryEventsRequest(req, res),
    );

    // Add an event to an inventory
    this.routes.put(
      "/",
      this.checkForManagementEventLogs,
      (req: Request, res: Response) =>
        this.handleAppendInventoryEventRequest(req, res),
    );
  }

  /**
   * Fetches all events of every inventory from the db and parses them
   *
   * This method is called in the ClientEvents constructor.
   */
  private async fetchAllInventoryEvents() {
    /**
     * A list of all uuids of inventories
     */
    const inventoryUuids = await this.getAllInventoryUuids();

    // Iterate over all inventory uuids
    for (const inventoryUuid of inventoryUuids) {
      // Get the events of that inventory
      ClientEvents.eventLogs[
        inventoryUuid.inventoryUuid
      ] = await this.getInventoryEvents(inventoryUuid.inventoryUuid);

      // Apply the events inside of the Authorization instance
      ExdatemanApplication.ao.applyInventory(
        ClientEvents.eventLogs[inventoryUuid.inventoryUuid],
      );
    }
  }

  /**
   * Check for the management event stream uuid, and deny access to it
   */
  private checkForManagementEventLogs(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    if (req.body.inventoryUuid == ServerEvents.userEventLogUuid) {
      res.status(403).json({
        message: "You may not access that",
        oof: true,
      });
      return;
    } else {
      next();
    }
  }

  private async handleGetInventoryEventsRequest(req: Request, res: Response) {
    try {
      // Check for read access
      if (
        !ExdatemanApplication.ao.checkReadAccess(
          req.params.inventoryUuid,
          ExdatemanApplication.ae.verifyJWT(req.cookies.JWT).sub,
        )
      ) {
        // Unauthorized
        res.sendStatus(401);
        return;
      }

      // Get the events from the db
      const result = ClientEvents.eventLogs[req.params.inventoryUuid];

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

  private async getInventoryEvents(
    inventoryUuid: string,
  ): Promise<InventoryEvent[]> {
    return (await (await db()).query(
      `
      SELECT "inventoryUuid", date, data
        FROM ${process.env.EDM_DB_SCHEMA}.events
      WHERE "inventoryUuid" = $1
      ORDER BY date ASC;
      `,
      [inventoryUuid],
    )).rows;
  }

  /**
   * Gets all inventory uuids (with event logs) from the db
   */
  public async getAllInventoryUuids(): Promise<{ inventoryUuid: string }[]> {
    return (await (await db()).query(
      `
      SELECT "inventoryUuid"
        FROM ${process.env.EDM_DB_SCHEMA}.events
      WHERE "inventoryUuid" != $1
      GROUP BY "inventoryUuid";
      `,
      [ServerEvents.userEventLogUuid],
    )).rows;
  }

  /**
   * Handles API requests to append an event to an inventory event log
   */
  private async handleAppendInventoryEventRequest(req: Request, res: Response) {
    try {
      // Check for authorization
      if (
        !ExdatemanApplication.ao.checkEventLegitimacy(
          req.body,
          ExdatemanApplication.ae.verifyJWT(req.cookies.JWT).sub,
        )
      ) {
        // Unauthorized
        res.sendStatus(401);
        return;
      }

      // Append the event
      const result = await this.appendInventoryEvent(req.body);

      // If the item is about an inventory...
      if ((req.body as InventoryEvent).data.itemType == itemType.INVENTORY)
        // ...update the inventory projection
        ExdatemanApplication.ao.updateInventoriesProjection(req.body);

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

  /**
   * Appends an event both to the db and the local event log.
   * The projection is not affected.
   * If the local dict is missing the event log required, it will get
   * initialized.
   *
   * @param event The event to be appended
   */
  private async appendInventoryEvent(event: InventoryEvent) {
    // Write the event to the db
    const result = await (await db()).query(
      `
      INSERT INTO ${process.env.EDM_DB_SCHEMA}.events
       ("inventoryUuid", date, data)
      VALUES ($1, $2, $3)
      `,
      [event.inventoryUuid, event.date, event.data],
    );

    // Check, if the dict entry needs to be initialized
    if (ClientEvents.eventLogs[event.inventoryUuid] == null)
      ClientEvents.eventLogs[event.inventoryUuid] = [];

    // Write the event to the local cache
    ClientEvents.eventLogs[event.inventoryUuid].push(event);

    return result.rows;
  }
}

/**
 * The data structure of an event
 */
export interface InventoryEvent {
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
export enum itemType {
  INVENTORY = "inventory",
  CATEGORY = "category",
  THING = "thing",
  STOCK = "stock",
}
