const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");
// check  apikey
router.use(apiKey);
//check permission
router.use(permission("0000"));
//sign up
router.use("/v1/api", require("./access/index"));

module.exports = router;
