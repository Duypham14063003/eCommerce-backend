const { OK, CREATED, SuccessResponse } = require("../core/success.res");
const ProductService = require("../services/product.service");
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create product success!",
      metadata: await ProductService.CreateProduct(
        req.body.product_type,
        req.body
      ),
    }).send(res);
  };
}
module.exports = new ProductController();
