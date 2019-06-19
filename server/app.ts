import * as cors from "cors";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { join } from "path";
import { log } from "util";

import routes from "./routes/routes";
import { readFileSync, writeFileSync } from "fs";

class App {
  public app: express.Application;
  public db: Connection;

  constructor() {
    // Patch index.html
    this.patchIndexHtml();

    this.app = express();

    this.dbSetup(1, 1).then((success: boolean) => {
      if (!success) {
        log(
          "LETHAL ERROR - Couldn't establish database connection. Shutting down."
        );
        process.exit(1);
      }
      this.serverConfig();
    });
  }

  private serverConfig(): void {
    // Cross origin resource sharing
    this.app.use(cors());

    // cookie-parser is for cookies; and cookies is for JWT
    this.app.use(cookieParser());

    // application/json
    this.app.use(bodyParser.json());

    // application/x-www-form-urlencoded
    this.app.use(bodyParser.urlencoded({ extended: true }));

    // Enable static file serving
    this.app.use(
      express.static(join(process.env.EDM_ROOT_PATH + "/dist/exDateMan"))
    );

    // Load all the routes
    this.app.use(routes);
  }

  /**
   * Set up the db connection
   *
   * @private
   * @param {number} count
   * @param {number} attempts
   * @returns {boolean} True on success, false on error
   * @memberof App
   */
  private async dbSetup(count: number, attempts: number): Promise<boolean> {
    try {
      await createConnection({
        type: "postgres",
        host: process.env.EDM_HOST,
        port: parseInt(process.env.EDM_PORT, 10),
        username: process.env.EDM_USER,
        password: process.env.EDM_PWD,
        database: process.env.EDM_DB,
        ssl: true,
        entities: [__dirname + "/models/*"],
        synchronize: process.env.EDM_MODE !== "production" || true,
        logging: process.env.EDM_LOG_DB === "3" ? true : ["error", "warn"],
        schema: process.env.EDM_SCHEMA || "edm_dev"
      } as ConnectionOptions);
      log("Connected to DB");
      return true; // Success
    } catch (err) {
      if (count < attempts) {
        log(
          "DB connection failed " +
            count +
            (count === 1 ? " time. Retrying..." : " times. Retrying...")
        );
        count++;
        this.dbSetup(count, attempts);
      } else {
        log(
          "DB connection failed " +
            count +
            (count === 1 ? " time. Giving up." : " times. Giving up.")
        );
        return false; // Failure
      }
    }
  }

  /**
   * Patches the index.html file in order to use the root as the base href.
   *
   * This is required because browsers would otherwise request files from other
   * directories. For example, when a browser is at the /inventories/1/things/2
   * path, it would request /inventories/1/things/2/main.min.js instead of
   * requesting /main.min.js, which breaks the application.
   *
   * This method is intended to be run once after each deployment, but as it
   * barely uses any resources, it gets run every time the server starts.
   *
   * @private
   * @memberof App
   */
  private patchIndexHtml(): void {
    const path: string = __dirname + "/../exDateMan/index.html";
    const fileContents: string = readFileSync(path, "utf8");
    const targetContents: string = fileContents.replace(/\<base href\="\.\/"\>/g, "<base href=\"/\">");
    writeFileSync(path, targetContents, "utf8");

    log("Patched index.html");
  }
}

export default new App().app;
