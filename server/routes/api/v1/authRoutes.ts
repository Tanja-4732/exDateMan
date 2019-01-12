import { Request, Response, Router, NextFunction } from "express";
import { log } from "util";

const v1Routes: Router = Router();

// Return details about the session
v1Routes.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "You are authenticated."
  });
});

export default v1Routes;
