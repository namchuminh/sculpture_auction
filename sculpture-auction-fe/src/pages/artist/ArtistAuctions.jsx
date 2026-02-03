import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auctionsApi } from "../../api/auctions.api";
import { Badge, Button } from "../../backoffice/ui";
import { fmtDate, fmtMoney, toneForStatus } from "../../backoffice/utils";

export default function ArtistAuctions() {
  const [state, setState] = useState({ loading: true, error: "", items: [] });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await auctionsApi.myList();
      setState({ loading: false, error: "", items: data.auctions || [] });
    } catch (e) {
      setState({ loading: false, error: e?.message || "Tải dữ liệu thất bại", items: [] });
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-slate-900">Phiên đấu giá của tôi</div>
          <div className="mt-1 text-sm text-slate-600">Danh sách phiên đấu giá của bạn</div>
        </div>
        <Link to="/artist/auctions/new">
          <Button>Tạo phiên</Button>
        </Link>
      </div>

      {state.loading && <div className="mt-4 text-sm text-slate-600">Đang tải...</div>}
      {state.error && <div className="mt-4 text-sm text-rose-600">{state.error}</div>}

      <div className="mt-6 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Tác phẩm</th>
              <th className="px-3 py-2">Giá hiện tại</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Bắt đầu</th>
              <th className="px-3 py-2">Kết thúc</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {state.items.map((a) => (
              <tr key={a.id} className="border-b last:border-0">
                <td className="px-3 py-2 font-semibold text-slate-900">#{a.id}</td>
                <td className="px-3 py-2">{a.sculpture?.title || a.sculpture_id}</td>
                <td className="px-3 py-2 font-semibold">{fmtMoney(a.current_price)}</td>
                <td className="px-3 py-2">
                  <Badge tone={toneForStatus(a.status)}>{a.status}</Badge>
                </td>
                <td className="px-3 py-2">{fmtDate(a.start_time)}</td>
                <td className="px-3 py-2">{fmtDate(a.end_time)}</td>
                <td className="px-3 py-2">
                  <Link to={`/artist/auctions/${a.id}`}>
                    <Button variant="secondary">Xem chi tiết</Button>
                  </Link>
                </td>
              </tr>
            ))}

            {!state.items.length && !state.loading && (
              <tr>
                <td colSpan="7" className="px-3 py-6 text-center text-slate-500">
                  Chưa có phiên đấu giá nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
