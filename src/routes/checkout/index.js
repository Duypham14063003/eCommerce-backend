const express = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authencation } = require("../../auth/authUtils");
const router = express.Router();

// //authencation
// router.use(authencation);
// //
router.post("/review", asyncHandler(checkoutController.checkoutReview));

module.exports = router;
