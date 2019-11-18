import { ExpressServer } from "./server";
import { log, error } from "console";

/**
 * The main Express server
 *
 * The server gets instantiated in the constructor
 */
const server: ExpressServer = new ExpressServer();

// Make the server listen based on config
server.start().catch(err => {
  // Log error
  log("Couldn't start server:");
  error(err);
});
