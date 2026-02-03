import React, { useEffect, useState } from "react";
import { usersApi } from "../../api/users.api";
import { categoriesApi } from "../../api/categories.api";
import { auctionsApi } from "../../api/auctions.api";
import { ordersApi } from "../../api/orders.api";
import { paymentsApi } from "../../api/payments.api";
import { sculpturesApi } from "../../api/sculptures.api";
import { Badge } from "../../backoffice/ui";
import { fmtMoney } from "../../backoffice/utils";

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [u, c, aOpen, aSch, aClosed, sPub, sDraft, oAll, pAll] = await Promise.all([
          usersApi.list().then((d) => d.users || []),
          categoriesApi.list(),
          auctionsApi.list({ status: "OPEN", page: 1, limit: 1 }),
          auctionsApi.list({ status: "SCHEDULED", page: 1, limit: 1 }),
          auctionsApi.list({ status: "CLOSED", page: 1, limit: 1 }),
          sculpturesApi.list({ status: "PUBLISHED", page: 1, limit: 1 }),
          sculpturesApi.list({ status: "DRAFT", page: 1, limit: 1 }),
          ordersApi.admin().then((d) => d.orders || []),
          paymentsApi.listAll().then((d) => d.payments || []),
        ]);

        const revenue = (pAll || [])
          .filter((x) => x.status === "SUCCESS")
          .reduce((acc, x) => acc + Number(x.amount || 0), 0);

        const data = {
          users: u.length,
          categories: c.length,
          auctionsOpen: aOpen.total,
          auctionsScheduled: aSch.total,
          auctionsClosed: aClosed.total,
          sculpturesPublished: sPub.total,
          sculpturesDraft: sDraft.total,
          orders: oAll.length,
          payments: pAll.length,
          revenue,
        };

        if (alive) setState({ loading: false, error: "", data });
      } catch (e) {
        if (alive) setState({ loading: false, error: e?.message || "Có lỗi xảy ra", data: null });
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  if (state.loading) return <div className="text-sm text-slate-600">Đang tải...</div>;
  if (state.error) return <div className="text-sm text-rose-600">{state.error}</div>;

  const d = state.data;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-slate-900">Bảng điều khiển Admin</div>
          <div className="mt-1 text-sm text-slate-600">Tổng quan nhanh hệ thống</div>
        </div>
        <Badge tone="slate">Backend-driven</Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Người dùng" value={d.users} />
        <Stat label="Chuyên mục" value={d.categories} />
        <Stat label="Đơn hàng" value={d.orders} />
        <Stat label="Thanh toán" value={d.payments} />
        <Stat label="Phiên đấu giá ĐANG MỞ (OPEN)" value={d.auctionsOpen} />
        <Stat label="Phiên đấu giá ĐÃ LÊN LỊCH (SCHEDULED)" value={d.auctionsScheduled} />
        <Stat label="Phiên đấu giá ĐÃ ĐÓNG (CLOSED)" value={d.auctionsClosed} />
        <Stat label="Tác phẩm ĐÃ ĐĂNG (PUBLISHED)" value={d.sculpturesPublished} />
        <Stat label="Tác phẩm BẢN NHÁP (DRAFT)" value={d.sculpturesDraft} />
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Doanh thu (thanh toán SUCCESS)
        </div>
        <div className="mt-2 text-2xl font-bold text-slate-900">{fmtMoney(d.revenue)}</div>
      </div>
    </div>
  );
}
