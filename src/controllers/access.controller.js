const AccessService = require("../services/access.service");
const { OK, CREATED } = require("../core/success.res");
class AccessController {
  signUp = async (req, res, next) => {
    // console.log(`[P]::signUp::`, req.body);
    new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AccessController();
