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
const PORT: string = process.env.PORT || 420 + "";

// Set EDM_WORKING_DIRECTORY (working directory of the server)
process.env.EDM_WORKING_DIRECTORY = __dirname;

// Log staring message
log("Starting server in " + process.env.EDM_WORKING_DIRECTORY);

// Import the app
import app from "./app";
import { resolve } from "path";

// Check for development mode
if (process.env.EDM_MODE !== "development") {
  // Don't use SSL and let the host worry about that
  app.listen(PORT, () => {
    log("Server listening on port " + PORT);
  });
} else {
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
    log("SSL server listening on port " + PORT);
  });
}
