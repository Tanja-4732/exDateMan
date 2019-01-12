import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

import v1Routes from "./v1/v1Routes";

const apiRoutes: Router = Router();

// Security
apiRoutes.use("/", (req: Request, res: Response, next: NextFunction) => {
  log("So secure.");
  next();
});

// Return all things
apiRoutes.get("/", (req: Request, res: Response) => {
  // TODO
});

// Return one thing
apiRoutes.get("/:thingNb", (req: Request, res: Response) => {
  // TODO
});


apiRoutes.use("/v1", v1Routes);

export default apiRoutes;
