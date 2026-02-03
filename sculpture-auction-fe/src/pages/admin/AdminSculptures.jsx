import React, { useEffect, useState } from "react";
import { sculpturesApi } from "../../api/sculptures.api";
import { Badge, Button, Input, Select } from "../../backoffice/ui";
import { fmtDate, toneForStatus } from "../../backoffice/utils";

export default function AdminSculptures() {
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
      const data = await sculpturesApi.list({ q, status, page, limit: 12 });
      setState({ loading: false, error: "", data });
    } catch (e) {
      setState((s) => ({ ...s, loading: false, error: e?.message || "Có lỗi xảy ra" }));
    }
  }

  useEffect(() => {
    load(1);
  }, []); // eslint-disable-line

  async function setRowStatus(id, next) {
    await sculpturesApi.setStatus(id, next);
    await load(state.data.page);
  }

  const { items, total, page, limit } = state.data;
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Tác phẩm</div>
      <div className="mt-1 text-sm text-slate-600">
        Danh sách tác phẩm (lọc theo trạng thái để xem DRAFT/HIDDEN)
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Input
          placeholder="Tìm theo tiêu đề..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">(Mặc định backend) PUBLISHED + SOLD</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="PUBLISHED">Công khai</option>
          <option value="HIDDEN">Ẩn</option>
          <option value="SOLD">Đã bán</option>
        </Select>

        <Button variant="secondary" onClick={() => load(1)}>
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
              <th className="px-3 py-2">Tiêu đề</th>
              <th className="px-3 py-2">Nghệ sĩ</th>
              <th className="px-3 py-2">Danh mục</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Ngày tạo</th>
              <th className="px-3 py-2">Cập nhật trạng thái</th>
            </tr>
          </thead>

          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-3 py-2">{s.id}</td>
                <td className="px-3 py-2 font-semibold">{s.title}</td>
                <td className="px-3 py-2">{s.artist?.full_name || "-"}</td>
                <td className="px-3 py-2">{s.Category?.name || s.category?.name || "-"}</td>
                <td className="px-3 py-2">
                  <Badge tone={toneForStatus(s.status)}>{s.status}</Badge>
                </td>
                <td className="px-3 py-2">{fmtDate(s.createdAt)}</td>
                <td className="px-3 py-2">
                  <Select value={s.status} onChange={(e) => setRowStatus(s.id, e.target.value)}>
                    <option value="DRAFT">Bản nháp</option>
                    <option value="PUBLISHED">Công khai</option>
                    <option value="HIDDEN">Ẩn</option>
                    <option value="SOLD">Đã bán</option>
                  </Select>
                </td>
              </tr>
            ))}

            {!items.length && !state.loading && (
              <tr>
                <td colSpan="7" className="px-3 py-6 text-center text-slate-500">
                  Chưa có tác phẩm
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="text-slate-600">Tổng: {total}</div>
        <div className="flex items-center gap-2">
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
    </div>
  );
}
