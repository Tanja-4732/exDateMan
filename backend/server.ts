/**
 * This is the main entry point for the server.
 *
 * It serves the Angular SPA and handles all API queries.
 */

import { log } from "util";
import "source-map-support/register";

// Set port
const PORT: string = process.env.PORT || 420 + "";
// Set EDM_ROOT_PATH (the root path of the server)
process.env.EDM_ROOT_PATH = __dirname;

log("Starting server...");
import app from "./app";
app.listen(PORT, () => {
  log("Server listening on port " + PORT);
});
