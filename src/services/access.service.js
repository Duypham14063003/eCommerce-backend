const shopModel = require("../models/shop.model");
const bycrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.res");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
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
}
module.exports = AccessService;
