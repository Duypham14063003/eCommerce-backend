const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.res");
class AccessController {
  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    // console.log(`[P]::signUp::`, req.body);
    new CREATED({
      message: "Register OK!",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
}
module.exports = new AccessController();
