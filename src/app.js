const express = require("express");
const morgan = require("morgan");
const app = express();
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();
//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// init db
require("../src/dbs/init.mongodb");
// const { checkOverLoad } = require("../src/helpers/check.connect");
// const server = require("../server");
// checkOverLoad();
//init routes
app.use("", require("./routes/index"));
// handling error

module.exports = app;
