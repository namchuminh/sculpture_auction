// src/pages/public/AuctionDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { http } from "../../api/http";
import { authService } from "../../auth/auth.service";

// ================= helpers =================
function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function fmtMoney(v) {
    if (v === null || v === undefined || v === "") return "—";
    const n = Number(v);
    if (Number.isNaN(n)) return String(v);
    return n.toLocaleString("vi-VN");
}

function fmtDate(iso) {
    if (!iso) return "—";
    try {
        return new Date(iso).toLocaleString("vi-VN");
    } catch {
        return iso;
    }
}

function msLeft(endIso) {
    if (!endIso) return 0;
    const t = new Date(endIso).getTime();
    const now = Date.now();
    return Math.max(0, t - now);
}

function fmtDuration(ms) {
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (d > 0) return `${d} ngày ${h} giờ ${m} phút`;
    if (h > 0) return `${h} giờ ${m} phút`;
    if (m > 0) return `${m} phút ${ss} giây`;
    return `${ss} giây`;
}

// thêm vào AuctionDetail.jsx (cùng file), dưới các helper
function viWatchStatus(code) {
    switch (code) {
        case "FOLLOWING":
            return "Đang theo dõi";
        case "ADDED":
            return "Đã theo dõi";
        case "REMOVED":
            return "Đã bỏ theo dõi";
        default:
            return code || "";
    }
}

function viAuctionStatus(code) {
    switch (code) {
        case "SCHEDULED":
            return "Sắp diễn ra";
        case "OPEN":
            return "Đang diễn ra";
        case "CLOSED":
            return "Đã kết thúc";
        case "CANCELLED":
            return "Đã huỷ";
        default:
            return code || "—";
    }
}

function viBidStatus(code) {
    switch (code) {
        case "VALID":
            return "Hợp lệ";
        case "OUTBID":
            return "Bị vượt giá";
        case "CANCELLED":
            return "Đã huỷ";
        case "INVALID":
            return "Không hợp lệ";
        default:
            return code || "—";
    }
}


function statusBadgeClass(code) {
    switch (code) {
        case "OPEN":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "SCHEDULED":
            return "bg-amber-50 text-amber-800 border-amber-200";
        case "CLOSED":
            return "bg-slate-100 text-slate-700 border-slate-200";
        case "CANCELLED":
            return "bg-red-50 text-red-700 border-red-200";
        default:
            return "bg-slate-50 text-slate-700 border-slate-200";
    }
}

function Icon({ name, className = "h-4 w-4" }) {
    const base = {
        className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    switch (name) {
        case "chevLeft":
            return (
                <svg {...base}>
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            );
        case "gavel":
            return (
                <svg {...base}>
                    <path d="M14 4l6 6" />
                    <path d="M13 5l-2 2 6 6 2-2-6-6Z" />
                    <path d="M3 21l7-7" />
                    <path d="M9 7l4 4" />
                    <path d="M2 20l2 2" />
                </svg>
            );
        case "clock":
            return (
                <svg {...base}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            );
        case "money":
            return (
                <svg {...base}>
                    <path d="M12 1v22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            );
        case "user":
            return (
                <svg {...base}>
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            );
        case "tag":
            return (
                <svg {...base}>
                    <path d="M20.6 13.4L11 3H4v7l9.6 9.6a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8Z" />
                    <path d="M7.5 7.5h.01" />
                </svg>
            );
        case "spark":
            return (
                <svg {...base}>
                    <path d="M5 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" />
                    <path d="M19 9l1.5 3.5L24 14l-3.5 1.5L19 19l-1.5-3.5L14 14l3.5-1.5L19 9Z" />
                </svg>
            );
        case "refresh":
            return (
                <svg {...base}>
                    <path d="M21 12a9 9 0 1 1-3-6.7" />
                    <path d="M21 3v7h-7" />
                </svg>
            );
        case "arrowUp":
            return (
                <svg {...base}>
                    <path d="M12 19V5" />
                    <path d="M5 12l7-7 7 7" />
                </svg>
            );
        case "follow":
            return (
                <svg {...base}>
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" />
                </svg>
            );
        default:
            return null;
    }
}

// ================= component =================
export default function AuctionDetail() {
    const [watching, setWatching] = useState(false);
    const [watchLoading, setWatchLoading] = useState(false);
    const [watchErr, setWatchErr] = useState("");
    const [watchMsg, setWatchMsg] = useState("");
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);

    const [loadingBids, setLoadingBids] = useState(true);
    const [errBids, setErrBids] = useState("");

    const [amount, setAmount] = useState("");
    const [placing, setPlacing] = useState(false);
    const [placeErr, setPlaceErr] = useState("");
    const [placeOk, setPlaceOk] = useState("");

    const authed = authService?.isAuthed?.() ? true : false;

    async function loadDetail() {
        setLoading(true);
        setErr("");
        try {
            const res = await http(`/auctions/${id}`); // { auction, bids }
            setAuction(res?.auction || null);
            setBids(res?.bids || []);
        } catch (e) {
            setErr(e.message || "Tải chi tiết đấu giá thất bại");
            setAuction(null);
            setBids([]);
        } finally {
            setLoading(false);
        }
    }

    async function loadBids() {
        setLoadingBids(true);
        setErrBids("");
        try {
            const res = await http(`/bids/auctions/${id}`); // { bids } hoặc { items } tuỳ backend
            const list = res?.bids || res?.items || [];
            setBids(list);
        } catch (e) {
            setErrBids(e.message || "Tải danh sách trả giá thất bại");
        } finally {
            setLoadingBids(false);
        }
    }

    async function addWatchlist() {
        if (!authed || watchLoading) return;

        setWatchLoading(true);
        setWatchErr("");
        setWatchMsg("");

        try {
            // POST /watchlist { auction_id }
            await http(`/watchlist`, {
                method: "POST",
                body: { auction_id: Number(id) },
            });

            setWatching(true);
            setWatchMsg("Đã thêm vào danh sách theo dõi.");
        } catch (e) {
            setWatchErr(e.message || "Theo dõi thất bại");
        } finally {
            setWatchLoading(false);
        }
    }

    useEffect(() => {
        loadDetail();
        loadBids();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // countdown
    const [tick, setTick] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setTick((x) => x + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const leftMs = useMemo(() => msLeft(auction?.end_time), [auction?.end_time, tick]);
    const timeLeftText = useMemo(() => (auction?.status === "OPEN" ? fmtDuration(leftMs) : "—"), [auction?.status, leftMs]);

    const currentPrice = useMemo(() => Number(auction?.current_price || 0), [auction]);
    const bidStep = useMemo(() => Number(auction?.bid_step || 0), [auction]);
    const minNextBid = useMemo(() => {
        if (!auction) return 0;
        const base = Number(auction.current_price || 0);
        const step = Number(auction.bid_step || 0);
        return base + (step > 0 ? step : 0);
    }, [auction]);

    const canBid = useMemo(() => {
        if (!auction) return false;
        if (!authed) return false;
        return auction.status === "OPEN" && leftMs > 0;
    }, [auction, authed, leftMs]);

    function normalizeAmountInput(v) {
        // cho phép nhập "1,200,000" hoặc "1200000"
        const s = String(v || "").replace(/[^\d]/g, "");
        return s;
    }

    const amountNumber = useMemo(() => {
        const s = normalizeAmountInput(amount);
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    }, [amount]);

    const amountHint = useMemo(() => {
        if (!auction) return "";
        if (!canBid) return "";
        if (!amount) return `Tối thiểu: ${fmtMoney(minNextBid)}`;
        if (amountNumber < minNextBid) return `Chưa đủ. Tối thiểu: ${fmtMoney(minNextBid)}`;
        return "Hợp lệ";
    }, [auction, canBid, amount, amountNumber, minNextBid]);

    async function placeBid(e) {
        e.preventDefault();
        if (!canBid || placing) return;

        setPlaceErr("");
        setPlaceOk("");

        const n = amountNumber;
        if (!n || n < minNextBid) {
            setPlaceErr(`Số tiền không hợp lệ. Tối thiểu: ${fmtMoney(minNextBid)}`);
            return;
        }

        setPlacing(true);
        try {
            // POST /bids/auctions/:auctionId { amount }
            await http(`/bids/auctions/${id}`, {
                method: "POST",
                body: { amount: n },
            });

            setPlaceOk("Đặt giá thành công.");
            setAmount("");

            // reload bids + auction (để cập nhật current_price / winner...)
            await loadDetail();
            await loadBids();
        } catch (e2) {
            setPlaceErr(e2.message || "Đặt giá thất bại");
        } finally {
            setPlacing(false);
        }
    }

    const sculpture = auction?.sculpture || null;

    return (
        <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                {err && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{err}</div>
                )}

                {loading ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="h-64 rounded-2xl bg-slate-100" />
                            <div className="mt-4 h-5 w-2/3 rounded bg-slate-100" />
                            <div className="mt-2 h-4 w-1/3 rounded bg-slate-100" />
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-12 rounded-2xl bg-slate-100" />
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                            <div className="h-6 w-1/2 rounded bg-slate-100" />
                            <div className="mt-4 space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-14 rounded-2xl bg-slate-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : !auction ? (
                    <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                        <div className="text-lg font-semibold text-slate-900">Không tìm thấy phiên đấu giá</div>
                        <div className="mt-2 text-sm text-slate-500">ID: {id}</div>
                        <div className="mt-6">
                            <Link
                                to="/auctions"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                <Icon name="chevLeft" />
                                Quay lại danh sách
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* header */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Link to="/auctions" className="inline-flex items-center gap-2 text-slate-600 hover:underline">
                                    <Icon name="gavel" />
                                    Đấu giá
                                </Link>
                                <span className="text-slate-400">/</span>
                                <span className="text-slate-900 font-medium">Phiên #{auction.id}</span>
                            </div>

                            <Link
                                to="/auctions"
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Icon name="chevLeft" />
                                Quay lại
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            {/* left: card auction + sculpture */}
                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-100 px-3 py-1 text-xs text-slate-600">
                                            <Icon name="gavel" />
                                            Phiên đấu giá
                                        </div>

                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass(auction.status)}`}>
                                                <Icon name="tag" className="h-3.5 w-3.5" />
                                                {viAuctionStatus(auction.status)}
                                            </span>

                                            {auction.status === "OPEN" && (
                                                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                                                    <Icon name="clock" className="h-3.5 w-3.5" />
                                                    Còn: {timeLeftText}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">Bắt đầu</div>
                                        <div className="mt-1 text-sm font-medium text-slate-900 inline-flex items-center justify-end gap-2">
                                            <Icon name="clock" className="h-4 w-4" />
                                            {fmtDate(auction.start_time)}
                                        </div>
                                        <div className="mt-3 text-xs text-slate-500">Kết thúc</div>
                                        <div className="mt-1 text-sm font-medium text-slate-900 inline-flex items-center justify-end gap-2">
                                            <Icon name="clock" className="h-4 w-4" />
                                            {fmtDate(auction.end_time)}
                                        </div>
                                    </div>
                                </div>

                                {/* sculpture block */}
                                <div className="mt-6 overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                                    <div className="flex gap-4 p-5">
                                        <Link
                                            to={sculpture?.id ? `/sculptures/${sculpture.id}` : "#"}
                                            className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-white border border-slate-100"
                                            title="Xem tác phẩm"
                                        >
                                            {sculpture?.image_url ? (
                                                <img alt={sculpture.title || "tác phẩm"} src={sculpture.image_url} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">Không có ảnh</div>
                                            )}
                                        </Link>

                                        <div className="min-w-0 flex-1">
                                            <Link
                                                to={sculpture?.id ? `/sculptures/${sculpture.id}` : "#"}
                                                className="text-base font-semibold text-slate-900 line-clamp-1 hover:underline"
                                            >
                                                {sculpture?.title || "Tác phẩm"}
                                            </Link>
                                            <div className="mt-1 text-sm text-slate-600 line-clamp-2">{sculpture?.description || "—"}</div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                                {sculpture?.material && (
                                                    <span className="rounded-full bg-white border border-slate-100 px-3 py-1">{sculpture.material}</span>
                                                )}
                                                {sculpture?.year_created && (
                                                    <span className="rounded-full bg-white border border-slate-100 px-3 py-1">{sculpture.year_created}</span>
                                                )}
                                                {sculpture?.dimensions && (
                                                    <span className="rounded-full bg-white border border-slate-100 px-3 py-1">{sculpture.dimensions}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* pricing */}
                                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                        <div className="text-xs text-slate-500">Giá khởi điểm</div>
                                        <div className="mt-1 text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                                            <Icon name="money" />
                                            {fmtMoney(auction.start_price)}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                        <div className="text-xs text-slate-500">Giá hiện tại</div>
                                        <div className="mt-1 text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                                            <Icon name="spark" />
                                            {fmtMoney(auction.current_price)}
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                        <div className="text-xs text-slate-500">Bước giá</div>
                                        <div className="mt-1 text-sm font-semibold text-slate-900">{fmtMoney(auction.bid_step)}</div>
                                    </div>

                                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                        <div className="text-xs text-slate-500">Mua ngay</div>
                                        <div className="mt-1 text-sm font-semibold text-slate-900">
                                            {auction.buy_now_price ? fmtMoney(auction.buy_now_price) : "—"}
                                        </div>
                                    </div>
                                </div>

                                {/* people */}
                                <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-5">
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                                            <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                <Icon name="user" />
                                                Người bán
                                            </div>
                                            <div className="mt-1 text-sm font-semibold text-slate-900">{auction.seller?.full_name || "—"}</div>
                                        </div>

                                        <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                                            <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                <Icon name="user" />
                                                Người thắng tạm thời
                                            </div>
                                            <div className="mt-1 text-sm font-semibold text-slate-900">{auction.winner?.full_name || "—"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* right: bid panel */}
                            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                                            <Icon name="arrowUp" />
                                            Trả giá
                                        </div>
                                        <div className="mt-1 text-sm text-slate-500">
                                            {canBid ? "Nhập số tiền và đặt giá." : authed ? "Phiên này hiện không thể trả giá." : "Đăng nhập để trả giá."}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={addWatchlist}
                                            disabled={!authed || watchLoading || watching}
                                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
                                            title={!authed ? "Cần đăng nhập" : watching ? "Đang theo dõi" : "Theo dõi phiên đấu giá"}
                                        >
                                            <Icon name="follow" />
                                            {watching ? "Đang theo dõi" : watchLoading ? "Đang xử lý..." : "Theo dõi"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await loadBids();
                                                await loadDetail();
                                            }}
                                            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
                                        >
                                            <Icon name="refresh" />
                                            Tải lại
                                        </button>
                                    </div>
                                </div>

                                {watchErr && (
                                    <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                        {watchErr}
                                    </div>
                                )}

                                {watchMsg && (
                                    <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                        {watchMsg}
                                    </div>
                                )}

                                <div className="mt-5 rounded-3xl border border-slate-100 bg-slate-50 p-5">
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="sm:col-span-1">
                                            <div className="text-xs text-slate-500">Giá hiện tại</div>
                                            <div className="mt-1 text-sm font-semibold text-slate-900">{fmtMoney(currentPrice)}</div>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <div className="text-xs text-slate-500">Bước giá</div>
                                            <div className="mt-1 text-sm font-semibold text-slate-900">{fmtMoney(bidStep)}</div>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <div className="text-xs text-slate-500">Tối thiểu</div>
                                            <div className="mt-1 text-sm font-semibold text-slate-900">{fmtMoney(minNextBid)}</div>
                                        </div>
                                    </div>

                                    <form onSubmit={placeBid} className="mt-4">
                                        {placeErr && (
                                            <div className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{placeErr}</div>
                                        )}
                                        {placeOk && (
                                            <div className="mb-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{placeOk}</div>
                                        )}

                                        <label className="block text-sm font-medium text-slate-700">Số tiền trả giá</label>
                                        <div className="mt-2 flex gap-2">
                                            <div className="relative flex-1">
                                                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                    <Icon name="money" />
                                                </div>
                                                <input
                                                    value={amount}
                                                    onChange={(e) => setAmount(normalizeAmountInput(e.target.value))}
                                                    placeholder={`${fmtMoney(minNextBid)}`}
                                                    inputMode="numeric"
                                                    className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                                    disabled={!canBid || placing}
                                                />
                                            </div>

                                            <button
                                                type="button"
                                                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={!canBid || placing}
                                                onClick={() => setAmount(String(minNextBid))}
                                                title="Điền nhanh mức tối thiểu"
                                            >
                                                Tối thiểu
                                            </button>
                                        </div>

                                        <div className="mt-2 text-xs">
                                            <span
                                                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${amountHint === "Hợp lệ"
                                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                                        : "bg-white border-slate-200 text-slate-600"
                                                    }`}
                                            >
                                                <Icon name="tag" className="h-3.5 w-3.5" />
                                                {amountHint}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!canBid || placing}
                                            className="mt-4 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                                        >
                                            <Icon name="gavel" />
                                            {placing ? "Đang đặt giá..." : "Đặt giá"}
                                        </button>
                                    </form>
                                </div>

                                {/* bid history */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                                            <Icon name="arrowUp" />
                                            Lịch sử trả giá
                                        </div>
                                        <div className="text-xs text-slate-500">{bids?.length || 0} lượt</div>
                                    </div>

                                    {loadingBids ? (
                                        <div className="mt-4 space-y-3">
                                            {Array.from({ length: 4 }).map((_, i) => (
                                                <div key={i} className="h-16 rounded-2xl bg-slate-100" />
                                            ))}
                                        </div>
                                    ) : bids.length === 0 ? (
                                        <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 p-8 text-center">
                                            <div className="text-sm font-semibold text-slate-900">Chưa có lượt trả giá</div>
                                            <div className="mt-1 text-sm text-slate-500">Phiên đấu giá này chưa có người tham gia.</div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 space-y-3">
                                            {bids.map((b) => (
                                                <div key={b.id} className="rounded-3xl border border-slate-100 bg-white p-4">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                                                                <Icon name="user" />
                                                                {b.bidder?.full_name || "Không rõ"}
                                                            </div>
                                                            <div className="mt-1 text-xs text-slate-500 inline-flex items-center gap-2">
                                                                <Icon name="clock" className="h-3.5 w-3.5" />
                                                                {fmtDate(b.createdAt)}
                                                            </div>
                                                        </div>

                                                        <div className="text-right">
                                                            <div className="text-xs text-slate-500">Số tiền</div>
                                                            <div className="mt-1 text-sm font-semibold text-slate-900 inline-flex items-center justify-end gap-2">
                                                                <Icon name="money" className="h-4 w-4" />
                                                                {fmtMoney(b.amount)}
                                                            </div>
                                                            <div className="mt-2">
                                                                <span className="rounded-full bg-slate-50 border border-slate-200 px-3 py-1 text-xs text-slate-700">
                                                                    {viBidStatus(b.status)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
