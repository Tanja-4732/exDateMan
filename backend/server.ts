/**
 * This is the main entry point for the server.
 *
 * It serves the Angular SPA and handles all API queries.
 */

import { log } from "util";
import "source-map-support/register";

// Set port
const PORT: string = process.env.PORT || 420 + "";

// Set EDM_WORKING_DIRECTORY (working directory of the server)
process.env.EDM_WORKING_DIRECTORY = __dirname;

// Log staring message
log("Starting server in " + process.env.EDM_WORKING_DIRECTORY);

// Import the app
import app from "./app";

// Log listening
app.listen(PORT, () => {
  log("Server listening on port " + PORT);
});
