const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authencation } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

//check authencation
router.use(authencation);

//create product
router.post("/create", asyncHandler(productController.createProduct));

router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);

router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);

//QUERY
//get all draft products
router.get("/drafts/all", asyncHandler(productController.getAllDraftForShop));

//get all publish products
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);
// END QUERY

module.exports = router;
