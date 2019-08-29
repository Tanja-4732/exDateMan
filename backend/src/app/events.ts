import { Router, Request, Response } from "express";
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
    this.routes.get("/:inventoryId", this.getInventoryEvents);

    // Return an error for an empty get
    this.routes.use("/", this.emptyGet);
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
    // Check for the 0th inventory
    if (req.params.inventoryId === "0") {
      res.status(400).json({ error: "There is no 0th inventory" });
      return;
    }

    // TODO check for read access #99

    try {
      // Get the events from the db
      const result = await db().query(
        `
        SELECT date, data
          FROM ${process.env.EDM_DB_SCHEMA}.events
        WHERE stream_id = $1
        ORDER BY date ASC;
        `,
        [req.params.inventoryId],
      );

      // Send the events back
      res.json(result);
    } catch (err) {
      error(err);
      res.status(500).json({ oof: true });
    }
  }

  private appendInventoryEvent(req: Request, res: Response) {
    // TODO check for write access #99
  }
}
