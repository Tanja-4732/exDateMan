import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { createConnection, Connection, ConnectionOptions } from "typeorm";
import { join } from "path";
import { log } from "util";

import routes from "./routes/routes";
import { readFileSync, writeFileSync } from "fs";
import { Environment } from "./environments/environment";

class App {
  public app: express.Application;
  public db: Connection;

  constructor() {
    // Get environment configuration
    const environment: Environment = App.getEnvironment();

    // Patch index.html
    this.patchIndexHtml();

    // Initialize express
    this.app = express();

    // Connect to the database
    this.dbSetup(1, 1).then((success: boolean) => {
      if (!success) {
        // A failed connection attempt will log an error before shutting down the app
        log(
          "LETHAL ERROR - Couldn't establish database connection. Shutting down."
        );
        process.exit(1);
      }

      // After a db connection was established, express will be configured

      // Cross origin resource sharing
      this.app.use(
        (
          req: express.Request,
          res: express.Response,
          next: express.NextFunction
        ) => {
          // TODO remove
          log("Origin=" + req.headers.origin);

          // Check if the origin is acceptable
          if (
            environment.corsWhitelist.indexOf(req.headers.origin as string) !==
            -1
          ) {
            // Acceptable origins get their origin added to the header
            res.header("Access-Control-Allow-Origin", req.headers
              .origin as string);

            res.header(
              "Access-Control-Allow-Headers",
              "Origin, X-Requested-With, Content-Type, Accept"
            );

            // Keep the browser calm
            res.header("Access-Control-Allow-Credentials", "true");
          }
          next();
        }
      );

      this.app.options("*", (req: express.Request, res: express.Response) => {
        res.status(204).send();
      });

      // cookie-parser is for cookies; and cookies is for JWT
      this.app.use(cookieParser());

      // application/json
      this.app.use(bodyParser.json());

      // application/x-www-form-urlencoded
      this.app.use(bodyParser.urlencoded({ extended: true }));

      // Enable static file serving
      this.app.use(
        express.static(
          join(
            // This is a "fake" env var, set in server.ts
            process.env.EDM_WORKING_DIRECTORY + "/../exDateMan"
          )
        )
      );

      // Load all the routes (including all APIs)
      this.app.use(routes);
    });
  }

  /**
   * Get an environment of the backend depending on EDM_ENVIRONMENT
   *
   * @static
   * @memberof App
   */
  public static getEnvironment(): Environment {
    let environment: { environment: Environment };
    switch (process.env.EDM_MODE) {
      case "production":
        environment = require("./environments/production");
        break;
      case "staging":
        environment = require("./environments/staging");
        break;
      case "development":
      default:
        environment = require("./environments/development");
    }
    log("Env=" + JSON.stringify(environment.environment));
    return environment.environment;
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
        synchronize: process.env.EDM_MODE === "development" || false,
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
    const targetContents: string = fileContents.replace(
      /\<base href\="\.\/"\>/g,
      '<base href="/">'
    );
    writeFileSync(path, targetContents, "utf8");

    log("Patched index.html");
  }
}

export default new App().app;
