import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auctionsApi } from "../../api/auctions.api";
import { sculpturesApi } from "../../api/sculptures.api";
import { useAuth } from "../../auth/AuthProvider";
import { Button, Input, Select } from "../../backoffice/ui";

export default function ArtistAuctionNew() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [sp] = useSearchParams();
  const preSculptureId = sp.get("sculpture_id") || "";

  const [state, setState] = useState({ loading: true, error: "" });
  const [sculptures, setSculptures] = useState([]);
  const [form, setForm] = useState({
    sculpture_id: preSculptureId,
    start_price: "",
    bid_step: "",
    buy_now_price: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        // lấy published + draft để nghệ sĩ chọn, rồi lọc theo artist_id
        const [pub, draft] = await Promise.all([
          sculpturesApi.list({ status: "PUBLISHED", page: 1, limit: 100 }),
          sculpturesApi.list({ status: "DRAFT", page: 1, limit: 100 }),
        ]);
        const all = [...(pub.items || []), ...(draft.items || [])].filter((x) => x.artist_id === user?.id);

        if (alive) {
          setSculptures(all);
          setState({ loading: false, error: "" });
        }
      } catch (e) {
        if (alive) setState({ loading: false, error: e?.message || "Có lỗi xảy ra" });
      }
    })();
    return () => {
      alive = false;
    };
  }, [user?.id]);

  async function submit(e) {
    e.preventDefault();
    try {
      await auctionsApi.create({
        sculpture_id: Number(form.sculpture_id),
        start_price: Number(form.start_price),
        bid_step: Number(form.bid_step),
        buy_now_price: form.buy_now_price ? Number(form.buy_now_price) : null,
        start_time: form.start_time,
        end_time: form.end_time,
      });
      nav("/artist/auctions");
    } catch (e2) {
      setState((s) => ({ ...s, error: e2?.message || "Tạo phiên thất bại" }));
    }
  }

  if (state.loading) return <div className="text-sm text-slate-600">Đang tải...</div>;

  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Tạo phiên đấu giá mới</div>
      <div className="mt-1 text-sm text-slate-600">Tạo phiên đấu giá</div>

      {state.error && (
        <div className="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{state.error}</div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <div className="text-sm font-semibold text-slate-700">Tác phẩm *</div>
          <Select value={form.sculpture_id} onChange={(e) => setForm({ ...form, sculpture_id: e.target.value })}>
            <option value="">Chọn...</option>
            {sculptures.map((s) => (
              <option key={s.id} value={s.id}>
                #{s.id} - {s.title}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-slate-700">Giá khởi điểm *</div>
            <Input value={form.start_price} onChange={(e) => setForm({ ...form, start_price: e.target.value })} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700">Bước giá *</div>
            <Input value={form.bid_step} onChange={(e) => setForm({ ...form, bid_step: e.target.value })} />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700">Mua ngay</div>
            <Input
              value={form.buy_now_price}
              onChange={(e) => setForm({ ...form, buy_now_price: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <div className="text-sm font-semibold text-slate-700">Thời gian bắt đầu *</div>
            <Input
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-700">Thời gian kết thúc *</div>
            <Input
              type="datetime-local"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={() => nav("/artist/auctions")}>
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={!form.sculpture_id || !form.start_price || !form.bid_step || !form.start_time || !form.end_time}
          >
            Tạo
          </Button>
        </div>
      </form>
    </div>
  );
}
