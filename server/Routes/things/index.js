const things = require('express').Router();
// const all = require('./all').default;
// const single = require('./single');
const stocks = require('./stocks');
const db = require("../../queries")

// things.get('/', (req, res, next) => {
//   res.status(200);
//   res.send("All the things!");
// });

// things.get('/:thingID', (req, res) => {
//   console.log("Thing #"+ req.params.thingID + " requested.");
//   res.status(200).send("One number " + req.params.thingID);
// });

things.get('/', db.getAllThings);
things.get('/:thingID', db.getSingleThing);
things.post('/', db.createThing);
things.put('/:thingID', db.updateThing);
things.delete('/:thingID', db.removeThing);

things.use('/:thingID/stocks', stocks);

module.exports = things;
