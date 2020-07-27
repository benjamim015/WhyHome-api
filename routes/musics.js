const express = require("express");
const router = express.Router();

const SeriesConroller = require("../controllers/musics-controller");

router.get("/getAll", SeriesConroller.getMusics);

module.exports = router;
