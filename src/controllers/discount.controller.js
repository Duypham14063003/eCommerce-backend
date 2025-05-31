const { OK, CREATED, SuccessResponse } = require("../core/success.res");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Create discount code success!",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
  getAllDiscountCodes = async (req, res, next) => {
    new SuccessResponse({
      message: "Success code found!",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Success code found!",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "Success code found!",
      metadata: await DiscountService.getAllDiscountCodeWithProducts({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
