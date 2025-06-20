const { BadRequestError } = require("../core/error.res");
const { Inventory } = require("../models/inventory.model");
const { getProductById } = require("../models/repositories/product.repo");

class inventoryService {
  static async addStockToInventory({
    productId,
    shopId,
    stock,
    location = "Tan Phu",
  }) {
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("Product not found");
    }

    const query = { inven_shopId: shopId, inven_productId: productId },
      updateSet = {
        $inc: { inven_stock: stock },
        $set: { inven_location: location },
      },
      option = {
        new: true,
        upsert: true, // if not found, create new
      };
    return await Inventory.findOneAndUpdate(query, updateSet, option);
  }
}

module.exports = inventoryService;
