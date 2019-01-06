import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./Routes/routes";
import * as path from "path";
import { log } from "util";
import * as mongoose from "mongoose";

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.serverConfig();
    this.routePrv.routes(this.app);
    this.mongoSetup();
  }

  private serverConfig(): void {
    // application/json
    this.app.use(bodyParser.json());

    // application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(
      express.static(path.join(process.env.EDM_ROOT_PATH + "/dist/exDateMan"))
    ); // TODO check difference
  }

  private mongoSetup(): void {
    // mongoose.Promise = global.Promise;
    require("mongoose").Promise = global.Promise;
    mongoose.connect(process.env.MLAB_STRING_EDM);
  }
}

export default new App().app;
// export default App;
