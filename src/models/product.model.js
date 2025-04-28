const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const productSchema = new Schema(
  {
    product_name: { Types: String, required: true },
    product_price: { Types: Number, required: true },
    product_description: { Types: String },
    product_price: { Types: Number, required: true },
    product_quantity: { Types: Number, required: true },
    product_type: {
      Types: String,
      required: true,
      enum: ["Clothing", "Electronics", "Furniture"],
    },
    product_shop: String,
    product_attributes: { Types: Schema.Types.Mixed, required: true },
  },
  {
    collation: COLLECTION_NAME,
    timestamps: true,
  }
);
// define the product type = clothing,

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collation: "clothes",
    timestamps: true,
  }
);

// define the product type = electronics
const electronicsSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
  },
  {
    collation: "electronics",
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("Clothing", clothingSchema),
  electronic: model("Electronics", electronicsSchema),
};
