// factory to manage products
const { product, clothing, electronic } = require("../models/product.model");
const { BadRequestError } = require("../core/error.res");
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
  async createProduct() {
    return await product.create(this);
  }
}

//define subclass for different product types Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError("Create new clothing failed");
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronics = await electronic.create(this.product_attributes);
    if (!newElectronics) {
      throw new BadRequestError("Create new electronics failed");
    }

    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("Create new product failed");
    }

    return newProduct;
  }
}

module.exports = ProductFactory;
