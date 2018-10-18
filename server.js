const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(__dirname + "/dist/exDateMan"));

app.get("/api/v1/things", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  // res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"));
  res.end("Here come da things // TODO ");
});

app.post("/api/v1/thing", (req, res, next) => {
  console.log(req.body + "");
  res.statusCode = 200;

})

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"))
});

app.listen(process.env.PORT || 420);
