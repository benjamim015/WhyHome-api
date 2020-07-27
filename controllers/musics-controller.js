const musics = require("../mocks/musics.json");

exports.getMusics = (req, res, next) => {
  res.status(200).send({
    musics: musics,
  });
};
