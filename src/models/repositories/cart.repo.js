const { convertToObjectId } = require("../../utils");
const Cart = require("../cart.model");

const createUserCart = async ({ userId, product }) => {
  const query = {
      cart_userId: userId,
      cart_state: "active",
    },
    updateOrInsert = {
      $addToSet: { cart_products: product },
    },
    options = {
      upsert: true,
      new: true,
    };
  return await Cart.findOneAndUpdate(query, updateOrInsert, options);
};

const updateUserCartQuanity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    },
    updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    },
    option = {
      upsert: true,
      new: true,
    };

  return await Cart.findOneAndUpdate(query, updateSet, option);
};

const deleteUserCart = async ({ userId, productId }) => {
  console.log("userId in deleteUserCart::", userId);
  const query = { cart_userId: userId, cart_state: "active" },
    updateSet = {
      $pull: {
        cart_products: { productId },
      },
    };
  return await Cart.updateOne(query, updateSet);
};
const isCartExists = async ({ userId }) => {
  //   console.log("userId in isCartExits::", userId);
  return await Cart.findOne({ cart_userId: userId });
};

const getListUserCart = async ({ userId }) => {
  // phép +userId là để ép kiểu string sang number
  // VD: +userID = Number(userId)
  return await Cart.findOne({ cart_userId: +userId }).lean();
};

const findCartById = async (cartId) => {
  return await Cart.findOne({
    _id: convertToObjectId(cartId),
    cart_state: "active",
  }).lean();
};
module.exports = {
  createUserCart,
  isCartExists,
  updateUserCartQuanity,
  deleteUserCart,
  getListUserCart,
  findCartById,
};
