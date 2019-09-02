import { Router, Request, Response, NextFunction } from "express";
import { log, error } from "console";
import db from "./db";

export class Events {
  /**
   * The template routes
   */
  public routes: Router;

  constructor() {
    // Instantiate the router
    this.routes = Router();

    // Get the events of one inventory
    this.routes.get("/:inventoryId", this.checkFor0, this.getInventoryEvents);

    // Add an event to an inventory
    this.routes.post(
      "/:inventoryId",
      this.checkFor0,
      this.appendInventoryEvent,
    );

    // Return an error for an empty get
    this.routes.get("/", this.emptyGet);
  }

  /**
   * Check for the 0th inventory
   */
  private checkFor0(req: Request, res: Response, next: NextFunction) {
    const parsedId = parseInt(req.params.inventoryId, 10);
    if (parsedId.toString() === "NaN") {
      res.status(400).json({ error: "The ID must be numeric" });
      return;
    }
    if (parsedId == 0) {
      res.status(400).json({ error: "There is no 0th inventory" });
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
        [req.params.inventoryId],
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
        [req.params.inventoryId, (req.body as ev).date, (req.body as ev).data],
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
