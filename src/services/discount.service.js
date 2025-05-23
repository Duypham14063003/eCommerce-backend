/**
 * Discount Service
 * 1. generator discount code [shop | admin]
 * 2. get discount amount [user]
 * 3. get all discount codes [user | shop]
 * 4. verify discount code [user ]
 * 5. delete discount code [shop | admin]
 * 6. Cancel discount code [shop | admin]
 */
import { BadRequestError, NotFoundError } from "../core/error.res";
import { convertToObjectId } from "../utils";
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
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
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
      discount_start_date: start_date,
      discount_end_date: end_date,
      discount_max_users: max_uses,
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
  }
}
