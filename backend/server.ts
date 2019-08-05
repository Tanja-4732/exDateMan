/**
 * This is the main entry point for the server.
 *
 * It serves the Angular SPA and handles all API queries.
 */

import { log } from "util";
import "source-map-support/register";
import { createServer } from "https";
import { readFileSync } from "fs";

// Set port
const PORT: string = process.env.PORT || 4242 + "";

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
      process.env.EDM_PUBLIC_KEY_VAL || readFileSync(process.env.EDM_PUBLIC_KEY);



    // Certificate
    const privateKey = readFileSync(process.env.EDM_, 'utf8');
    const certificate = readFileSync(process.env.EDM_, 'utf8');
    const ca = readFileSync(process.env.EDM_CA, 'utf8');



    // Use self-signed SSL certificate for development
    createServer(
      {
        key: readFileSync(resolve(__dirname, "../../backend/keys/server.key")),
        // key: readFileSync(resolve(__dirname, "../../backend/keys/private.key")),
        cert: readFileSync(resolve(__dirname, "../../backend/keys/server.crt")),
        passphrase: "1234" // As secure as it gets
      },
      app
    ).listen(PORT, () => {
      log("HTTPS server listening on port " + PORT);
    });
    break;
  default:
    // Don't use SSL
    app.listen(PORT, () => {
      log("HTTP server listening on port " + PORT);
    });
}

log("Server closed");
