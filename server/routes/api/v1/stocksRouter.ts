import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

// import v1Routes from "./v1/v1Routes";

const stocksRoutes: Router = Router();

// Security
stocksRoutes.use("/", (req: Request, res: Response, next: NextFunction) => {
  log("So secure.");
  next();
});

stocksRoutes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the ExDateMan API!"
  });
});


// stocksRoutes.use("/v1", v1Routes);

export default stocksRoutes;
