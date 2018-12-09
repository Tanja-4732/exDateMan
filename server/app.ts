import * as express from "express";
import * as bodyParser from "body-parser";
import { Routes } from "./Routes/routes";

class App {
  public app: express.Application;
  public routes: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    // JSON
    this.app.use(bodyParser.json());

    // Form Data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
}

export default new App().app;
