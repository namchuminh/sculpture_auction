// src/pages/public/Sculptures.jsx
import React, { useEffect, useMemo, useState } from "react";
import { http } from "../../api/http";
import { Link } from "react-router-dom";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function buildQuery(params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "string" && v.trim() === "") return;
        sp.set(k, String(v));
    });
    const s = sp.toString();
    return s ? `?${s}` : "";
}

// icon SVG nhỏ gọn (không cần thư viện)
function Icon({ name, className = "h-4 w-4" }) {
    const base = { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
    switch (name) {
        case "search":
            return (
                <svg {...base}>
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                </svg>
            );
        case "filter":
            return (
                <svg {...base}>
                    <path d="M3 5h18" />
                    <path d="M6 12h12" />
                    <path d="M10 19h4" />
                </svg>
            );
        case "refresh":
            return (
                <svg {...base}>
                    <path d="M21 12a9 9 0 1 1-3-6.7" />
                    <path d="M21 3v7h-7" />
                </svg>
            );
        case "reset":
            return (
                <svg {...base}>
                    <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 8.6 6" />
                    <path d="M3 3v6h6" />
                    <path d="M12 7v5l3 2" />
                </svg>
            );
        case "tag":
            return (
                <svg {...base}>
                    <path d="M20.6 13.4L11 3H4v7l9.6 9.6a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8Z" />
                    <path d="M7.5 7.5h.01" />
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
        case "cube":
            return (
                <svg {...base}>
                    <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                    <path d="M3.3 7.3 12 12l8.7-4.7" />
                    <path d="M12 22V12" />
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
        case "sort":
            return (
                <svg {...base}>
                    <path d="M11 5h10" />
                    <path d="M11 9h7" />
                    <path d="M11 13h4" />
                    <path d="M3 17l4 4 4-4" />
                    <path d="M7 21V3" />
                </svg>
            );
        case "chevLeft":
            return (
                <svg {...base}>
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            );
        case "chevRight":
            return (
                <svg {...base}>
                    <path d="M9 18l6-6-6-6" />
                </svg>
            );
        default:
            return null;
    }
}

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

function viSortLabel(field) {
    switch (field) {
        case "createdAt":
            return "Ngày tạo";
        case "title":
            return "Tên tác phẩm";
        case "year_created":
            return "Năm sáng tác";
        case "status":
            return "Trạng thái";
        default:
            return field;
    }
}

function Pagination({ page, totalPages, onPage }) {
    if (totalPages <= 1) return null;

    const btnBase =
        "px-3 py-2 rounded-xl border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2";
    const btnIdle = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
    const btnActive = "bg-slate-900 text-white border-slate-900";

    const windowSize = 5;
    let left = Math.max(1, page - Math.floor(windowSize / 2));
    let right = Math.min(totalPages, left + windowSize - 1);
    left = Math.max(1, right - windowSize + 1);

    const nums = [];
    for (let i = left; i <= right; i++) nums.push(i);

    return (
        <div className="mt-6 flex flex-wrap items-center gap-2">
            <button className={`${btnBase} ${btnIdle}`} disabled={page === 1} onClick={() => onPage(1)}>
                Trang đầu
            </button>

            <button className={`${btnBase} ${btnIdle}`} disabled={page === 1} onClick={() => onPage(page - 1)}>
                <Icon name="chevLeft" />
                Trước
            </button>

            {left > 1 && <span className="px-2 text-slate-400">…</span>}

            {nums.map((n) => (
                <button
                    key={n}
                    className={`${btnBase} ${n === page ? btnActive : btnIdle}`}
                    onClick={() => onPage(n)}
                >
                    {n}
                </button>
            ))}

            {right < totalPages && <span className="px-2 text-slate-400">…</span>}

            <button className={`${btnBase} ${btnIdle}`} disabled={page === totalPages} onClick={() => onPage(page + 1)}>
                Sau
                <Icon name="chevRight" />
            </button>

            <button className={`${btnBase} ${btnIdle}`} disabled={page === totalPages} onClick={() => onPage(totalPages)}>
                Trang cuối
            </button>
        </div>
    );
}

export default function Sculptures() {
    const [status, setStatus] = useState(""); // "", PUBLISHED, SOLD
    const [categoryId, setCategoryId] = useState("");
    const [material, setMaterial] = useState("");
    const [yearCreated, setYearCreated] = useState("");
    const [q, setQ] = useState("");

    const [sort, setSort] = useState("createdAt");
    const [order, setOrder] = useState("DESC");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);

    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

    async function loadCategories() {
        try {
            const res = await http("/categories");
            setCategories(res?.categories || []);
        } catch {
            setCategories([]);
        }
    }

    async function loadSculptures() {
        setLoading(true);
        setErr("");
        try {
            const query = buildQuery({
                status: status || undefined,
                category_id: categoryId || undefined,
                material: material || undefined,
                year_created: yearCreated || undefined,
                q: q || undefined,
                sort,
                order,
                page,
                limit,
            });

            const res = await http(`/sculptures${query}`);
            setItems(res?.items || []);
            setTotal(res?.total || 0);
        } catch (e) {
            setErr(e.message || "Tải dữ liệu thất bại");
            setItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        loadSculptures();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, categoryId, material, yearCreated, q, sort, order, page, limit]);

    function resetFilters() {
        setStatus("");
        setCategoryId("");
        setMaterial("");
        setYearCreated("");
        setQ("");
        setSort("createdAt");
        setOrder("DESC");
        setPage(1);
        setLimit(12);
    }

    function applySearch(e) {
        e.preventDefault();
        setPage(1);
        loadSculptures();
    }

    function onChangeLimit(v) {
        setLimit(Number(v));
        setPage(1);
    }

    function onPage(n) {
        setPage(clamp(Number(n), 1, totalPages));
    }

    return (
        <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-slate-100 px-3 py-1 text-xs text-slate-600">
                            <Icon name="cube" className="h-4 w-4" />
                            Tác phẩm điêu khắc
                        </div>
                        <h1 className="mt-3 text-3xl font-semibold text-slate-900">Danh sách tác phẩm</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Lọc theo trạng thái, danh mục, chất liệu, năm sáng tác và từ khoá. Có phân trang.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-2"
                        >
                            <Icon name="reset" />
                            Xoá lọc
                        </button>
                        <button
                            type="button"
                            onClick={() => loadSculptures()}
                            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 inline-flex items-center gap-2"
                        >
                            <Icon name="refresh" />
                            Tải lại
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Icon name="filter" />
                        Bộ lọc
                    </div>

                    <form onSubmit={applySearch} className="grid gap-4 lg:grid-cols-12">
                        <div className="lg:col-span-4">
                            <label className="block text-sm font-medium text-slate-700">Từ khoá</label>
                            <div className="mt-2 relative">
                                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="search" />
                                </div>
                                <input
                                    value={q}
                                    onChange={(e) => setQ(e.target.value)}
                                    placeholder="Nhập tên hoặc mô tả..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Trạng thái</label>
                            <select
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value);
                                    setPage(1);
                                }}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                            >
                                <option value="">Tất cả</option>
                                <option value="PUBLISHED">Đang bán</option>
                                <option value="SOLD">Đã bán</option>
                            </select>
                        </div>

                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-slate-700">Danh mục</label>
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    setCategoryId(e.target.value);
                                    setPage(1);
                                }}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                            >
                                <option value="">Tất cả</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-slate-700">Chất liệu</label>
                            <div className="mt-2 relative">
                                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="layers" />
                                </div>
                                <input
                                    value={material}
                                    onChange={(e) => {
                                        setMaterial(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="VD: Gỗ, Đá..."
                                    className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-slate-700">Năm sáng tác</label>
                            <div className="mt-2 relative">
                                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="calendar" />
                                </div>
                                <input
                                    value={yearCreated}
                                    onChange={(e) => {
                                        setYearCreated(e.target.value.replace(/[^\d]/g, "").slice(0, 4));
                                        setPage(1);
                                    }}
                                    placeholder="2024"
                                    className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <label className="block text-sm font-medium text-slate-700">Sắp xếp theo</label>
                            <div className="mt-2 relative">
                                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Icon name="sort" />
                                </div>
                                <select
                                    value={sort}
                                    onChange={(e) => {
                                        setSort(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                >
                                    <option value="createdAt">{viSortLabel("createdAt")}</option>
                                    <option value="title">{viSortLabel("title")}</option>
                                    <option value="year_created">{viSortLabel("year_created")}</option>
                                    <option value="status">{viSortLabel("status")}</option>
                                </select>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Thứ tự</label>
                            <select
                                value={order}
                                onChange={(e) => {
                                    setOrder(e.target.value);
                                    setPage(1);
                                }}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                            >
                                <option value="DESC">Giảm dần</option>
                                <option value="ASC">Tăng dần</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-sm font-medium text-slate-700">Số dòng/trang</label>
                            <select
                                value={limit}
                                onChange={(e) => onChangeLimit(e.target.value)}
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                            >
                                <option value={8}>8</option>
                                <option value={12}>12</option>
                                <option value={16}>16</option>
                                <option value={24}>24</option>
                            </select>
                        </div>

                        <div className="lg:col-span-2 flex items-end">
                            <button
                                type="submit"
                                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 inline-flex items-center justify-center gap-2"
                            >
                                <Icon name="filter" />
                                Áp dụng
                            </button>
                        </div>
                    </form>
                </div>

                {/* Result header */}
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-600">
                        Tổng số: <span className="font-semibold text-slate-900">{total}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        Trang <span className="font-semibold text-slate-900">{page}</span> /{" "}
                        <span className="font-semibold text-slate-900">{totalPages}</span>
                    </div>
                </div>

                {err && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {err}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: limit }).map((_, i) => (
                            <div key={i} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                                <div className="h-44 rounded-2xl bg-slate-100" />
                                <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
                                <div className="mt-2 h-3 w-full rounded bg-slate-100" />
                                <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                        <div className="text-lg font-semibold text-slate-900">Không có dữ liệu</div>
                        <div className="mt-2 text-sm text-slate-500">Thử thay đổi bộ lọc.</div>
                    </div>
                ) : (
                    <>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {items.map((s) => {
                                const img = s.image_url || s.images?.[0]?.image_url || "";
                                return (
                                    <Link
                                        key={s.id}
                                        to={`/sculptures/${s.id}`}
                                        className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                                        title="Xem chi tiết"
                                    >
                                        <div className="relative h-48 bg-slate-100">
                                            {img ? (
                                                <img
                                                    alt={s.title || "tác phẩm"}
                                                    src={img}
                                                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                                                    Không có ảnh
                                                </div>
                                            )}

                                            <div className="absolute left-4 top-4 flex gap-2">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 border border-slate-100">
                                                    <Icon name="tag" className="h-3.5 w-3.5" />
                                                    {viStatus(s.status)}
                                                </span>
                                                {s.category?.name && (
                                                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-900 border border-slate-100">
                                                        {s.category.name}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition" />
                                        </div>

                                        <div className="p-4">
                                            <div className="text-base font-semibold text-slate-900 line-clamp-1">{s.title}</div>
                                            <div className="mt-1 text-sm text-slate-600 line-clamp-2">{s.description || "—"}</div>

                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="text-xs text-slate-500 inline-flex items-center gap-2">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Icon name="layers" className="h-3.5 w-3.5" />
                                                        {s.material || "—"}
                                                    </span>
                                                    <span className="text-slate-300">•</span>
                                                    <span className="inline-flex items-center gap-1">
                                                        <Icon name="calendar" className="h-3.5 w-3.5" />
                                                        {s.year_created || "—"}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <div className="h-7 w-7 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                                                        {s.artist?.avatar_url ? (
                                                            <img
                                                                alt={s.artist?.full_name || "nghệ nhân"}
                                                                src={s.artist.avatar_url}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-[10px] text-slate-400">
                                                                —
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-700 line-clamp-1 max-w-[120px]">
                                                        {s.artist?.full_name || "Không rõ"}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        <Pagination page={page} totalPages={totalPages} onPage={onPage} />
                    </>
                )}
            </div>
        </div>
    );
}
