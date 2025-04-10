const dev = {
  name: process.env.DEV_DB_NAME || "ecommercebackend",
  password: process.env.DEV_DB_PASS || "ecommercebackend",
};

// const env = process.env.NODE_ENV || "dev";
module.exports = dev;
