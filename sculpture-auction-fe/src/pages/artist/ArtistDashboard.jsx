import React, { useEffect, useState } from "react";
import { auctionsApi } from "../../api/auctions.api";
import { ordersApi } from "../../api/orders.api";
import { sculpturesApi } from "../../api/sculptures.api";
import { useAuth } from "../../auth/AuthProvider";
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

export default function ArtistDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ loading: true, error: "", data: null });

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const [au, or, sPub, sDraft] = await Promise.all([
          auctionsApi.myList().then((d) => d.auctions || []),
          ordersApi.artist().then((d) => d.orders || []),
          sculpturesApi.list({ status: "PUBLISHED", page: 1, limit: 100 }).then((d) => d.items || []),
          sculpturesApi.list({ status: "DRAFT", page: 1, limit: 100 }).then((d) => d.items || []),
        ]);

        // Backend chưa có /sculptures/me => lọc client-side theo artist_id
        const myPub = sPub.filter((x) => x.artist_id === user?.id);
        const myDraft = sDraft.filter((x) => x.artist_id === user?.id);

        const revenue = or
          .filter((o) => ["PAID", "SHIPPING", "COMPLETED"].includes(o.status))
          .reduce((acc, o) => acc + Number(o.amount || 0), 0);

        const data = {
          auctions: au.length,
          auctionsOpen: au.filter((x) => x.status === "OPEN").length,
          auctionsScheduled: au.filter((x) => x.status === "SCHEDULED").length,
          orders: or.length,
          ordersPending: or.filter((x) => x.status === "PENDING").length,
          sculpturesPublished: myPub.length,
          sculpturesDraft: myDraft.length,
          revenue,
        };

        if (alive) setState({ loading: false, error: "", data });
      } catch (e) {
        if (alive) setState({ loading: false, error: e?.message || "Tải dữ liệu thất bại", data: null });
      }
    })();

    return () => {
      alive = false;
    };
  }, [user?.id]);

  if (state.loading) return <div className="text-sm text-slate-600">Đang tải...</div>;
  if (state.error) return <div className="text-sm text-rose-600">{state.error}</div>;

  const d = state.data;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-slate-900">Bảng điều khiển nghệ sĩ</div>
          <div className="mt-1 text-sm text-slate-600">Tổng quan theo tài khoản</div>
        </div>
        <Badge tone="slate">{user?.full_name || user?.email}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Tác phẩm (Đang hiển thị)" value={d.sculpturesPublished} />
        <Stat label="Tác phẩm (Bản nháp)" value={d.sculpturesDraft} />
        <Stat label="Phiên đấu giá" value={d.auctions} />
        <Stat label="Phiên đang mở" value={d.auctionsOpen} />
        <Stat label="Phiên đã lên lịch" value={d.auctionsScheduled} />
        <Stat label="Đơn hàng" value={d.orders} />
        <Stat label="Đơn chờ xử lý" value={d.ordersPending} />
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Doanh thu (ĐÃ THANH TOÁN/ĐANG GIAO/HOÀN TẤT)
        </div>
        <div className="mt-2 text-2xl font-bold text-slate-900">{fmtMoney(d.revenue)}</div>
        <div className="mt-2 text-xs text-slate-500">
          Backend hiện tại chưa có payouts; chỉ cộng <code>order.amount</code> theo trạng thái.
        </div>
      </div>
    </div>
  );
}
