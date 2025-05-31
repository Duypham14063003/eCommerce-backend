const express = require("express");
const DiscountController = require("../../controllers/discount.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authencation } = require("../../auth/authUtils");
const router = express.Router();

//get amount a discount

router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(DiscountController.getAllDiscountCodesWithProducts)
);
// authencation
router.use(authencation);

router.post("", asyncHandler(DiscountController.createDiscountCode));
router.get("", asyncHandler(DiscountController.getAllDiscountCodes));

module.exports = router;
