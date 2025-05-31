/**
 * Discount Service
 * 1. generator discount code [shop | admin]
 * 2. get discount amount [user]
 * 3. get all discount codes [user | shop]
 * 4. verify discount code [user ]
 * 5. delete discount code [shop | admin]
 * 6. Cancel discount code [shop | admin]
 */
const { BadRequestError, NotFoundError } = require("../core/error.res");
const {
  checkDiscountExists,
  findDiscountCodeUnSelect,
} = require("../models/repositories/discount.repo");
const { findAllProduct } = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils");
const discount = require("../models/discount.model");
class DiscountService {
  // Generate discount code
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // kiem tra
    if (
      new Date() < new Date(start_date) ||
      new Date(start_date) > new Date(end_date)
    ) {
      throw new BadRequestError(
        "Discount code start date should be in the future"
      );
    }

    if (new Date(start_date) >= new Date(end_date)) {
      throw new BadRequestError("start_date must be before end_date");
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();
    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: [],
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: convertToObjectId(shopId),
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode() {}

  /**
   * get all discount code by available with products
   * liệt kê tất cả sản phẩm với mã giảm giá đó
   */
  static async getAllDiscountCodeWithProducts({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }
    let products = [];
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    if (discount_applies_to === "all") {
      // get all products
      products = await findAllProduct({
        filter: { product_shop: shopId, isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      products = await findAllProduct({
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    console.log("products ::", products);
    return products;
  }

  // COVER LẠI CHỨC NĂNG: LIỆT KÊ TẤT CẢ SẢN PHẨM VỚI MÃ GIẢM GIÁ ĐÓ

  static async coverGetAllDiscountCodeWithProducts({
    code,
    shopId,
    limit,
    page,
  }) {
    // tim mã giảm giá
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount code not found");
    }
    // lấy các sản phẩm áp dụng mã giảm giá
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products = [];
    if (discount_applies_to === "all") {
      // lấy tất cả sản phẩm của shop
      products = await findAllProduct({
        filter: { product_shop: convertToObjectId(shopId), isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else if (discount_applies_to === "specific") {
      // lấy các sản phẩm cụ thể theo mã giảm giá
      products = await findAllProduct({
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
  }

  // KẾT THÚC COVER

  /**
   * get all discount code by shopId
   * laays nhuwng mã giảm giá của shop
   */

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findDiscountCodeUnSelect({
      limit: limit,
      page: page,
      filter: {
        discount_shopId: convertToObjectId(shopId),
        discount_is_active: true,
      },
      Select: ["discount_shopId", "discount_code", "discount_name"],
      model: discount,
    });

    return discounts;
  }

  /**
   * apply discount code
   */
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectId(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found or inactive");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    // kiem tra mã giảm giá có đang hoạt động hay không
    if (!discount_is_active) {
      throw new NotFoundError("Discount code is not active");
    }
    // kiem tra mã giảm giá đã sử dụng hết hay chưa
    if (discount_max_uses <= 0) {
      throw new NotFoundError("Discount code has reached its maximum uses");
    }
    // kiem tra mã giảm giá có đang trong thời gian sử dụng hay không
    if (
      new Date() <
      new Date(discount_start_date || new Date() > new Date(discount_end_date))
    ) {
      throw new BadRequestError("Discount code is not yet valid");
    }

    let totalOrder = 0;
    // check xem co set gia tri toi thieu hay khong
    if (discount_min_order_value > 0) {
      //get tolal gior hang
      totalOrder = products.reduce((total, product) => {
        return total + (product.price || 0) * (product.quantity || 1);
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new BadRequestError(
          `Total order value must be at least ${discount_min_order_value}`
        );
      }
    }

    // kiem tra xem mã giảm giá đã sử dụng hết hay chưa
    if (discount_max_uses_per_user > 0) {
      const userUseDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );
      if (userUseDiscount) {
        if (userUseDiscount.uses >= discount_max_uses_per_user) {
          throw new BadRequestError(
            "You have reached the maximum uses for this discount code"
          );
        }
      } else {
        // nếu người dùng chưa sử dụng mã giảm giá này thì thêm vào
        discount_users_used.push({ userId, uses: 1 });
      }
    }
    // tính toán giá trị giảm giá
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);
    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  /**
   *delete discount code, tu customer lai theo cac truong hop
   */
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findByIdAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ shopId, codeId }) {
    const foundDiscount = await discount.findOne({
      discount_code: codeId,
      discount_shopId: convertToObjectId(shopId),
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found");
    }
    // nếu mã giảm giá đã sử dụng thì không thể hủy
    if (foundDiscount.discount_uses_count > 0) {
      throw new BadRequestError("Cannot cancel a used discount code");
    }

    const result = await discount.findByIdAndUpdate({
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_uses_count: -1,
        discount_max_uses: -1,
      },
    });

    return result;
  }
}
module.exports = DiscountService;
