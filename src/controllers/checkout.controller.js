// const CheckoutService = require("../services/checkout.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.res");
const checkoutService = require("../services/checkout.service");
class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new SuccessResponse({
      message: "Checkout review success!",
      metadata: await checkoutService.checkoutReview(req.body),
    }).send(res);
  };
}
module.exports = new CheckoutController();
