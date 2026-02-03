import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { auctionsApi } from "../../api/auctions.api";
import { Badge, Button, Input } from "../../backoffice/ui";
import { fmtDate, fmtMoney, toneForStatus } from "../../backoffice/utils";

export default function AdminAuctionDetail() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, error: "", auction: null, bids: [] });
  const [edit, setEdit] = useState({
    start_price: "",
    bid_step: "",
    buy_now_price: "",
    start_time: "",
    end_time: "",
  });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await auctionsApi.detail(id);
      const a = data.auction;

      setEdit({
        start_price: a.start_price ?? "",
        bid_step: a.bid_step ?? "",
        buy_now_price: a.buy_now_price ?? "",
        start_time: a.start_time ? new Date(a.start_time).toISOString().slice(0, 16) : "",
        end_time: a.end_time ? new Date(a.end_time).toISOString().slice(0, 16) : "",
      });

      setState({ loading: false, error: "", auction: a, bids: data.bids || [] });
    } catch (e) {
      setState({ loading: false, error: e?.message || "Có lỗi xảy ra", auction: null, bids: [] });
    }
  }

  useEffect(() => {
    load();
  }, [id]); // eslint-disable-line

  async function closeAuction() {
    await auctionsApi.close(id);
    await load();
  }

  async function cancelAuction() {
    await auctionsApi.cancel(id);
    await load();
  }

  async function saveScheduled() {
    await auctionsApi.updateScheduled(id, {
      start_price: edit.start_price,
      bid_step: edit.bid_step,
      buy_now_price: edit.buy_now_price || null,
      start_time: edit.start_time,
      end_time: edit.end_time,
    });
    await load();
  }

  if (state.loading) return <div className="text-sm text-slate-600">Đang tải...</div>;
  if (state.error) return <div className="text-sm text-rose-600">{state.error}</div>;
  if (!state.auction) return <div className="text-sm text-slate-600">Không tìm thấy</div>;

  const a = state.auction;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold text-slate-900">Phiên đấu giá #{a.id}</div>
          <div className="mt-1 text-sm text-slate-600">
            Tác phẩm:{" "}
            <Link className="font-semibold hover:underline" to={`/sculptures/${a.sculpture_id}`}>
              {a.sculpture?.title || a.sculpture_id}
            </Link>
          </div>
        </div>
        <Badge tone={toneForStatus(a.status)}>{a.status}</Badge>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Thông tin</div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div>
              Người bán: <span className="font-semibold">{a.seller?.full_name || "-"}</span>
            </div>
            <div>
              Người thắng: <span className="font-semibold">{a.winner?.full_name || "-"}</span>
            </div>
            <div>
              Giá khởi điểm: <span className="font-semibold">{fmtMoney(a.start_price)}</span>
            </div>
            <div>
              Giá hiện tại: <span className="font-semibold">{fmtMoney(a.current_price)}</span>
            </div>
            <div>
              Bước giá: <span className="font-semibold">{fmtMoney(a.bid_step)}</span>
            </div>
            <div>
              Mua ngay:{" "}
              <span className="font-semibold">{a.buy_now_price ? fmtMoney(a.buy_now_price) : "-"}</span>
            </div>
            <div>
              Thời gian bắt đầu: <span className="font-semibold">{fmtDate(a.start_time)}</span>
            </div>
            <div>
              Thời gian kết thúc: <span className="font-semibold">{fmtDate(a.end_time)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={closeAuction} disabled={a.status !== "OPEN"}>
              Đóng phiên (OPEN)
            </Button>
            <Button variant="danger" onClick={cancelAuction} disabled={a.status === "CANCELLED"}>
              Hủy phiên
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border bg-white p-4">
          <div className="text-sm font-semibold text-slate-900">Chỉnh sửa (chỉ khi SCHEDULED)</div>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-600">Giá khởi điểm</div>
                <Input
                  value={edit.start_price}
                  onChange={(e) => setEdit({ ...edit, start_price: e.target.value })}
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600">Bước giá</div>
                <Input value={edit.bid_step} onChange={(e) => setEdit({ ...edit, bid_step: e.target.value })} />
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-600">Giá mua ngay</div>
              <Input
                value={edit.buy_now_price}
                onChange={(e) => setEdit({ ...edit, buy_now_price: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-600">Thời gian bắt đầu</div>
                <Input
                  type="datetime-local"
                  value={edit.start_time}
                  onChange={(e) => setEdit({ ...edit, start_time: e.target.value })}
                />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600">Thời gian kết thúc</div>
                <Input
                  type="datetime-local"
                  value={edit.end_time}
                  onChange={(e) => setEdit({ ...edit, end_time: e.target.value })}
                />
              </div>
            </div>

            <Button variant="secondary" onClick={saveScheduled} disabled={a.status !== "SCHEDULED"}>
              Lưu
            </Button>
            {a.status !== "SCHEDULED" && (
              <div className="text-xs text-slate-500">Backend chỉ cho sửa khi trạng thái là SCHEDULED.</div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="text-sm font-semibold text-slate-900">Top lượt trả giá (≤50)</div>
        <div className="mt-3 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Người trả giá</th>
                <th className="px-3 py-2">Số tiền</th>
                <th className="px-3 py-2">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {state.bids.map((b) => (
                <tr key={b.id} className="border-b last:border-0">
                  <td className="px-3 py-2">{b.bidder?.full_name || b.bidder_id}</td>
                  <td className="px-3 py-2 font-semibold">{fmtMoney(b.amount)}</td>
                  <td className="px-3 py-2">{fmtDate(b.createdAt)}</td>
                </tr>
              ))}
              {!state.bids.length && (
                <tr>
                  <td colSpan="3" className="px-3 py-6 text-center text-slate-500">
                    Chưa có lượt trả giá
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
