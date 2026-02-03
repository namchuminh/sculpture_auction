const authRoute = require("./auth.routes.js");
const userRoute = require("./users.routes.js");
const categoryRoute = require("./categories.routes.js");
const sculptureRoute = require("./sculptures.routes.js");
const sculptureImagesRoute = require("./sculptureImages.routes.js");
const auctionRoute = require("./auctions.routes.js");
const bidRoute = require("./bids.routes.js");
const watchlistRoute = require("./watchlist.routes.js");
const orderRoute = require("./orders.routes.js");
const paymentRoute = require("./payments.routes.js");
const reviewRoute = require("./reviews.routes.js");
const notificationRoute = require("./notifications.routes.js");

function route(app) {
  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.use("/categories", categoryRoute);
  app.use("/sculptures", sculptureRoute);
  app.use("/sculpture-images", sculptureImagesRoute);
  app.use("/auctions", auctionRoute);
  app.use("/bids", bidRoute);
  app.use("/watchlist", watchlistRoute);
  app.use("/orders", orderRoute);
  app.use("/payments", paymentRoute);
  app.use("/reviews", reviewRoute);
  app.use("/notifications", notificationRoute);
}

module.exports = route;
