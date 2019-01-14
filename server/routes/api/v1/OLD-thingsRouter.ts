import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import v1Routes from "./stocksRouter";

export class ThingsRouter {
  public thingsRoutes: Router = Router();
  constructor(private inventoryId: number) {
    // Security
    this.thingsRoutes.use(
      "/",
      (req: Request, res: Response, next: NextFunction) => {
        log("So secure.");
        next();
      }
    );

    // Return all things
    this.thingsRoutes.get("/", (req: Request, res: Response) => {
      log("inventoryId=" + req.params.inventoryId);
      req.res.status(200).json({
        message: "These are all the things " + req.params.inventoryId
      });
    });

    // Return one thing
    this.thingsRoutes.get("/:thingNb", (req: Request, res: Response) => {
      // TODO
    });

    this.thingsRoutes.use("/v1", v1Routes);
  }
}
// export default thingsRouter.thingsRoutes;
