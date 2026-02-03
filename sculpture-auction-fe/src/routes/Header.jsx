// src/routes/Header.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PATHS } from "./paths";
import { useAuth } from "../auth/AuthProvider";
import {
  fetchMyNotifications,
  markNotificationRead,
  readAllNotifications,
} from "../api/notifications.api";

function cx(...xs) {
  return xs.filter(Boolean).join(" ");
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

function IconBag({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7 8V7a5 5 0 0 1 10 0v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6.5 8h11l1 12.5a2 2 0 0 1-2 2H7.5a2 2 0 0 1-2-2L6.5 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconHeart({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 21s-7-4.7-9.3-9A5.7 5.7 0 0 1 12 6.7 5.7 5.7 0 0 1 21.3 12c-2.3 4.3-9.3 9-9.3 9Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4.5 20.5a7.5 7.5 0 0 1 15 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconBell({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChevronDown({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 9l6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cx(
          "rounded-xl px-4 py-2 text-sm font-semibold transition",
          "focus:outline-none focus:ring-2 focus:ring-slate-200",
          isActive
            ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
            : "text-slate-600 hover:text-slate-900 hover:bg-white/70"
        )
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const nav = useNavigate();
  const { isAuthed, role, logout, user } = useAuth();

  // Notifications
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const notifRef = useRef(null);
  useOnClickOutside(notifRef, () => setNotifOpen(false));

  const unreadCount = useMemo(
    () => notifications.filter((n) => !Number(n.is_read)).length,
    [notifications]
  );

  useEffect(() => {
    if (!notifOpen || !isAuthed) return;
    let alive = true;

    (async () => {
      setNotifLoading(true);
      try {
        const list = await fetchMyNotifications();
        if (!alive) return;
        setNotifications(list);
      } catch (_) {
        if (!alive) return;
        setNotifications([]);
      } finally {
        if (!alive) return;
        setNotifLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [notifOpen, isAuthed]);

  async function readOne(n) {
    if (Number(n.is_read)) return;
    try {
      await markNotificationRead(n.id);
      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, is_read: 1 } : x))
      );
    } catch (_) { }
  }

  async function readAll() {
    try {
      await readAllNotifications();
      setNotifications((prev) => prev.map((x) => ({ ...x, is_read: 1 })));
    } catch (_) { }
  }

  // User dropdown
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  useOnClickOutside(userRef, () => setUserOpen(false));

  const displayName =
    user?.full_name || user?.name || user?.email || (role ? role : "User");
  const avatarLetter = String(displayName).trim().charAt(0).toUpperCase();

  return (
    <div className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center gap-3">
          {/* Brand */}
          <Link to={PATHS.HOME} className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white text-sm font-extrabold">
              SA
            </div>
            <div className="leading-tight">
              <div className="text-sm font-extrabold text-slate-900">
                sculpture_auction
              </div>
              <div className="text-xs text-slate-500">Auction Platform</div>
            </div>
          </Link>

          {/* Desktop menu (pill group) */}
          <div className="ml-3 hidden md:flex items-center gap-1 rounded-2xl bg-slate-50 ring-1 ring-slate-200 px-1.5 py-1.5">
            <NavItem to={PATHS.CATEGORIES}>Danh mục</NavItem>
            <NavItem to={PATHS.SCULPTURES}>Tác phẩm</NavItem>
            <NavItem to={PATHS.AUCTIONS}>Đấu giá</NavItem>
          </div>

          {/* Search */}
          <div className="hidden lg:block flex-1 px-4">
            <div className="relative max-w-xl">
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="Tìm tác phẩm, chất liệu, danh mục..."
              />
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                Ctrl K
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            {/* Role quick links */}
            {role === "ADMIN" && (
              <Link
                className="hidden md:inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                to={PATHS.ADMIN}
              >
                Admin
              </Link>
            )}

            {role === "ARTIST" && (
              <Link
                className="hidden md:inline-flex rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                to={PATHS.ARTIST}
              >
                Artist
              </Link>
            )}

            {/* Icon group */}
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-1">
              {/* Bell */}
              {isAuthed && (
                <div className="relative" ref={notifRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotifOpen((v) => !v);
                      setUserOpen(false);
                    }}
                    className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white ring-1 ring-slate-200 hover:bg-slate-50"
                    aria-label="Thông báo"
                  >
                    <IconBell className="h-5 w-5 text-slate-700" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-slate-900 px-1 text-[11px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <div className="flex items-center justify-between px-4 py-3">
                        <div className="text-sm font-extrabold text-slate-900">
                          Thông báo {unreadCount > 0 ? `(${unreadCount})` : ""}
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={readAll}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                          >
                            Đọc tất cả
                          </button>
                          <Link
                            to={PATHS.NOTIFICATIONS}
                            onClick={() => setNotifOpen(false)}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                          >
                            Xem tất cả
                          </Link>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      {notifLoading ? (
                        <div className="px-4 py-6 text-sm text-slate-500">
                          Đang tải...
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-4 py-6 text-sm text-slate-500">
                          Chưa có thông báo.
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-auto">
                          {notifications.slice(0, 8).map((n) => {
                            const isUnread = !Number(n.is_read);
                            return (
                              <button
                                key={n.id}
                                onClick={() => readOne(n)}
                                className={cx(
                                  "w-full text-left px-4 py-3 hover:bg-slate-50",
                                  isUnread ? "bg-slate-50/60" : ""
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  {isUnread && (
                                    <span className="h-2 w-2 rounded-full bg-slate-900" />
                                  )}
                                  <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                                    {n.title}
                                  </div>
                                  {n.type && (
                                    <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                      {n.type}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 text-sm text-slate-700 line-clamp-2">
                                  {n.content}
                                </div>
                                <div className="mt-1 text-xs text-slate-500">
                                  {new Date(n.createdAt).toLocaleString("vi-VN")}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      <div className="h-px bg-slate-100" />

                      <div className="px-4 py-3">
                        <Link
                          to={PATHS.NOTIFICATIONS}
                          onClick={() => setNotifOpen(false)}
                          className="inline-flex w-full justify-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                        >
                          Mở trung tâm thông báo
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* User dropdown */}
              {!isAuthed ? (
                <div className="flex items-center gap-2 pr-1">
                  <Link
                    className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-white hover:ring-1 hover:ring-slate-200"
                    to={PATHS.LOGIN}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    to={PATHS.REGISTER}
                  >
                    Đăng ký
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={userRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setUserOpen((v) => !v);
                      setNotifOpen(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-2 py-1.5 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-white text-sm font-bold">
                      {avatarLetter}
                    </div>
                    <div className="hidden text-left md:block">
                      <div className="text-sm font-extrabold text-slate-900">
                        {user?.full_name || user?.name || "Me"}
                      </div>
                      <div className="text-xs text-slate-500">{role || "USER"}</div>
                    </div>
                    <IconChevronDown className="h-4 w-4 text-slate-600" />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                      <div className="px-4 py-3">
                        <div className="text-sm font-extrabold text-slate-900">
                          {displayName}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {user?.email || ""}
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />
                      <div className="p-2">
                        <Link
                          to={PATHS.ORDERS}
                          onClick={() => setUserOpen(false)}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                            <IconBag className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 leading-5">Đơn hàng</div>
                            <div className="text-xs text-slate-500 truncate">Xem đơn đã thắng đấu giá</div>
                          </div>
                        </Link>

                        <Link
                          to={PATHS.WATCHLIST}
                          onClick={() => setUserOpen(false)}
                          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                            <IconHeart className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 leading-5">Đang theo dõi</div>
                            <div className="text-xs text-slate-500 truncate">Danh sách phiên quan tâm</div>
                          </div>
                        </Link>

                        <Link
                          to={PATHS.PROFILE}
                          onClick={() => setUserOpen(false)}
                          className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                            <IconUser className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 leading-5">Cập nhật thông tin</div>
                            <div className="text-xs text-slate-500 truncate">Hồ sơ, email, mật khẩu</div>
                          </div>
                        </Link>
                      </div>

                      <div className="h-px bg-slate-100" />

                      <div className="p-2">
                        <button
                          className="flex w-full items-center rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setUserOpen(false);
                            logout();
                            nav(PATHS.HOME, { replace: true });
                          }}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu row */}
        <div className="md:hidden pb-3">
          <div className="flex items-center gap-1 rounded-2xl bg-slate-50 ring-1 ring-slate-200 px-1.5 py-1.5">
            <NavItem to={PATHS.CATEGORIES}>Danh mục</NavItem>
            <NavItem to={PATHS.SCULPTURES}>Tác phẩm</NavItem>
            <NavItem to={PATHS.AUCTIONS}>Đấu giá</NavItem>
          </div>

          <div className="mt-3">
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="Tìm tác phẩm, chất liệu, danh mục..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
