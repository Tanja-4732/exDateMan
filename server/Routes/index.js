const routes = require('express').Router();
const things = require("./things");

routes.get('/', (req, res) => {
  res.status(200).json({
    message: 'Connected to ExDateMan API version 1.0'
  });
});

routes.use('/things', things);

module.exports = routes;
