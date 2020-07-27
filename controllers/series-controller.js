const series = require("../mocks/series.json");

exports.getSeries = (req, res, next) => {
  res.status(200).send({
    series: series,
  });
};
