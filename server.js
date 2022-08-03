const app = require("./app");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8000;
const URI = "mongodb://127.0.0.1:27017/node-shop";

mongoose.Promise = global.Promise;

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected!");
    app.listen(PORT, () => {
      console.log(`Server is up on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(" connection err", err);
  });
