const Logger = require("../loggers/discord.log.v2");

const pushToLogDiscord = (req, res, next) => {
  try {
    Logger.sendToFormatCode({
      title: `Method: ${req.method}`,
      code: req.method === "GET" ? req.query : req.body,
      message: `${req.get("host")} ${req.originalUrl} - ${req.ip}`,
    });
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  pushToLogDiscord,
};
