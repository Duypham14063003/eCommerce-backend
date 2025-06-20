const app = require("./src/app");
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log("Server is running on port 3055");
});

process.on("SIGNT", () => {
  server.close(() => console.log("Server closed"));
});
module.exports = server;
