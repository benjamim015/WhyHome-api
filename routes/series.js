const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const SeriesConroller = require("../controllers/series-controller");

router.get("/getAll", login.optional, SeriesConroller.getSeries);

module.exports = router;
