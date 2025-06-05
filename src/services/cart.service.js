const { BadRequestError, NotFoundError } = require("../core/error.res");
const {
  isCartExists,
  createUserCart,
  updateUserCartQuanity,
  getListUserCart,
  deleteUserCart,
} = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");

class CartService {
  static async addToCart({ userId, product = {} }) {
    console.log("addToCart ::", userId, product);
    // check cart exists for user
    const userCart = await isCartExists({ userId });
    console.log("userCart ::", userCart);
    if (!userCart) {
      console.log("userCart not exists, must create new cart");
      return await createUserCart({ userId, product });
    }
    // co gio hang nhung khong co san pham
    if (!userCart.cart_products?.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // co gio hang va co san pham -> thi update quantity
    return await updateUserCartQuanity({ userId: userId, product });
  }

  //need cover addToCart

  //update cart
  /**
   * shop_order_ids: [
   *    shopId,
   *    item_products:[
   *        quantity,
   *        price,
   *        shopId,
   *        old_quantity,
   *        productId,
   *        version // khóa lạc quan và khóa bi quan
   *    ]
   * ]
   *
   */
  static async addToCartV2({ userId, shop_order_ids }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // check product
    const foundProduct = await getProductById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    //compare
    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
      throw new NotFoundError("Product not found in this shop");
    }
    if (quantity === 0) {
      //delete product from cart
    }

    return await updateUserCartQuanity({
      userId: userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    console.log("deleteUserCart ::", userId, productId);
    return await deleteUserCart({ userId, productId });
  }

  static async getListUserCart({ userId }) {
    return await getListUserCart({ userId: userId });
  }
}

module.exports = CartService;
