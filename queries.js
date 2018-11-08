var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};


var pgp = require('pg-promise')(options);
const db = pgp({
  host: process.env.DB_HOST,
  port: 5432,
  database: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: true
});

function getAllThings(req, res, next) {
  db.any('select * from "Things";')
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved ALL things'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getSingleThing(req, res, next) {
  var thingID = parseInt(req.params.thingID);
  db.one('select * from "Things" where "ThingUID" = $1;', thingID)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Retrieved one thing'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createThing(req, res, next) {
  var thingID = parseInt(req.params.thingID); // TODO maybe remove
  db.none('insert into "Things" (ThingName, ThingCategory)' +
      'values(${ThingName}, ${ThingCategory}', req.body)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data,
          message: 'Inserted one thing'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function updateThing(req, res, next) {
  db.none('update "Things" set "ThingName"=$1, "ThingCategory"=$2 where id=$3',
      [req.body.thingName, req.body.thingCategory, parseInt(req.body.thingID)])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Updated thing'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function removeThing(req, res, next) {
  var thingID = parseInt(req.params.thingID);
  db.result('delete from "Things" where id = $1', thingID)
    .then(function (result) {
      res.status(200)
        .json({
          status: 'success',
          message: `Removed ${result.rowCount} thing`
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  getAllThings: getAllThings,
  getSingleThing: getSingleThing,
  createThing: createThing,
  updateThing: updateThing,
  removeThing: removeThing
};
