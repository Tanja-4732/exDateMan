// import { ThingController } from "../controllers/thingController";
// import { Request, Response, Application, Router } from "express";
// import { log } from "util";
// import * as path from "path";
// import * as jwt from "express-jwt";

// import v1Routes from "./v1/v1Routes";


//   // public thingController: ThingController = new ThingController(); // TODO maybe remove
//  routes: Router = Router();

//     routes.use("/api/v1/", v1Routes);




// export default Routes.routes;

const routes = require('express').Router();
const things = require("./things");

routes.get('/', (req, res) => {
  res.status(200).json({
    message: 'Connected to ExDateMan API version 1.0'
  });
});

routes.use('/things', things);

module.exports = routes;

export default routes;
