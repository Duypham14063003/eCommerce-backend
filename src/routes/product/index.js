const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authencation } = require("../../auth/authUtils");
const router = express.Router();

//check authencation
router.use(authencation);

//create product
router.post("/create", asyncHandler(productController.createProduct));

module.exports = router;
