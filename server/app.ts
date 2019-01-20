import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes/routes";
import * as path from "path";
import { log } from "util";
// import * as mongoose from "mongoose"; // useless
import "reflect-metadata";
import { createConnection, Connection } from "typeorm";
// import * as cookieParser from "cookie-parser";

import { Inventory } from "./models/inventoryModel";
import cookieParser = require("cookie-parser");

class App {
  public app: express.Application;
  public db: Connection;
  // public routePrv: Routes = new Routes(this.app);

  constructor() {
    this.app = express();
    this.dbSetup(1);
    // this.mongoSetup();
    this.serverConfig();
  }

  private serverConfig(): void {
    // cookie-parser is for cookies; and cookies is for JWT
    this.app.use(cookieParser());

    // application/json
    this.app.use(bodyParser.json());

    // application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Enable static file serving
    this.app.use(
      express.static(path.join(process.env.EDM_ROOT_PATH + "/dist/exDateMan"))
    );

    // Load all the routes
    this.app.use(routes);
  }

  private dbSetup(count: number): Connection {
    createConnection({
      type: "postgres",
      host: process.env.EDM_HOST,
      port: parseInt(process.env.EDM_PORT, 10),
      username: process.env.EDM_USER,
      password: process.env.EDM_PWD,
      database: process.env.EDM_DB,
      ssl: true,
      entities: [__dirname + "/models/*"],
      synchronize: true,
      logging: true
    })
      .then((connection: Connection) => {
        log("Connected to DB");
        return connection;
      })
      .catch((error: Error) => {
        if (count < 10) {
          log("DB connection failed " + count + " times. Retrying...");
          count++;
          this.dbSetup(count);
        } else {
          log("DB connection failed " + count + " times. Giving up.");
          throw error;
        }
      });
  }

  // private mongoSetup(): void {
  //   // mongoose.Promise = global.Promise;
  //   require("mongoose").Promise = global.Promise;
  //   mongoose.connect(process.env.MLAB_STRING_EDM);
  // }
}

export default new App().app;
