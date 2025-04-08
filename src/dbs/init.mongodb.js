"use strict";

const mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://ngocduy14062003:Phamngocduy14062003@ecommercebackend.i555csu.mongodb.net/?retryWrites=true&w=majority&appName=eCommerceBackend";
const { countConnect } = require("../helpers/check.connect");
class database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    // connect to mongodb
    mongoose
      .connect(connectionString, { maxPoolSize: 50 })
      .then((_) => {
        console.log("MongoDB connected");
        countConnect();
      })
      .catch((err) => {
        console.log("MongoDB connection error: ", err);
      });
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new database();
    }
    return this.instance;
  }
}

const instanceMongoDB = database.getInstance();
module.exports = instanceMongoDB;
