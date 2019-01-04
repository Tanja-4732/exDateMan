import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./Routes/apiRoutes";
import * as path from "path";
import { log } from "util";

class App {
  public app: express.Application;
  public routes: Routes = new Routes(this.rootPath); // TODO check difference

  constructor(private readonly rootPath: string) { // TODO check difference: params should be empty
    this.app = express();
    this.config();
    this.routes.routes(this.app); // TODO check difference
    log("app.ts: rootPath=" + rootPath); // TODO check difference
  }

  private config(): void {
    // application/json
    this.app.use(bodyParser.json());

    // application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(express.static(path.join(this.rootPath + "/dist/exDateMan"))); // TODO check difference
  }
}

export default new App(process.env.EDM_ROOT_PATH).app;
// export default App;
