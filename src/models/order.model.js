const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
// Declare the Schema of the Mongo model
var apiKeySchema = new mongoose.Schema(
  {
    order_userId: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object,
      defalut: {},
    },
    /**
     * order_checkout {
     *  totalPrice: 0, // tong tien thanh toan
     *  totalAppliedDiscount: 0, // tong tien giam gia
     *  feeShip: 0, // tong tien ship
     * }
     */
    order_shipping: {
      type: Object,
      defalut: {},
    },
    /**
     * street
     * city
     * state
     * country
     */
    order_payment: {
      type: Object,
      defalut: {},
    },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: "#000014062003" },
    order_status: {
      type: String,
      enum: ["pending", "comfirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeySchema);
