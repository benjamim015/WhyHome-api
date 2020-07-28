const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const MoviesController = require("../controllers/movies-controller");

router.get("/getAll", login.optional, MoviesController.getMovies);

module.exports = router;
