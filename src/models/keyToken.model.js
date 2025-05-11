// !dmbg de tao nhanh Schema
const mongoose = require("mongoose"); // Erase if already required
const DOCUMENT_NAME = "Key"; // Set the collection name in MongoDB
const COLLECTION_NAME = "Keys"; // Set the collection name in MongoDB
// Declare the Schema of the Mongo model
var keyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shops",
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    publicKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [], // nhung refresh token da su dung
    },
    refreshToken: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
    // colex: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyTokenSchema);
