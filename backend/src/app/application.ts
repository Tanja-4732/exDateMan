import { join } from "path";
import { Router, RouterOptions } from "express";
import { ClientEvents } from "./client-events";
import { Authentication } from "./authentication";
import { Authorization } from "./authorization";
import { ServerEvents } from "./server-events";

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

  // Singleton objects
  private static _ce: ClientEvents;
  private static _se: ServerEvents;
  private static _ae: Authentication;
  private static _ao: Authorization;

  public static get ce(): ClientEvents {
    return ExdatemanApplication._ce;
  }

  public static get se(): ServerEvents {
    return ExdatemanApplication._se;
  }

  public static get ao(): Authorization {
    return ExdatemanApplication._ao;
  }

  public static get ae(): Authentication {
    return ExdatemanApplication._ae;
  }

  constructor() {
    // Instantiate the router
    this.routes = Router();

    ExdatemanApplication._ce = new ClientEvents();
    ExdatemanApplication._se = new ServerEvents();
    ExdatemanApplication._ae = new Authentication();
    ExdatemanApplication._ao = new Authorization();

    // Mount the API routes
    this.routes.use("/events", ExdatemanApplication._ce.routes);
    this.routes.use("/authentication", ExdatemanApplication._ae.routes);
  }
}
