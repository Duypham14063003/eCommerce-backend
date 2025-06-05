const { findById } = require("../keytoken.model");
const { clothing, electronic, product } = require("../product.model");
const { Types } = require("mongoose");
const { unGetSelectData, convertToObjectId } = require("../../utils/index");

const findAllDraftProducts = async ({ query, limit, skip }) => {
  return queryAllProductsShop({ query, limit, skip });
};

const findAllPublishForShop = async ({ query, limit, skip }) => {
  return queryAllProductsShop({ query, limit, skip });
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  console.log("product_shop as ObjectId:", new Types.ObjectId(product_shop));
  console.log("product_id as ObjectId:", new Types.ObjectId(product_id));

  const foundShop = await product
    .findOne({
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop),
    })
    .collation({ locale: "en", strength: 2 });
  if (!foundShop) return null;
  console.log("foundShop ::", foundShop);
  foundShop.isDraft = false;
  foundShop.isPublished = true;

  // Dùng save() để lưu thay đổi vào document
  const savedShop = await foundShop.save();

  return savedShop ? savedShop.modifiedCount : 0; // hoặc return saved nếu bạn cần trả về document luôn
};

const unPublishProductByShop = async ({ product_shop, product_id }) => {
  console.log("product_shop as ObjectId:", new Types.ObjectId(product_shop));
  console.log("product_id as ObjectId:", new Types.ObjectId(product_id));

  const foundShop = await product
    .findOne({
      _id: new Types.ObjectId(product_id),
      product_shop: new Types.ObjectId(product_shop),
    })
    .collation({ locale: "en", strength: 2 });
  if (!foundShop) return null;
  console.log("foundShop ::", foundShop);
  foundShop.isDraft = true;
  foundShop.isPublished = false;

  // Dùng save() để lưu thay đổi vào document
  const savedShop = await foundShop.save();

  return savedShop ? savedShop.modifiedCount : 0; // hoặc return saved nếu bạn cần trả về document luôn
};

const queryAllProductsShop = async ({ query, limit, skip }) => {
  const products = await product
    .find(query)
    .collation({ locale: "en", strength: 2 })
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();

  return products;
};

const searchProductByUser = async (keySearch) => {
  console.log("keySearch ::", keySearch);
  const regexSearch = new RegExp(keySearch); // kiểm tra chuỗi hợp lệ
  const result = await product
    .find(
      {
        isPublished: true,
        $text: { $search: regexSearch },
      },
      {
        score: { $meta: "textScore" },
      }
    )
    .collation({ locale: "vi", strength: 1 })
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return result; // Ensure the function returns the result
};

/**
 * ???
 * limt : 50
 * page = 2
 * skip = 1 * 50 = 50
 * if page = 3
 * ship = 2 *50 = 100
 */
const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .collation({ locale: "en", strength: 2 })
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(select)
    .exec();
  return products;
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model
    .findByIdAndUpdate(productId, bodyUpdate, {
      new: isNew,
    })
    .collation({ locale: "en", strength: 2 });
};

const findProduct = async ({ product_id, unSelect }) => {
  const productdetail = await product
    .findById(product_id)
    .collation({ locale: "en", strength: 2 })
    .select(unGetSelectData(unSelect));

  return productdetail;
};

const getProductById = async (product_id) => {
  console.log("product_id in getProductById::", product_id);
  return await product
    .findOne({ _id: convertToObjectId(product_id) })
    .collation({ locale: "en", strength: 2 })
    .lean();
};

module.exports = {
  findAllDraftProducts,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
  getProductById,
};
