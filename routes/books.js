const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const BooksContoller = require("../controllers/books-contoller");

router.get("/getAll", login.optional, BooksContoller.getBooks);

module.exports = router;
