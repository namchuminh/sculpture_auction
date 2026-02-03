const User = require("./users.model.js");
const Category = require("./categories.model.js");
const Sculpture = require("./sculptures.model.js");
const SculptureImage = require("./sculpture_images.model.js");
const Auction = require("./auctions.model.js");
const Bid = require("./bids.model.js");
const Watchlist = require("./watchlist.model.js");
const Order = require("./orders.model.js");
const Payment = require("./payments.model.js");
const Review = require("./reviews.model.js");
const Notification = require("./notifications.model.js");

// Category - Sculpture
Category.hasMany(Sculpture, { foreignKey: "category_id" });
Sculpture.belongsTo(Category, { foreignKey: "category_id" });

// User(Artist) - Sculpture
User.hasMany(Sculpture, { foreignKey: "artist_id", as: "sculptures" });
Sculpture.belongsTo(User, { foreignKey: "artist_id", as: "artist" });

// Sculpture - Images
Sculpture.hasMany(SculptureImage, { foreignKey: "sculpture_id", as: "images" });
SculptureImage.belongsTo(Sculpture, { foreignKey: "sculpture_id" });

// Sculpture - Auction
Sculpture.hasMany(Auction, { foreignKey: "sculpture_id" });
Auction.belongsTo(Sculpture, { foreignKey: "sculpture_id", as: "sculpture" });

// User(Seller) - Auction
User.hasMany(Auction, { foreignKey: "seller_id", as: "sellingAuctions" });
Auction.belongsTo(User, { foreignKey: "seller_id", as: "seller" });

// User(Winner) - Auction
User.hasMany(Auction, { foreignKey: "winner_id", as: "wonAuctions" });
Auction.belongsTo(User, { foreignKey: "winner_id", as: "winner" });

// Auction - Bid
Auction.hasMany(Bid, { foreignKey: "auction_id", as: "bids" });
Bid.belongsTo(Auction, { foreignKey: "auction_id" });

// User(Bidder) - Bid
User.hasMany(Bid, { foreignKey: "bidder_id", as: "bids" });
Bid.belongsTo(User, { foreignKey: "bidder_id", as: "bidder" });

// Watchlist
User.hasMany(Watchlist, { foreignKey: "user_id", as: "watchlist" });
Watchlist.belongsTo(User, { foreignKey: "user_id" });
Auction.hasMany(Watchlist, { foreignKey: "auction_id" });
Watchlist.belongsTo(Auction, { foreignKey: "auction_id", as: "auction" });

// Orders
User.hasMany(Order, { foreignKey: "buyer_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "buyer_id", as: "buyer" });
Auction.hasMany(Order, { foreignKey: "auction_id" });
Order.belongsTo(Auction, { foreignKey: "auction_id", as: "auction" });
Sculpture.hasMany(Order, { foreignKey: "sculpture_id" });
Order.belongsTo(Sculpture, { foreignKey: "sculpture_id", as: "sculpture" });

// Payments
Order.hasMany(Payment, { foreignKey: "order_id", as: "payments" });
Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Reviews
Order.hasMany(Review, { foreignKey: "order_id" });
Review.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Sculpture.hasMany(Review, { foreignKey: "sculpture_id", as: "reviews" });
Review.belongsTo(Sculpture, { foreignKey: "sculpture_id" });
User.hasMany(Review, { foreignKey: "user_id", as: "reviews" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Notifications
User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  User,
  Category,
  Sculpture,
  SculptureImage,
  Auction,
  Bid,
  Watchlist,
  Order,
  Payment,
  Review,
  Notification,
};
