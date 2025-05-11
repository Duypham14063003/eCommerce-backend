const { product, clothing, electronic } = require("../product.model");
const { Types } = require("mongoose");

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

module.exports = {
  findAllDraftProducts,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
};
