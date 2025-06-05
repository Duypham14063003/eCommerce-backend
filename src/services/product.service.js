// factory to manage products
const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.res");
const {
  findAllDraftProducts,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");
// define Factory class to create products
class ProductFactory {
  static async CreateProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronics":
        return new Electronics(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
  }

  static async updateProduct(type, productId, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).updateProduct(productId);
      case "Electronics":
        return new Electronics(payload).updateProduct(productId);
      default:
        throw new BadRequestError("Invalid product type");
    }
  }

  // PUT
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT

  // QUERY
  static async findAllDraftProducts({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isDraft: true,
    };
    return await findAllDraftProducts({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = {
      product_shop,
      isPublished: true,
    };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProduct(keySearch) {
    return await searchProductByUser(keySearch);
  }

  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: {
        product_name: 1,
        product_price: 1,
        product_thumb: 1,
        product_shop: 1,
      },
    });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}

// define base product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_price,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_price = product_price;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = product.create({ ...this, _id: product_id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  // update product
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({ productId, bodyUpdate, model: product });
  }
}

//define subclass for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) {
      throw new BadRequestError("Create new clothing failed");
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }

    return newProduct;
  }

  async updateProduct(productId) {
    //1. remove attributes has null or undefined
    const objectParams = removeUndefinedObject(this);
    //2. check xem update o cho nao?
    if (objectParams.product_attributes) {
      // update child
      await updateProductById({
        productId,
        bodyUpdate: removeUndefinedObject(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronics) {
      throw new BadRequestError("Create new electronics failed");
    }

    const newProduct = await super.createProduct(newElectronics._id);
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }

    return newProduct;
  }
}

module.exports = ProductFactory;
