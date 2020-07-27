const express = require("express");
const router = express.Router();

const SeriesConroller = require("../controllers/series-controller");

router.get("/getAll", SeriesConroller.getSeries);

module.exports = router;
