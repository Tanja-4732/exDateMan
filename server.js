const express = require("express");
const path = require("path");
// const db = require("queries"); TODO enable

const app = express();


app.use(express.static(__dirname + "/dist/exDateMan"));
const routes = require("./routes");
app.use('/api/v1/', routes);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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


async function getThings() {
  const things = await db.any('select * from "Things";')
}

// TODO Parse JSON and DB connection


// Serve main page to user
app.get("/*", (req, res) => {
  console.log("The main page has been requested.");

  res.sendFile(path.join(__dirname + "/dist/exDateMan/index.html"))
});



// app.get("/api/v1/thing/:id", (req, res, next) => {
//   console.log("Code 2");
//   // console.log("Body: " + req.params);
//   // console.log("Body: " + req.rawBody);
//   res.statusCode = 200;
//   res.send(req.params);
// });

// app.post("/api/v1/thing/", (req, res, next) => {
//   console.log("Code 3");
//   cheatStore = req.rawBody;
//   res.statusCode = 200;
//   res.send(req.rawBody);
// });



app.listen(process.env.PORT || 420);
