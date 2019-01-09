// import { ThingController } from "../controllers/thingController";
import { Request, Response, Application, Router } from "express";

let routes = Router();
routes.get("/", (req, res) => {
  res.status(200).json({
    message: 'Connected to ExDateMan API.'
  });
});

export default routes;
