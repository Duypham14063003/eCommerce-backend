const express = require("express");
const router = express.Router();

//sign up
router.use("/v1/api", require("./access/index"));

module.exports = router;
