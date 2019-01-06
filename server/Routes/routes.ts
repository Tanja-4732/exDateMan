import { ThingController } from "../controllers/thingController";
import { Request, Response, Application } from "express";
import { log } from "util";
import * as path from "path";
import * as jwt from "express-jwt";

// import

/**
 * Handles API calls
 *
 * @export
 * @class Routes
 */
export class Routes {
  // public thingController: ThingController = new ThingController(); // TODO maybe remove

  constructor(private app: Application) {}

  app.use("/api/v1/", v1);

}
