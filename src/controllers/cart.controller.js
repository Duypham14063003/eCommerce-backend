const { OK, CREATED, SuccessResponse } = require("../core/success.res");
const CartService = require("../services/cart.service");
class CartController {
  //add to cart

  addToCart = async (req, res, next) => {
    new SuccessResponse({
      message: "created new cart successfully",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  };

  update = async (req, res, next) => {
    new SuccessResponse({
      message: "update cart successfully",
      metadata: await CartService.addToCartV2(req.body),
    }).send(res);
  };

  delete = async (req, res, next) => {
    new SuccessResponse({
      message: "deleted cart successfully",
      metadata: await CartService.deleteUserCart(req.body),
    }).send(res);
  };

  list = async (req, res, next) => {
    new SuccessResponse({
      message: "list cart successfully",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
