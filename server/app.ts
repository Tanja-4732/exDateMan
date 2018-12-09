import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./Routes/routes";
import * as path from "path";
import { log } from "util";

class App {
  public app: express.Application;
  public routes: Routes = new Routes(this.rootPath);

  constructor(private readonly rootPath: string) {
    this.app = express();
    this.config();
    this.routes.routes(this.app);
    log(rootPath);
  }

  private config(): void {
    // JSON
    this.app.use(bodyParser.json());

    // Form Data
    this.app.use(bodyParser.urlencoded({ extended: false }));

    this.app.use(express.static(path.join(this.rootPath + "/dist/exDateMan")));
  }
}

export default App;
