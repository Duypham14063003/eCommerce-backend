const express = require("express");
const asyncHandler = require("../../helpers/asyncHandler");
const { authencation } = require("../../auth/authUtils");
const inventoryController = require("../../controllers/inventory.controller");
const router = express.Router();

// //authencation
router.use(authencation);
// //
router.post("", asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
