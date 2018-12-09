// const all = require('./all'); // TODO delete
const stocks = require('express').Router({
  mergeParams: true
});


stocks.get('/', (req, res) => {
  // const models = data.models;
  // res.status(200).json({ models });

});
stocks.get('/:stockID', (req, res) => {
  res.status(42);
})


module.exports = stocks;
