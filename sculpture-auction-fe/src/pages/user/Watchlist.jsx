// src/pages/user/Watchlist.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { http } from "../../api/http";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:3001";

function cx(...xs) {
    return xs.filter(Boolean).join(" ");
}

function toAbsUrl(u) {
    if (!u) return null;
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return `${API_BASE}${u}`;
}

function money(v) {
    const n = Number(v || 0);
    return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
}

function ms(t) {
    const x = t ? new Date(t).getTime() : 0;
    return Number.isFinite(x) ? x : 0;
}

function getEndMs(a) {
    return ms(a?.end_time || a?.endTime);
}

function useNow(stepMs = 1000) {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), stepMs);
        return () => clearInterval(id);
    }, [stepMs]);
    return now;
}

function timeLeft(endMs, now) {
    if (!endMs) return { label: "—", urgent: false };
    const diff = endMs - now;
    if (diff <= 0) return { label: "Đã kết thúc", urgent: true };

    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);

    const urgent = diff <= 30 * 60 * 1000;
    if (d > 0) return { label: `Còn ${d} ngày`, urgent };
    if (h > 0) return { label: `Còn ${h} giờ`, urgent };
    return { label: `Còn ${m} phút`, urgent: true };
}

function Badge({ children, tone = "ring" }) {
    const cls =
        tone === "dark"
            ? "bg-slate-900 text-white"
            : tone === "soft"
                ? "bg-slate-100 text-slate-700"
                : "bg-white/80 text-slate-800 ring-1 ring-slate-200";
    return (
        <span className={cx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", cls)}>
            {children}
        </span>
    );
}

function Skeleton({ className }) {
    return <div className={cx("animate-pulse rounded-2xl bg-slate-100", className)} />;
}

function Img({ src, alt }) {
    if (!src) {
        return <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />;
    }
    return <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />;
}

/* ===== API (không cần tạo file mới nếu chưa muốn) ===== */
async function fetchWatchlist() {
    // GET /watchlist -> { items }
    const data = await http("/watchlist");
    return data?.items || [];
}

async function removeWatchlist(auctionId) {
    // DELETE /watchlist/:auctionId
    return http(`/watchlist/${auctionId}`, { method: "DELETE" });
}

/* ===== Card ===== */
function WatchCard({ item, now, onRemove, removing }) {
    const a = item?.auction || {};
    const s = a?.sculpture || {};
    const title = s?.title || `Phiên #${a?.id}`;
    const img = toAbsUrl(s?.image_url);

    const endMs = getEndMs(a);
    const tl = timeLeft(endMs, now);

    const status = a?.status || "—";

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="relative h-44 w-full bg-slate-100">
                <Img src={img} alt={title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
                <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
                    <Badge tone="ring">{status}</Badge>
                    {endMs ? <Badge tone={tl.urgent ? "dark" : "ring"}>{tl.label}</Badge> : null}
                </div>
            </div>

            <div className="p-4">
                <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-600 line-clamp-2">
                        {s?.description ? s.description : "—"}
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">Giá hiện tại</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">{money(a?.current_price)}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                        <div className="text-[11px] text-slate-500">Bước giá</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">{money(a?.bid_step)}</div>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    <Link
                        to={PATHS.AUCTION_DETAIL.replace(":id", a?.id)}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        Vào phiên
                    </Link>
                    <button
                        onClick={() => onRemove(a?.id)}
                        disabled={removing}
                        className={cx(
                            "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium ring-1 ring-slate-200",
                            removing ? "bg-slate-100 text-slate-400" : "bg-white text-slate-800 hover:bg-slate-50"
                        )}
                        title="Bỏ theo dõi"
                    >
                        Bỏ
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ===== Page ===== */
export default function Watchlist() {
    const now = useNow(1000);

    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [removingId, setRemovingId] = useState(null);

    const [q, setQ] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL | OPEN | SCHEDULED | CLOSED | CANCELLED
    const [sort, setSort] = useState("NEW"); // NEW | END | PRICE

    useEffect(() => {
        let alive = true;

        (async () => {
            setLoading(true);
            setErr("");
            try {
                const list = await fetchWatchlist();
                if (!alive) return;
                setItems(list);
            } catch (e) {
                if (!alive) return;
                setErr(e?.message || "Không tải được danh sách theo dõi");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    const view = useMemo(() => {
        const norm = q.trim().toLowerCase();

        let out = items;

        if (filter !== "ALL") {
            out = out.filter((x) => (x?.auction?.status || "") === filter);
        }

        if (norm) {
            out = out.filter((x) => {
                const a = x?.auction || {};
                const s = a?.sculpture || {};
                const t = String(s?.title || "").toLowerCase();
                return t.includes(norm);
            });
        }

        if (sort === "END") {
            out = [...out].sort((x, y) => getEndMs(x?.auction) - getEndMs(y?.auction));
        } else if (sort === "PRICE") {
            out = [...out].sort(
                (x, y) => Number(y?.auction?.current_price || 0) - Number(x?.auction?.current_price || 0)
            );
        } else {
            // NEW: theo watchlist.createdAt
            out = [...out].sort((x, y) => ms(y?.createdAt) - ms(x?.createdAt));
        }

        return out;
    }, [items, q, filter, sort]);

    async function onRemove(auctionId) {
        if (!auctionId) return;
        setRemovingId(auctionId);
        try {
            await removeWatchlist(auctionId);
            setItems((prev) => prev.filter((x) => x?.auction_id !== auctionId && x?.auction?.id !== auctionId));
        } catch (e) {
            setErr(e?.message || "Xóa thất bại");
        } finally {
            setRemovingId(null);
        }
    }

    return (
        <div className="bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-2xl font-semibold tracking-tight text-slate-900">Đang theo dõi</div>
                        <div className="mt-1 text-sm text-slate-600">
                            Lưu các phiên quan tâm, theo dõi giá và thời gian kết thúc.
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="rounded-2xl bg-white ring-1 ring-slate-200 px-3 py-2">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-[240px] bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                placeholder="Tìm theo tên tác phẩm…"
                            />
                        </div>

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="rounded-2xl bg-white ring-1 ring-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="OPEN">OPEN</option>
                            <option value="SCHEDULED">SCHEDULED</option>
                            <option value="CLOSED">CLOSED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-2xl bg-white ring-1 ring-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none"
                        >
                            <option value="NEW">Mới thêm</option>
                            <option value="END">Sắp kết thúc</option>
                            <option value="PRICE">Giá cao</option>
                        </select>
                    </div>
                </div>

                {err ? (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {err}
                    </div>
                ) : null}

                <div className="mt-6">
                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    <Skeleton className="h-44 w-full rounded-none" />
                                    <div className="p-4">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="mt-2 h-3 w-2/3" />
                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <Skeleton className="h-14 w-full" />
                                            <Skeleton className="h-14 w-full" />
                                        </div>
                                        <Skeleton className="mt-4 h-10 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : view.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-600">
                            Chưa có phiên nào trong danh sách theo dõi.
                            <div className="mt-3">
                                <Link
                                    to={PATHS.AUCTIONS}
                                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Đi tới trang Đấu giá
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {view.map((item) => (
                                <WatchCard
                                    key={item.id}
                                    item={item}
                                    now={now}
                                    onRemove={onRemove}
                                    removing={removingId === (item?.auction?.id || item?.auction_id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
