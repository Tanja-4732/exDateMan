const data = require('../../data.json'); // FIXME this file doesn't exist.

module.exports = (req, res) => {
  const models = data.models;

  res.status(200).json({ models });
};
