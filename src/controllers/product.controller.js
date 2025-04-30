const { OK, CREATED, SuccessResponse } = require("../core/success.res");
const ProductService = require("../services/product.service");
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductService.CreateProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}
module.exports = new ProductController();
