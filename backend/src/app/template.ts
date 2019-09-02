import { Router } from "express";

export class Template {
  /**
   * The template routes
   */
  public routes: Router;

  constructor() {
    // Instantiate the router
    this.routes = Router();

    // Get the events of one inventory
    this.routes.get("/:inventoryId");
  }
}
