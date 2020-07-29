const books = require("../mocks/books.json");

exports.getBooks = (req, res, next) => {
  res.status(200).send({
    books: books,
  });
};
