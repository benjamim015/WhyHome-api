const express = require("express");
const router = express.Router();

const MoviesController = require("../controllers/movies-controller");

router.get("/getAll", MoviesController.getMovies);

module.exports = router;
