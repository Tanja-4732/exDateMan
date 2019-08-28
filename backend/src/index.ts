import { ExpressServer } from "./server";
import { log } from "console";

const server: ExpressServer = new ExpressServer();
server.start();
log("Server started.");
