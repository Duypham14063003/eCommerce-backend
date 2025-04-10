const JWT = require("jsonwebtoken");

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

module.exports = {
  createTokenPair,
};
