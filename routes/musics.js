const express = require("express");
const router = express.Router();
const login = require("../middleware/login");

const SeriesConroller = require("../controllers/musics-controller");

router.get("/getAll", login.optional, SeriesConroller.getMusics);

module.exports = router;
