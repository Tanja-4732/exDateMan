import { ExpressServer } from "./server";
import { log } from "console";

/**
 * The main Express server
 *
 * The server gets instantiated in the constructor
 */
const server: ExpressServer = new ExpressServer();

// Make the server listen based on config
server
  .start()
  .then(() => {
    // Log server started
    log("Server started.");
  })
  .catch(() => {
    // Log error
    log("Couldn't start server.");
  });
