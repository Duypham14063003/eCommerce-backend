const shopModel = require("../models/shop.model");
const bycrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.res");
const { CREATED } = require("../core/success.res");
const { findByEmail } = require("./shop.service");
const ShopService = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  /**
   *
   * check token user
   */
  static handleRefreshToken = async (refreshToken) => {
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // xem thu nguoi dung la ai
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );
      console.log({ userId, email });

      // xoa token cu
      await KeyTokenService.deleteKeybyId(userId);
      throw new ForbiddenError("Something wrong happend !! please login again");
    }
    // check token
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken) {
      throw new AuthFailureError(" Shop is not register 1 !!");
    }
    // verify token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );

    // check user id
    const foundshop = await ShopService.findByEmail({ email });
    if (!foundshop) {
      throw new AuthFailureError(" Shop is not register 2 !!");
    }

    // cap lai 1 cap token moi
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    // update token
    // holderToken.updateOne({
    //   $set: {
    //     refreshToken: tokens.refreshToken,
    //   },
    //   $addToSet: {
    //     refreshTokensUsed: refreshToken,
    //   },
    // });

    holderToken.refreshToken = tokens.refreshToken;
    holderToken.refreshTokensUsed.push(refreshToken);
    await holderToken.save();

    return {
      user: { userId, email },
      tokens,
    };
  };

  static login = async ({ email, password, refreshToken = null }) => {
    //1. check if user already exists
    const foundShop = await findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError(`Shop not register`);
    }
    //2 check password
    const match = await bycrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError(`Password is not correct`);
    }

    //3 created privateKey and publicKey
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    //generate token
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      userId: foundShop._id,
      publicKey,
      privateKey,
    });
    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };
  static signUp = async ({ name, email, password }) => {
    // step 1: check if user already exists
    const hodelShop = await shopModel.findOne({ email: email }).lean();
    console.log(`[P]::signUp::hodelShop`, hodelShop);
    if (hodelShop) {
      throw new BadRequestError(`Email Shop already exists`, 400);
    }
    // step 2: hash the password
    const hashedPassword = await bycrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // created privateKey and publicKey

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");
      console.log({ privateKey, publicKey });

      // luwu vao database
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        return {
          code: "xxx",
          message: "keyStore error",
        };
      }

      // create token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      console.log(`created token successfully`, tokens);

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fileds: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
      // const tokens = await
    }
    return {
      code: 200,
      metadata: null,
    };
  };
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(`[P]::logout::delKey`, delKey);
    return delKey;
  };
}
module.exports = AccessService;
