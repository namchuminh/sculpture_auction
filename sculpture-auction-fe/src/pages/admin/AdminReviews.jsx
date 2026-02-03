import React, { useEffect, useState } from "react";
import { reviewsApi } from "../../api/reviews.api";
import { Badge, Button, Input, Select } from "../../backoffice/ui";
import { fmtDate, toneForStatus } from "../../backoffice/utils";

export default function AdminReviews() {
  const [filters, setFilters] = useState({ sculpture_id: "", user_id: "", rating: "" });
  const [state, setState] = useState({ loading: true, error: "", items: [] });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await reviewsApi.list(filters);
      setState({ loading: false, error: "", items: data.reviews || [] });
    } catch (e) {
      setState({ loading: false, error: e?.message || "Có lỗi xảy ra", items: [] });
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Đánh giá</div>
      <div className="mt-1 text-sm text-slate-600">Admin xem/lọc đánh giá</div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Input
          placeholder="Mã tác phẩm (sculpture_id)"
          value={filters.sculpture_id}
          onChange={(e) => setFilters({ ...filters, sculpture_id: e.target.value })}
        />
        <Input
          placeholder="Mã người dùng (user_id)"
          value={filters.user_id}
          onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
        />
        <Select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })}>
          <option value="">Tất cả số sao</option>
          <option value="1">1 sao</option>
          <option value="2">2 sao</option>
          <option value="3">3 sao</option>
          <option value="4">4 sao</option>
          <option value="5">5 sao</option>
        </Select>
        <Button variant="secondary" onClick={load}>
          Áp dụng
        </Button>
      </div>

      {state.loading && <div className="mt-4 text-sm text-slate-600">Đang tải...</div>}
      {state.error && <div className="mt-4 text-sm text-rose-600">{state.error}</div>}

      <div className="mt-6 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Tác phẩm</th>
              <th className="px-3 py-2">Người dùng</th>
              <th className="px-3 py-2">Số sao</th>
              <th className="px-3 py-2">Bình luận</th>
              <th className="px-3 py-2">Thời gian</th>
            </tr>
          </thead>

          <tbody>
            {state.items.map((r) => (
              <tr key={r.id} className="border-b last:border-0">
                <td className="px-3 py-2">#{r.id}</td>
                <td className="px-3 py-2">{r.sculpture?.title || r.sculpture_id}</td>
                <td className="px-3 py-2">{r.user?.full_name || r.user_id}</td>
                <td className="px-3 py-2">
                  <Badge
                    tone={toneForStatus(r.rating >= 4 ? "SUCCESS" : r.rating === 3 ? "PENDING" : "FAILED")}
                  >
                    {r.rating}
                  </Badge>
                </td>
                <td className="px-3 py-2 max-w-[420px] truncate">{r.comment || "-"}</td>
                <td className="px-3 py-2">{fmtDate(r.createdAt)}</td>
              </tr>
            ))}

            {!state.items.length && !state.loading && (
              <tr>
                <td colSpan="6" className="px-3 py-6 text-center text-slate-500">
                  Chưa có đánh giá
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
