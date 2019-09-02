import { Router, Request, Response, NextFunction } from "express";

/**
 * Handles JWT checks and tests if a user is authorized to access a resource
 *
 * This class does not provide a router.
 */
export class Authorization {
  checkPermissions(req: Request, res: Response, next: NextFunction) {
    // TODO implement authorization #99

    // On successful auth, call the next function
    next();
  }
}
