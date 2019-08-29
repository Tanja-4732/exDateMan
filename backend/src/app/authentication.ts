import { Router, Request, Response } from "express";

export class Authentication {
  /**
   * The authentication routes
   */
  public routes: Router;

  constructor() {
    // Instantiate the router
    this.routes = Router();

    // Mount the routes
    // Authentication
    this.routes.post("/login", this.login);
    this.routes.post("/register", this.register);
  }

  private login(req: Request, res: Response) {}
  private register(req: Request, res: Response) {}
}
