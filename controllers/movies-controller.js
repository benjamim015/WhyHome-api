const movies = require("../mocks/movies.json");

exports.getMovies = (req, res, next) => {
  res.status(200).send({
    movies: movies,
  });
};
