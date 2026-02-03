import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { PATHS } from "./paths";
import Guard from "../auth/guard";

import PublicLayout from "./PublicLayout";

import Categories from "../pages/public/Categories";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Sculptures from "../pages/public/Sculptures";
import SculptureDetail from "../pages/public/SculptureDetail";
import Auctions from "../pages/public/Auctions";
import AuctionDetail from "../pages/public/AuctionDetail";
import Watchlist from "../pages/user/Watchlist";
import Orders from "../pages/user/Orders";
import Order from "../pages/user/Order";
import Profile from "../pages/user/Profile";
import NotificationsCenter from "../pages/user/NotificationsCenter";

import BackofficeShell from "../backoffice/BackofficeShell";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminSculptures from "../pages/admin/AdminSculptures";
import AdminAuctions from "../pages/admin/AdminAuctions";
import AdminAuctionDetail from "../pages/admin/AdminAuctionDetail";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminPayments from "../pages/admin/AdminPayments";
import AdminReviews from "../pages/admin/AdminReviews";

import ArtistDashboard from "../pages/artist/ArtistDashboard";
import ArtistSculptures from "../pages/artist/ArtistSculptures";
import ArtistSculptureNew from "../pages/artist/ArtistSculptureNew";
import ArtistSculptureEdit from "../pages/artist/ArtistSculptureEdit";
import ArtistAuctions from "../pages/artist/ArtistAuctions";
import ArtistAuctionNew from "../pages/artist/ArtistAuctionNew";
import ArtistAuctionDetail from "../pages/artist/ArtistAuctionDetail";
import ArtistOrders from "../pages/artist/ArtistOrders";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
        <Route path={PATHS.HOME} element={<Home />} />
        <Route path={PATHS.CATEGORIES} element={<Categories />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.REGISTER} element={<Register />} />
        <Route path={PATHS.SCULPTURES} element={<Sculptures />} />
        <Route path={PATHS.SCULPTURE_DETAIL} element={<SculptureDetail />} />
        <Route path={PATHS.AUCTIONS} element={<Auctions />} />
        <Route path={PATHS.AUCTION_DETAIL} element={<AuctionDetail />} />

        <Route
          path={PATHS.PROFILE}
          element={
            <Guard roles={["ADMIN", "ARTIST", "USER"]}>
              <Profile />
            </Guard>
          }
        />
        <Route
          path={PATHS.NOTIFICATIONS}
          element={
            <Guard roles={["ADMIN", "ARTIST", "USER"]}>
              <NotificationsCenter />
            </Guard>
          }
        />
        <Route
          path={PATHS.WATCHLIST}
          element={
            <Guard roles={["ADMIN", "ARTIST", "USER"]}>
              <Watchlist />
            </Guard>
          }
        />
        <Route
          path={PATHS.ORDERS}
          element={
            <Guard roles={["ADMIN", "ARTIST", "USER"]}>
              <Orders />
            </Guard>
          }
        />
        <Route
          path={PATHS.ORDER_DETAIL}
          element={
            <Guard roles={["ADMIN", "ARTIST", "USER"]}>
              <Order />
            </Guard>
          }
        />
      </Route>

      {/* Admin backoffice */}
      <Route
        path="/admin/*"
        element={
          <Guard roles={["ADMIN"]}>
            <BackofficeShell mode="ADMIN" />
          </Guard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="sculptures" element={<AdminSculptures />} />
        <Route path="auctions" element={<AdminAuctions />} />
        <Route path="auctions/:id" element={<AdminAuctionDetail />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="notifications" element={<NotificationsCenter />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Artist backoffice */}
      <Route
        path="/artist/*"
        element={
          <Guard roles={["ARTIST"]}>
            <BackofficeShell mode="ARTIST" />
          </Guard>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ArtistDashboard />} />
        <Route path="sculptures" element={<ArtistSculptures />} />
        <Route path="sculptures/new" element={<ArtistSculptureNew />} />
        <Route path="sculptures/:id/edit" element={<ArtistSculptureEdit />} />
        <Route path="auctions" element={<ArtistAuctions />} />
        <Route path="auctions/new" element={<ArtistAuctionNew />} />
        <Route path="auctions/:id" element={<ArtistAuctionDetail />} />
        <Route path="orders" element={<ArtistOrders />} />
        <Route path="notifications" element={<NotificationsCenter />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<div className="p-6">Không tìm thấy trang (404)</div>} />
    </Routes>
  );
}
