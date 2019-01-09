import * as path from "path";
import { log } from 'util';
import { Request, Response, Application, Router, NextFunction } from "express";

import apiRoutes from "./api/apiRoutes";

const routes: Router = Router();

// API routes
routes.use("/api/", apiRoutes);

// Serve main page
routes.use((req: Request, res: Response, next: NextFunction) => {
  // res.redirect("/");
  // log("Triggered fallback");
  log(  req.originalUrl);
  res
      .status(200)
      .sendFile(
        "dist/exDateMan/index.html",
        {root: process.env.EDM_ROOT_PATH}
      );

});

export default routes;
