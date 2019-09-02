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
      this.checkFor0,
      (req: Request, res: Response) => this.getInventoryEvents(req, res),
    );

    // Add an event to an inventory
    this.routes.post("/", this.checkFor0, (req: Request, res: Response) =>
      this.appendInventoryEvent(req, res),
    );

    // Return an error for an empty get
    this.routes.get("/", this.emptyGet);
  }

  /**
   * Check for the management inventory uuids
   */
  private checkFor0(req: Request, res: Response, next: NextFunction) {
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
          req.params.inventoryUuid,
          (req.body as ev).date,
          (req.body as ev).data,
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
 * How a transmitted event should look like
 */
interface ev {
  /**
   * The date (as an ISO string) at which the event occurred
   */
  date: string;

  /**
   * Data about the inventory
   */
  data: {};

  // TODO add the userId to the event
}
