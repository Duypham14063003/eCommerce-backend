const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.res");
const { findByUserId } = require("../services/keyToken.service");
const Header = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // verify thử accessToken
    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.error("Error verifying token::", err);
      } else {
        console.log("Decoded verify::", decoded);
      }
    });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    return {
      code: "xxx",
      message: error.message,
      status: "error",
    };
  }
};

const authencation = asyncHandler(async (req, res, next) => {
  /**
   * 1- Check userId missing
   * 2- get accessToken
   * 3 - verify accessToken
   * 4 - check user in dbs
   * 5 - check keyStore with this userId
   * 6 - Ok all => next()
   */
  //1 check userId missing
  const userID = req.headers[Header.CLIENT_ID];
  if (!userID) throw new AuthFailureError("Invalid Request");
  // 2 get accessToken
  const keyStore = await findByUserId(userID);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  //3 verify accessToken
  const accessToken = req.headers[Header.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userID !== decodeUser.userId) {
      // console.log("decodeUser::", decodeUser);
      throw new AuthFailureError("Invalid userID");
    }
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  verifyJWT,
  authencation,
};
