import { Request, Response, Application, Router } from "express";
import { log } from "util";

import v1Routes from "./v1/v1Routes";

const apiRoutes: Router = Router();

// Security
apiRoutes.use("/", (req, res, next) => {
  log("So secure.");
  next();
});

apiRoutes.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the ExDateMan API!"
  });
});


apiRoutes.use("/v1", v1Routes);

export default apiRoutes;
