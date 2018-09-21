const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/dist/exDateMan"));

app.get("/api", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"));
  res.end('Hello World');
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"))
});

app.listen(process.env.PORT || 420);
