const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const compression = require("compression");

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db

//init routes
app.get("/", (req, res, next) => {
  res.send("Hello World");
});
// handling error

module.exports = app;
