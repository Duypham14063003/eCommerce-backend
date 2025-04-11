const Header = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const { findById } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers[Header.API_KEY];
    if (!apiKey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }
    //check object key
    const objKey = await findById(apiKey);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden error",
      });
    }
    req.objKey = objKey;
    next();
  } catch (error) {}
};

// check permission
const permission = (permission) => {
  return (req, res, next) => {
    const objKey = req.objKey;
    if (!objKey.permissions.includes(permission)) {
      return res.status(403).json({
        message: "permission dinied",
      });
    }
    console.log("Permission ::", permission);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res.status(403).json({
        message: "permission dinied",
      });
    }
    next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
