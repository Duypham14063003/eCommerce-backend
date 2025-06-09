const { BadRequestError, NotFoundError } = require("../core/error.res");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class checkoutService {
  /**
   * {
   *  cartId,
   *  userId,
   *  shop_order_ids:[
   * {
   * shopId,
   * shop_discounts: [
   * {
   *  shop_id,
   *  discount_id,
   *  codeId
   * }
   * ],
   * item_productIds:{
   *      price,
   *      quantity,
   *      productId,
   * }
   * }
   * ]
   * }
   */

  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new NotFoundError("Cart not found or has been deleted");
    }
    const checkout_order = {
        totalPrice: 0, // tong tien hang
        freeShip: 0, // tong tien ship
        totalDiscount: 0, // tong tien giam gia
        totalCheckout: 0, // tong tien thanh toan
      },
      shop_order_ids_new = [];

    // tinh tong tien bill
    for (let i = 0; i < shop_order_ids.length(); i++) {
      const {
        shopId,
        shop_discount = [],
        item_products = [],
      } = shop_order_ids[i];
      // check product available
      const checkProductService = checkProductByServer(item_products);
      if (!checkProductService[0]) throw new BadRequestError("order wrong!");
      // tính tổng tiền hàng
      const checkoutPrice = checkProductService.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      // tong tien truoc khi xu ly
      checkout_order.totalPrice += checkoutPrice;
      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // tong tien hang truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductService,
      };
      // new shop_discounts > 0, kiem tra xem co hop le khong?
      if (shop_discount.length > 0) {
        // gia su chi co 1 discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shop_discount[0].codeId,
          userId,
          shopId,
          products: checkProductService,
        });
        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount; // tong tien sau khi giam gia
        }
      }
      //tong tien thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  //order
  static async orderByUser({
    shop_order_ids = [],
    userId,
    cartId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await checkoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });
  }
}

module.exports = checkoutService;
