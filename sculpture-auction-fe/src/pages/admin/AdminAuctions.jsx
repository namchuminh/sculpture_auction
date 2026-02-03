import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auctionsApi } from "../../api/auctions.api";
import { Badge, Button, Input, Select } from "../../backoffice/ui";
import { fmtDate, fmtMoney, toneForStatus } from "../../backoffice/utils";

export default function AdminAuctions() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: { items: [], total: 0, page: 1, limit: 12 },
  });

  async function load(page = 1) {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await auctionsApi.list({ q, status, page, limit: 12 });
      setState({ loading: false, error: "", data });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e?.message || "Có lỗi xảy ra" }));
    }
  }

  useEffect(() => {
    load(1);
  }, []); // eslint-disable-line

  const { items, total, page, limit } = state.data;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Phiên đấu giá</div>
      <div className="mt-1 text-sm text-slate-600">Danh sách phiên đấu giá</div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Input
          placeholder="Tìm theo tên tác phẩm..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="SCHEDULED">Đã lên lịch</option>
          <option value="OPEN">Đang diễn ra</option>
          <option value="CLOSED">Đã kết thúc</option>
          <option value="CANCELLED">Đã hủy</option>
        </Select>

        <Button variant="secondary" onClick={() => load(1)}>
          Áp dụng
        </Button>

        <div className="flex items-center justify-end text-sm text-slate-600">Tổng: {total}</div>
      </div>

      {state.loading && <div className="mt-4 text-sm text-slate-600">Đang tải...</div>}
      {state.error && <div className="mt-4 text-sm text-rose-600">{state.error}</div>}

      <div className="mt-6 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Tác phẩm</th>
              <th className="px-3 py-2">Người bán</th>
              <th className="px-3 py-2">Giá hiện tại</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Bắt đầu</th>
              <th className="px-3 py-2">Kết thúc</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="px-3 py-2 font-semibold text-slate-900">#{a.id}</td>
                <td className="px-3 py-2">{a.sculpture?.title || "-"}</td>
                <td className="px-3 py-2">{a.seller?.full_name || "-"}</td>
                <td className="px-3 py-2">{fmtMoney(a.current_price)}</td>
                <td className="px-3 py-2">
                  <Badge tone={toneForStatus(a.status)}>{a.status}</Badge>
                </td>
                <td className="px-3 py-2">{fmtDate(a.start_time)}</td>
                <td className="px-3 py-2">{fmtDate(a.end_time)}</td>
                <td className="px-3 py-2">
                  <Link to={`/admin/auctions/${a.id}`}>
                    <Button variant="secondary">Xem chi tiết</Button>
                  </Link>
                </td>
              </tr>
            ))}

            {!items.length && !state.loading && (
              <tr>
                <td colSpan="8" className="px-3 py-6 text-center text-slate-500">
                  Không có phiên đấu giá
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <Button
          variant="secondary"
          onClick={() => load(Math.max(1, page - 1))}
          disabled={page <= 1}
        >
          Trang trước
        </Button>

        <span className="text-slate-700">
          {page} / {pages}
        </span>

        <Button
          variant="secondary"
          onClick={() => load(Math.min(pages, page + 1))}
          disabled={page >= pages}
        >
          Trang sau
        </Button>
      </div>
    </div>
  );
}
