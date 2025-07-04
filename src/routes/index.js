const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");

const { pushToLogDiscord } = require("../middlewares/index");

// push to log discord
router.use(pushToLogDiscord);
// check  apikey
router.use(apiKey);
//check permission
router.use(permission("0000"));

// router.use(express.json());
//sign up
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/inventory", require("./inventory"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access/index"));

// handling error
// hamf middleware
router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error); // truyền lỗi cho middleware xử lý lỗi
});

// middleware xử lý lỗi
router.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});
module.exports = router;
