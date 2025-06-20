const { convertToObjectId } = require("../../utils");
const { Inventory } = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await Inventory.create({
    inven_productId: productId,
    inven_location: location,
    inven_stock: stock,
    inven_shopId: shopId,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: convertToObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: { inven_stock: -quantity },
    },
    $push = {
      inven_reservations: {
        quantity,
        cartId,
        createdOn: new Date(),
      },
    },
    options = {
      new: true,
      upsert: true,
    };
  return await Inventory.findOneAndUpdate(query, updateSet);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
