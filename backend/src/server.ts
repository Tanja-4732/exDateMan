/* eslint-disable no-case-declarations */

import * as express from "express";
import { join } from "path";
import pEvent from "p-event";
import { readFileSync } from "fs";
import { log } from "console";
import { createServer } from "https";
import { ExdatemanApplication } from "./application";

/**
 * Handles SSL setup and starts the Express server, mounts the API application
 * and serves static files
 */
export class ExpressServer {
  /**
   * The Express server
   */
  private app: express.Application;

  constructor() {
    // Initiate the Express server
    this.app = express();

    // Instantiate the API and mount it
    this.app.use("/api/v2", new ExdatemanApplication().applicationRoutes);

    // Serve all frontend files
    this.app.use(
      express.static(join(__dirname, "../../frontend/dist/exdateman")),
    );

    // Serve main page
    this.app.use((req: express.Request, res: express.Response) => {
      // Don't redirect to preserve the Angular routes
      res.sendFile(join(__dirname, "../../frontend/dist/exdateman/index.html"));
    });
  }

  /**
   * Start the server either with or without SSL
   *
   * Checks if SSL is desired using the `EDM_SSL` environment variable.
   *
   * The SSL parameters specified in the environment are either taken out of
   * their direct value representation (e.g. `EDM_SSL_PK_VAL`), otherwise the
   * files of the paths specified in them (e.g. `EDM_SSL_PK`) will be read and
   * used.
   */
  async start() {
    // Set the ports
    const PORT: string = process.env.PORT || 443 + "";
    const INSECURE_PORT: string = process.env.INSECURE_PORT || 80 + "";

    // Check if SSL is desired
    if (process.env.EDM_SSL === "true") {
      // Use SSL

      /**
       * The private key for SSL
       */
      const privateKey: string =
        process.env.EDM_SSL_PK_VAL ||
        readFileSync(process.env.EDM_SSL_PK + "", "utf8");

      /**
       * The certificate for SSL
       */
      const certificate: string =
        process.env.EDM_SSL_CERT_VAL ||
        readFileSync(process.env.EDM_SSL_CERT + "", "utf8");

      /**
       * The certificate authority chain for SSL
       */
      const ca: string =
        process.env.EDM_SSL_CA_VAL ||
        readFileSync(process.env.EDM_SSL_CA + "", "utf8");

      /**
       * The credentials as one object for SSL
       */
      const credentials = {
        key: privateKey,
        cert: certificate,
        ca,
      };

      // Create the https app server
      await pEvent(
        createServer(credentials, this.app).listen(PORT),
        "listening",
      );
      log("HTTPS app server listening on port " + PORT);

      // Create the http redirect server
      express()
        .use("*", (req, res) => {
          res.redirect("https://" + req.headers.host + req.url);
        })
        .listen(INSECURE_PORT);
      log("HTTP redirect server listening on port " + INSECURE_PORT);
    } else {
      // Don't use SSL
      // Start the http app server
      await pEvent(this.app.listen(process.env.PORT || 80 + ""), "listening");
      log("HTTP app server listening on port " + process.env.PORT || 80 + "");
    }
  }
}
