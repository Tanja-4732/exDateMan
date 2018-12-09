// const data = require("../../data.json"); // TODO remove
const db = require("../../queries");

module.exports = (req, res) => {
  const thingID = req.params.thingID * 1;
  const model = data.models.find(m => m.id === thingID);

  res.status(200).json({ model });
};
