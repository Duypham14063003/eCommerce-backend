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

  // update product
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update product success!",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish product success!",
      metadata: await ProductService.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "unPublish product success!",
      metadata: await ProductService.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  //query
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all draft products success!",
      metadata: await ProductService.findAllDraftProducts({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all publish products success!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all list products success!",
      metadata: await ProductService.searchProduct(req.params.keySearch),
    }).send(res);
  };

  findAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findAllProducts success!",
      metadata: await ProductService.findAllProduct(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list findAllProducts success!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
  // end query
}
module.exports = new ProductController();
