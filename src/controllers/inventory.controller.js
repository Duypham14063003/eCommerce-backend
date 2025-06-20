const InventoryService = require("../services/inventory.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.res");
class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      message: "Add stock to inventory successfully!",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  };
}
module.exports = new InventoryController();
