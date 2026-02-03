import React, { useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { labelRole } from "./utils";

function clsActive({ isActive }) {
  return [
    "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition",
    isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100",
  ].join(" ");
}

function Section({ title, children }) {
  return (
    <div className="mt-5">
      <div className="px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  );
}

export default function BackofficeShell({ mode }) {
  const { user, logout } = useAuth();

  const menu = useMemo(() => {
    if (mode === "ADMIN") {
      return {
        overview: [{ label: "Bảng điều khiển", to: "/admin/dashboard" }],
        manage: [
          { label: "Người dùng", to: "/admin/users" },
          { label: "Danh mục", to: "/admin/categories" },
          { label: "Tác phẩm", to: "/admin/sculptures" },
          { label: "Phiên đấu giá", to: "/admin/auctions" },
          { label: "Đơn hàng", to: "/admin/orders" },
          { label: "Thanh toán", to: "/admin/payments" },
          { label: "Đánh giá", to: "/admin/reviews" },
        ],
        account: [
          { label: "Thông báo", to: "/admin/notifications" },
          { label: "Hồ sơ", to: "/admin/profile" },
        ],
      };
    }
    return {
      overview: [{ label: "Bảng điều khiển", to: "/artist/dashboard" }],
      manage: [
        { label: "Tác phẩm", to: "/artist/sculptures" },
        { label: "Phiên đấu giá", to: "/artist/auctions" },
        { label: "Đơn hàng", to: "/artist/orders" },
      ],
      account: [
        { label: "Thông báo", to: "/artist/notifications" },
        { label: "Hồ sơ", to: "/artist/profile" },
      ],
    };
  }, [mode]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-slate-900" />
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">Khu quản trị</div>
              <div className="text-xs text-slate-500">{mode === "ADMIN" ? "Quản trị viên" : "Tác giả"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <div className="text-sm font-semibold text-slate-900">{user?.full_name || user?.email}</div>
              <div className="text-xs text-slate-500">{labelRole(user?.role)}</div>
            </div>
            <button
              onClick={logout}
              className="rounded-xl border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 px-4 py-6">
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded-2xl border bg-white p-3 shadow-sm">
            <Section title="Tổng quan">
              {menu.overview.map((m) => (
                <NavLink key={m.to} to={m.to} className={clsActive} end>
                  {m.label}
                </NavLink>
              ))}
            </Section>

            <Section title="Quản lý">
              {menu.manage.map((m) => (
                <NavLink key={m.to} to={m.to} className={clsActive} end={m.to.endsWith("/dashboard")}>
                  {m.label}
                </NavLink>
              ))}
            </Section>

            <Section title="Tài khoản">
              {menu.account.map((m) => (
                <NavLink key={m.to} to={m.to} className={clsActive} end>
                  {m.label}
                </NavLink>
              ))}
            </Section>
          </div>
        </aside>

        <main className="col-span-12 md:col-span-9">
          <div className="rounded-2xl border bg-white p-4 shadow-sm md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
