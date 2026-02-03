import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { ordersApi } from "../../api/orders.api";

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
function fmtTime(t) {
    try {
        return new Date(t).toLocaleString("vi-VN");
    } catch {
        return "—";
    }
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

function statusTone(s) {
    if (s === "PAID") return "dark";
    if (s === "PENDING") return "ring";
    if (s === "SHIPPING") return "soft";
    if (s === "COMPLETED") return "dark";
    if (s === "CANCELLED") return "soft";
    return "ring";
}

export default function Orders() {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [orders, setOrders] = useState([]);

    const [q, setQ] = useState("");
    const [filter, setFilter] = useState("ALL"); // ALL | PENDING | PAID | SHIPPING | COMPLETED | CANCELLED
    const [sort, setSort] = useState("NEW"); // NEW | AMOUNT

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoading(true);
            setErr("");
            try {
                const res = await ordersApi.my();
                const list = res?.orders || [];
                if (!alive) return;
                setOrders(list);
            } catch (e) {
                if (!alive) return;
                setErr(e?.message || "Không tải được đơn hàng");
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
        let out = orders;

        if (filter !== "ALL") out = out.filter((o) => o?.status === filter);

        if (norm) {
            out = out.filter((o) => {
                const s = o?.sculpture || {};
                const t = String(s?.title || "").toLowerCase();
                return t.includes(norm) || String(o?.id || "").includes(norm);
            });
        }

        if (sort === "AMOUNT") {
            out = [...out].sort((a, b) => Number(b?.total_amount || 0) - Number(a?.total_amount || 0));
        } else {
            out = [...out].sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
        }

        return out;
    }, [orders, q, filter, sort]);

    return (
        <div className="bg-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="text-2xl font-semibold tracking-tight text-slate-900">Đơn hàng</div>
                        <div className="mt-1 text-sm text-slate-600">Danh sách đơn hàng bạn đã thắng đấu giá.</div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="rounded-2xl bg-white ring-1 ring-slate-200 px-3 py-2">
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                className="w-[240px] bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                                placeholder="Tìm theo mã đơn / tên tác phẩm…"
                            />
                        </div>

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="rounded-2xl bg-white ring-1 ring-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none"
                        >
                            <option value="ALL">Tất cả trạng thái</option>
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="SHIPPING">SHIPPING</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                        </select>

                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="rounded-2xl bg-white ring-1 ring-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none"
                        >
                            <option value="NEW">Mới nhất</option>
                            <option value="AMOUNT">Giá trị cao</option>
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
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="mt-2 h-3 w-4/5" />
                                        <Skeleton className="mt-4 h-10 w-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : view.length === 0 ? (
                        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-600">
                            Chưa có đơn hàng.
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
                            {view.map((o) => {
                                const s = o?.sculpture || {};
                                const img = toAbsUrl(s?.image_url);
                                return (
                                    <Link
                                        key={o.id}
                                        to={PATHS.ORDER_DETAIL.replace(":id", o.id)}
                                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        <div className="relative h-44 w-full bg-slate-100">
                                            {img ? (
                                                <img src={img} alt={s?.title || ""} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                                            )}
                                            <div className="absolute left-3 top-3 flex gap-2">
                                                <Badge tone={statusTone(o?.status)}>{o?.status || "—"}</Badge>
                                                <Badge tone="ring">#{o?.id}</Badge>
                                            </div>
                                        </div>

                                        <div className="p-4">
                                            <div className="truncate text-sm font-semibold text-slate-900">
                                                {s?.title || "Tác phẩm"}
                                            </div>
                                            <div className="mt-1 text-sm text-slate-600 line-clamp-2">
                                                {s?.description || "—"}
                                            </div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[11px] text-slate-500">Tổng tiền</div>
                                                    <div className="mt-0.5 text-sm font-semibold text-slate-900">
                                                        {money(o?.total_amount)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-slate-500">{fmtTime(o?.createdAt)}</div>
                                            </div>

                                            <div className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white group-hover:bg-slate-800">
                                                Xem chi tiết
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
