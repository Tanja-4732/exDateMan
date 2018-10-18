const express = require("express");
const path = require("path");

const app = express();

var bodyParser = require('body-parser');

var rawBodySaver = function (req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

app.use(bodyParser.json({
  verify: rawBodySaver
}));

app.use(bodyParser.urlencoded({
  verify: rawBodySaver,
  extended: true
}));

app.use(bodyParser.raw({
  verify: rawBodySaver,
  type: function () {
    return true
  }
}));


app.use(express.static(__dirname + "/dist/exDateMan"));

app.get("/api/v1/things", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  // res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"));
  res.end("Here come da things // TODO ");
});

app.post("/api/v1/thing", (req, res, next) => {
  console.log("Body: " + req.rawBody);
  res.statusCode = 200;

})

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"))
});

app.listen(process.env.PORT || 420);
