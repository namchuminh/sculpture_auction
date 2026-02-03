import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import { sculpturesApi } from "../../api/sculptures.api";
import { Badge, Button, Input, Select } from "../../backoffice/ui";
import { fmtDate, toneForStatus, labelStatus } from "../../backoffice/utils";

export default function ArtistSculptures() {
  const { user } = useAuth();

  // Mặc định lấy tất cả trạng thái
  const [status, setStatus] = useState("ALL");
  const [q, setQ] = useState("");
  const [state, setState] = useState({ loading: true, error: "", items: [] });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const params = { q, page: 1, limit: 100 };
      if (status !== "ALL") params.status = status;

      const data = await sculpturesApi.list(params);

      // Backend chưa có /sculptures/me nên lọc client-side theo artist_id
      const mine = (data.items || []).filter((x) => x.artist_id === user?.id);

      setState({ loading: false, error: "", items: mine });
    } catch (e) {
      setState({
        loading: false,
        error: e?.message || "Tải dữ liệu thất bại",
        items: [],
      });
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  async function setRowStatus(id, next) {
    await sculpturesApi.setStatus(id, next);
    await load();
  }

  const renderStatusText = (st) => {
    try {
      return labelStatus ? labelStatus("sculpture", st) : st;
    } catch {
      return st;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-slate-900">Tác phẩm của tôi</div>
          <div className="mt-1 text-sm text-slate-600">
            Danh sách <code>tác phẩm</code> của tôi.
          </div>
        </div>

        <Link to="/artist/sculptures/new">
          <Button>Thêm tác phẩm</Button>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
        <Input
          placeholder="Tìm theo tên tác phẩm..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="ALL">Tất cả trạng thái</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="PUBLISHED">Đang hiển thị</option>
          <option value="HIDDEN">Đang ẩn</option>
          <option value="SOLD">Đã bán</option>
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
              <th className="px-3 py-2">Tên tác phẩm</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Ngày tạo</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {state.items.map((s) => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="px-3 py-2">#{s.id}</td>

                <td className="px-3 py-2 font-semibold">{s.title}</td>

                <td className="px-3 py-2">
                  <Badge tone={toneForStatus(s.status)}>{renderStatusText(s.status)}</Badge>
                </td>

                <td className="px-3 py-2">{fmtDate(s.createdAt)}</td>

                <td className="px-3 py-2 flex flex-wrap gap-2">
                  <Link to={`/artist/sculptures/${s.id}/edit`}>
                    <Button variant="secondary">Sửa</Button>
                  </Link>

                  <Select value={s.status} onChange={(e) => setRowStatus(s.id, e.target.value)}>
                    <option value="DRAFT">Bản nháp</option>
                    <option value="PUBLISHED">Đang hiển thị</option>
                    <option value="HIDDEN">Đang ẩn</option>
                    <option value="SOLD">Đã bán</option>
                  </Select>
                </td>
              </tr>
            ))}

            {!state.items.length && !state.loading && (
              <tr>
                <td colSpan="5" className="px-3 py-6 text-center text-slate-500">
                  Không có tác phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
