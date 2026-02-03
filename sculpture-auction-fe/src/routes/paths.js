export const PATHS = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  SCULPTURES: "/sculptures",
  SCULPTURE_DETAIL: "/sculptures/:id",
  AUCTIONS: "/auctions",
  AUCTION_DETAIL: "/auctions/:id",
  CATEGORIES: "/categories",

  PROFILE: "/me",
  NOTIFICATIONS: "/notifications",
  WATCHLIST: "/watchlist",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",

  // backoffice roots
  ADMIN_ROOT: "/admin",
  ARTIST_ROOT: "/artist",

  // legacy (kept to avoid breaking older imports)
  ADMIN: "/admin",
  ARTIST: "/artist",
};
