import { join } from "path";
import { log } from "util";
import { Request, Response, Application, Router, NextFunction } from "express";

import apiRoutes from "./api/apiRoutes";

const routes: Router = Router();

// API routes
routes.use("/api/", apiRoutes);

// Serve main page
routes.use((req: Request, res: Response, next: NextFunction) => {
  // Don't redirect to preserve the Angular routes
  res.status(200).sendFile("/index.html", {
    root: join(
      // This is a "fake" env var, set in server.ts
      process.env.EDM_WORKING_DIRECTORY + "/../exDateMan"
    )
  });
});

export default routes;
