/**
 * This is the main entry point for the server.
 *
 * It serves the Angular SPA and handles all API queries.
 */

import { log } from "util";
import "source-map-support/register";
import { createServer } from "https";
import { readFileSync } from "fs";
import * as express from "express";

// Set the ports
const PORT: string = process.env.PORT || 443 + "";
const INSECURE_PORT: string = process.env.INSECURE_PORT || 80 + "";

// Set EDM_WORKING_DIRECTORY (working directory of the server)
process.env.EDM_WORKING_DIRECTORY = __dirname;

// Log staring message
log("Starting server in " + process.env.EDM_WORKING_DIRECTORY);

// Import the app
import app from "./app";
import { resolve } from "path";

// Check for development mode
switch (process.env.EDM_SSL) {
  case "yes":
    const PUBLIC_KEY: string | Buffer =
      process.env.EDM_PUBLIC_KEY_VAL ||
      readFileSync(process.env.EDM_PUBLIC_KEY);

    // Certificate
    const privateKey: string =
      process.env.EDM_PK_VAL || readFileSync(process.env.EDM_PK, "utf8");
    const certificate: string =
      process.env.EDM_CERT_VAL || readFileSync(process.env.EDM_CERT, "utf8");
    const ca: string =
      process.env.EDM_CA_VAL || readFileSync(process.env.EDM_CA, "utf8");

    const credentials = {
      key: privateKey,
      cert: certificate,
      ca
    };

    // Create and start the https app server
    createServer(credentials, app).listen(PORT, () => {
      log("HTTPS app server listening on port " + PORT);
    });

    // Create and start the http redirect server
    express()
      .use("*", (req, res) => {
        res.redirect("https://" + req.headers.host + req.url);
      })
      .listen(INSECURE_PORT, () => {
        log("HTTP redirect server listening on port " + INSECURE_PORT);
      });
    break;

  default:
    // Don't use SSL
    app.listen(process.env.PORT || 80 + "", () => {
      log("HTTP app server listening on port " + process.env.PORT || 80 + "");
    });
}
