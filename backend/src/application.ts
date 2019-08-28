import { join } from "path";
import { Router, RouterOptions } from "express";

/**
 * The application
 *
 * Handles all API calls
 */
export class ExdatemanApplication {
  /**
   * The routes to be added to the API path
   */
  public applicationRoutes: Router;

  constructor() {
    this.applicationRoutes = Router();
  }
}
