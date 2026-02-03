// src/pages/public/SculptureDetail.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { http } from "../../api/http";

function viStatus(code) {
    switch (code) {
        case "PUBLISHED":
            return "Đang bán";
        case "SOLD":
            return "Đã bán";
        default:
            return code || "—";
    }
}

function fmtDate(iso) {
    if (!iso) return "—";
    try {
        const d = new Date(iso);
        return d.toLocaleString("vi-VN");
    } catch {
        return iso;
    }
}

function Stars({ value = 0, size = "text-base" }) {
    const v = Math.max(0, Math.min(5, Number(value || 0)));
    const full = Math.round(v);
    const arr = Array.from({ length: 5 }).map((_, i) => (i < full ? "★" : "☆"));
    return <div className={`${size} leading-none text-amber-500`}>{arr.join(" ")}</div>;
}

function avgRating(reviews) {
    if (!reviews?.length) return 0;
    const sum = reviews.reduce((a, r) => a + Number(r.rating || 0), 0);
    return sum / reviews.length;
}

// icon SVG nhỏ gọn (không cần thư viện)
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
        case "tag":
            return (
                <svg {...base}>
                    <path d="M20.6 13.4L11 3H4v7l9.6 9.6a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8Z" />
                    <path d="M7.5 7.5h.01" />
                </svg>
            );
        case "grid":
            return (
                <svg {...base}>
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
            );
        case "star":
            return (
                <svg {...base}>
                    <path d="M12 2l3 7 7 .6-5.4 4.6 1.7 7-6.3-3.8L5.7 21l1.7-7L2 9.6 9 9l3-7Z" />
                </svg>
            );
        case "layers":
            return (
                <svg {...base}>
                    <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                </svg>
            );
        case "ruler":
            return (
                <svg {...base}>
                    <path d="M21 16l-8 8-13-13 8-8 13 13Z" />
                    <path d="M7 7l2 2" />
                    <path d="M10 4l2 2" />
                    <path d="M4 10l2 2" />
                    <path d="M13 13l2 2" />
                </svg>
            );
        case "weight":
            return (
                <svg {...base}>
                    <path d="M6 7h12" />
                    <path d="M9 7V5a3 3 0 0 1 6 0v2" />
                    <path d="M6 7l-2 14h16L18 7H6Z" />
                </svg>
            );
        case "calendar":
            return (
                <svg {...base}>
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M3 10h18" />
                </svg>
            );
        case "clock":
            return (
                <svg {...base}>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                </svg>
            );
        case "user":
            return (
                <svg {...base}>
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
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
        case "refresh":
            return (
                <svg {...base}>
                    <path d="M21 12a9 9 0 1 1-3-6.7" />
                    <path d="M21 3v7h-7" />
                </svg>
            );
        case "message":
            return (
                <svg {...base}>
                    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
                </svg>
            );
        default:
            return null;
    }
}

export default function SculptureDetail() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [sculpture, setSculpture] = useState(null);
    const [auction, setAuction] = useState(null);

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [errReviews, setErrReviews] = useState("");

    const [activeImg, setActiveImg] = useState("");

    async function loadDetail() {
        setLoading(true);
        setErr("");
        try {
            const res = await http(`/sculptures/${id}`);
            setSculpture(res?.sculpture || null);
            setAuction(res?.auction || null);

            const s = res?.sculpture;
            const imgs = [...(s?.images || []).map((x) => x.image_url).filter(Boolean), s?.image_url].filter(Boolean);

            setActiveImg(imgs[0] || "");
        } catch (e) {
            setErr(e.message || "Tải chi tiết thất bại");
            setSculpture(null);
            setAuction(null);
            setActiveImg("");
        } finally {
            setLoading(false);
        }
    }

    async function loadReviews() {
        setLoadingReviews(true);
        setErrReviews("");
        try {
            const res = await http(`/sculptures/${id}/reviews`);
            setReviews(res?.reviews || []);
        } catch (e) {
            setErrReviews(e.message || "Tải đánh giá thất bại");
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    }

    useEffect(() => {
        loadDetail();
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const gallery = useMemo(() => {
        if (!sculpture) return [];
        const imgs = [...(sculpture.images || []).map((x) => x.image_url).filter(Boolean), sculpture.image_url].filter(Boolean);
        return Array.from(new Set(imgs));
    }, [sculpture]);

    const ratingAvg = useMemo(() => avgRating(reviews), [reviews]);
    const ratingCount = reviews.length;

    return (
        <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                {err && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {err}
                    </div>
                )}

                {loading ? (
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                            <div className="h-[420px] rounded-2xl bg-slate-100" />
                            <div className="mt-4 grid grid-cols-4 gap-3">
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="h-20 rounded-2xl bg-slate-100" />
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                            <div className="h-7 w-2/3 rounded bg-slate-100" />
                            <div className="mt-3 h-4 w-1/3 rounded bg-slate-100" />
                            <div className="mt-6 h-24 w-full rounded bg-slate-100" />
                            <div className="mt-6 grid grid-cols-2 gap-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-12 rounded-2xl bg-slate-100" />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : !sculpture ? (
                    <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                        <div className="text-lg font-semibold text-slate-900">Không tìm thấy tác phẩm</div>
                        <div className="mt-2 text-sm text-slate-500">ID: {id}</div>
                        <div className="mt-6">
                            <Link
                                to="/sculptures"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                <Icon name="chevLeft" />
                                Quay lại danh sách
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Link to="/sculptures" className="inline-flex items-center gap-2 text-slate-600 hover:underline">
                                    <Icon name="grid" />
                                    Tác phẩm
                                </Link>
                                <span className="text-slate-400">/</span>
                                <span className="text-slate-900 font-medium line-clamp-1">{sculpture.title}</span>
                            </div>

                            <Link
                                to="/sculptures"
                                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                <Icon name="chevLeft" />
                                Quay lại
                            </Link>
                        </div>

                        <div className="mt-6 grid gap-6 lg:grid-cols-2">
                            {/* Gallery */}
                            <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                                <div className="relative overflow-hidden rounded-2xl bg-slate-100">
                                    {activeImg ? (
                                        <img alt={sculpture.title || "tác phẩm"} src={activeImg} className="h-[420px] w-full object-cover" />
                                    ) : (
                                        <div className="h-[420px] w-full flex items-center justify-center text-slate-400">Không có ảnh</div>
                                    )}

                                    <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 border border-slate-100">
                                            <Icon name="tag" className="h-3.5 w-3.5" />
                                            {viStatus(sculpture.status)}
                                        </span>

                                        {sculpture.category?.name && (
                                            <Link
                                                to={`/sculptures?category_id=${sculpture.category.id}`}
                                                className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 border border-slate-100 hover:bg-white"
                                                title="Xem theo danh mục"
                                            >
                                                <Icon name="layers" className="h-3.5 w-3.5" />
                                                {sculpture.category.name}
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {gallery.length > 1 && (
                                    <div className="mt-4 grid grid-cols-4 gap-3">
                                        {gallery.slice(0, 8).map((u) => (
                                            <button
                                                key={u}
                                                type="button"
                                                onClick={() => setActiveImg(u)}
                                                className={`overflow-hidden rounded-2xl border transition ${activeImg === u ? "border-slate-900" : "border-slate-200 hover:border-slate-300"
                                                    }`}
                                                title="Xem ảnh"
                                            >
                                                <img alt="ảnh" src={u} className="h-20 w-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <h1 className="text-3xl font-semibold text-slate-900">{sculpture.title}</h1>
                                        <div className="mt-2 flex flex-wrap items-center gap-3">
                                            <div className="flex items-center gap-2">
                                                <Stars value={ratingAvg} />
                                                <div className="text-sm text-slate-600">
                                                    {ratingCount > 0 ? (
                                                        <>
                                                            <span className="font-medium text-slate-900">{ratingAvg.toFixed(1)}</span>
                                                            <span className="text-slate-500"> / 5</span>
                                                            <span className="text-slate-400"> • </span>
                                                            <span className="text-slate-600">{ratingCount} đánh giá</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-500">Chưa có đánh giá</span>
                                                    )}
                                                </div>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-100 px-3 py-1 text-xs text-amber-700">
                                                    <Icon name="star" className="h-3.5 w-3.5" />
                                                    {ratingCount ? "Được đánh giá" : "Mới"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {sculpture.description && (
                                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-700">
                                            {sculpture.description}
                                        </div>
                                    )}

                                    {/* Specs */}
                                    <div className="mt-1 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                            <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                <Icon name="layers" />
                                                Chất liệu
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-slate-900">{sculpture.material || "—"}</div>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                            <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                <Icon name="ruler" />
                                                Kích thước
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-slate-900">{sculpture.dimensions || "—"}</div>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                            <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                <Icon name="weight" />
                                                Khối lượng
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-slate-900">
                                                {sculpture.weight ? `${sculpture.weight} kg` : "—"}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                                            <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                <Icon name="calendar" />
                                                Năm sáng tác
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-slate-900">{sculpture.year_created || "—"}</div>
                                        </div>

                                        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 sm:col-span-2">
                                            <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                <Icon name="clock" />
                                                Cập nhật
                                            </div>
                                            <div className="mt-1 text-sm font-medium text-slate-900">{fmtDate(sculpture.updatedAt)}</div>
                                        </div>
                                    </div>

                                    {/* Artist */}
                                    <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                                                {sculpture.artist?.avatar_url ? (
                                                    <img
                                                        alt={sculpture.artist?.full_name || "nghệ nhân"}
                                                        src={sculpture.artist.avatar_url}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">—</div>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                                                    <span className="inline-flex items-center gap-2">
                                                        <Icon name="user" />
                                                        {sculpture.artist?.full_name || "Không rõ"}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500">Nghệ nhân</div>
                                            </div>
                                        </div>

                                        {sculpture.artist?.bio && <div className="mt-3 text-sm text-slate-700">{sculpture.artist.bio}</div>}
                                    </div>

                                    {/* Auction */}
                                    <div className="mt-4 rounded-3xl border border-slate-100 bg-slate-50 p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                                                    <Icon name="gavel" />
                                                    Đấu giá
                                                </div>
                                                <div className="mt-1 text-sm text-slate-600">
                                                    {auction ? "Có phiên đấu giá đang diễn ra/đã lên lịch." : "Chưa có phiên đấu giá."}
                                                </div>
                                            </div>
                                            <div className="rounded-2xl bg-white border border-slate-100 px-3 py-2 text-xs font-medium text-slate-700">
                                                {auction ? (auction.status === "OPEN" ? "Đang mở" : "Đã lên lịch") : "—"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                                        <Link
                                            to={`/sculptures?category_id=${sculpture.category_id}`}
                                            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-center text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center justify-center gap-2"
                                        >
                                            <Icon name="layers" />
                                            Cùng danh mục
                                        </Link>
                                        <button
                                            type="button"
                                            className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 inline-flex items-center justify-center gap-2"
                                            onClick={() => {
                                                const el = document.getElementById("reviews");
                                                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                                            }}
                                        >
                                            <Icon name="message" />
                                            Xem đánh giá
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div id="reviews" className="mt-10 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-900 inline-flex items-center gap-2">
                                        <Icon name="message" />
                                        Đánh giá
                                    </h2>
                                    <div className="mt-1 text-sm text-slate-500">
                                        {ratingCount > 0 ? `${ratingCount} đánh giá • Trung bình ${ratingAvg.toFixed(1)}/5` : "Chưa có đánh giá"}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={loadReviews}
                                    className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
                                >
                                    <Icon name="refresh" />
                                    Tải lại
                                </button>
                            </div>

                            {errReviews && (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {errReviews}
                                </div>
                            )}

                            {loadingReviews ? (
                                <div className="mt-6 space-y-3">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <div key={i} className="rounded-3xl border border-slate-100 p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-2xl bg-slate-100" />
                                                <div className="flex-1">
                                                    <div className="h-3 w-1/4 rounded bg-slate-100" />
                                                    <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
                                                </div>
                                            </div>
                                            <div className="mt-4 h-3 w-5/6 rounded bg-slate-100" />
                                            <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="mt-8 rounded-3xl border border-slate-100 bg-slate-50 p-10 text-center">
                                    <div className="text-lg font-semibold text-slate-900">Chưa có đánh giá</div>
                                    <div className="mt-2 text-sm text-slate-500">Hãy quay lại sau khi có người mua và đánh giá.</div>
                                </div>
                            ) : (
                                <div className="mt-6 grid gap-4 lg:grid-cols-2">
                                    {reviews.map((r) => (
                                        <div key={r.id} className="rounded-3xl border border-slate-100 p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="h-11 w-11 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                                                    {r.user?.avatar_url ? (
                                                        <img alt={r.user?.full_name || "người dùng"} src={r.user.avatar_url} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">—</div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="text-sm font-semibold text-slate-900 line-clamp-1 inline-flex items-center gap-2">
                                                            <Icon name="user" className="h-4 w-4" />
                                                            {r.user?.full_name || "Không rõ"}
                                                        </div>
                                                        <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                                                            <Icon name="clock" className="h-3.5 w-3.5" />
                                                            {fmtDate(r.createdAt)}
                                                        </div>
                                                    </div>

                                                    <div className="mt-1 flex items-center gap-2">
                                                        <Stars value={r.rating} size="text-sm" />
                                                        <div className="text-xs text-slate-600">{Number(r.rating || 0)}/5</div>
                                                    </div>

                                                    <div className="mt-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 text-sm text-slate-700">
                                                        {r.comment || "—"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
