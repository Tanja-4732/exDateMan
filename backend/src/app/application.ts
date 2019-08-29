import { join } from "path";
import { Router, RouterOptions } from "express";
import { Events } from "./events";
import { Authentication } from "./authentication";

/**
 * The application
 *
 * Handles all API calls
 */
export class ExdatemanApplication {
  /**
   * The routes to be added to the API path
   */
  public routes: Router;

  constructor() {
    // Instantiate the router
    this.routes = Router();

    // Mount the API routes
    this.routes.use("/inventory-events", new Events().routes);
    this.routes.use("/authentication", new Authentication().routes);
  }
}
