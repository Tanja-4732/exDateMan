import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./Routes/routes";
import * as path from "path";
import { log } from "util";

class App {
  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
  }

  private config(): void {
    // application/json
    this.app.use(bodyParser.json());

    // application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(express.static(path.join(process.env.EDM_ROOT_PATH + "/dist/exDateMan"))); // TODO check difference
  }
}

export default new App().app;
// export default App;
