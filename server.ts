// import "babel-polyfill";

import * as path from "path";
import * as express from "express";
import * as bodyParser from "body-parser";

import routes from "./routes";
import config from "./config/config";











// TODO Give next a type
app.get("/api", (req: Request, res: Response, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  // res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"));
  res.end("Hello World");
});

app.get("/*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"));
});

app.listen(process.env.PORT || 420);
