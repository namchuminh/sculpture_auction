// src/pages/public/Categories.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../api/http";

function chunkPage(total, page, pageSize) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * pageSize;
    const end = start + pageSize;
    return { totalPages, safePage, start, end };
}

export default function Categories() {
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const [items, setItems] = useState([]);

    const [q, setQ] = useState("");
    const [pageSize, setPageSize] = useState(8);
    const [page, setPage] = useState(1);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            setErr("");
            try {
                const res = await http("/categories");
                const cats = res?.categories || [];
                if (!mounted) return;
                setItems(cats);
            } catch (e) {
                if (!mounted) return;
                setErr(e.message || "Tải danh mục thất bại");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();
        return () => {
            mounted = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const s = q.trim().toLowerCase();
        if (!s) return items;
        return items.filter((c) => {
            const name = (c.name || "").toLowerCase();
            const desc = (c.description || "").toLowerCase();
            return name.includes(s) || desc.includes(s);
        });
    }, [items, q]);

    const { totalPages, safePage, start, end } = useMemo(() => {
        return chunkPage(filtered.length, page, pageSize);
    }, [filtered.length, page, pageSize]);

    const pageItems = useMemo(() => filtered.slice(start, end), [filtered, start, end]);

    useEffect(() => {
        setPage(1);
    }, [q, pageSize]);

    function Pagination() {
        if (totalPages <= 1) return null;

        const btnBase =
            "px-3 py-2 rounded-xl border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed";
        const btnActive = "bg-slate-900 text-white border-slate-900";
        const btnIdle = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";

        const nums = [];
        const windowSize = 5;
        let left = Math.max(1, safePage - Math.floor(windowSize / 2));
        let right = Math.min(totalPages, left + windowSize - 1);
        left = Math.max(1, right - windowSize + 1);

        for (let i = left; i <= right; i++) nums.push(i);

        return (
            <div className="mt-6 flex flex-wrap items-center gap-2">
                <button className={`${btnBase} ${btnIdle}`} disabled={safePage === 1} onClick={() => setPage(1)}>
                    Trang đầu
                </button>
                <button
                    className={`${btnBase} ${btnIdle}`}
                    disabled={safePage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                    Trước
                </button>

                {left > 1 && <span className="px-2 text-slate-400">…</span>}

                {nums.map((n) => (
                    <button
                        key={n}
                        className={`${btnBase} ${n === safePage ? btnActive : btnIdle}`}
                        onClick={() => setPage(n)}
                    >
                        {n}
                    </button>
                ))}

                {right < totalPages && <span className="px-2 text-slate-400">…</span>}

                <button
                    className={`${btnBase} ${btnIdle}`}
                    disabled={safePage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                    Sau
                </button>
                <button className={`${btnBase} ${btnIdle}`} disabled={safePage === totalPages} onClick={() => setPage(totalPages)}>
                    Trang cuối
                </button>

                <div className="ml-auto text-sm text-slate-500">
                    {filtered.length === 0 ? "0" : start + 1}-{Math.min(end, filtered.length)} / {filtered.length}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">Danh mục</h1>
                        <p className="mt-1 text-sm text-slate-500">Chọn danh mục để xem tác phẩm tương ứng.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Tìm theo tên / mô tả..."
                            className="w-full sm:w-72 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                        />

                        <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="w-full sm:w-44 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                        >
                            <option value={6}>6 / trang</option>
                            <option value={8}>8 / trang</option>
                            <option value={12}>12 / trang</option>
                            <option value={16}>16 / trang</option>
                        </select>
                    </div>
                </div>

                {err && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {err}
                    </div>
                )}

                {loading ? (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: pageSize }).map((_, i) => (
                            <div key={i} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                                <div className="h-32 rounded-2xl bg-slate-100" />
                                <div className="mt-4 h-4 w-2/3 rounded bg-slate-100" />
                                <div className="mt-2 h-3 w-full rounded bg-slate-100" />
                                <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
                        <div className="text-lg font-semibold text-slate-900">Không có danh mục</div>
                        <div className="mt-2 text-sm text-slate-500">Thử đổi từ khoá tìm kiếm.</div>
                    </div>
                ) : (
                    <>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {pageItems.map((c) => (
                                <Link
                                    key={c.id}
                                    to={`/sculptures?category_id=${c.id}`}
                                    className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                                    title="Xem tác phẩm theo danh mục"
                                >
                                    <div className="relative h-40 bg-slate-100">
                                        {c.image_url ? (
                                            <img
                                                alt={c.name || "danh mục"}
                                                src={c.image_url}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                                                Không có ảnh
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition" />
                                    </div>

                                    <div className="p-4">
                                        <div className="text-base font-semibold text-slate-900 line-clamp-1">{c.name}</div>
                                        <div className="mt-1 text-sm text-slate-600 line-clamp-2">{c.description || "—"}</div>

                                        <div className="mt-4 flex items-center justify-end">
                                            <div className="text-xs font-medium text-slate-700 rounded-full bg-slate-50 border border-slate-100 px-3 py-1">
                                                Xem tác phẩm
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <Pagination />
                    </>
                )}
            </div>
        </div>
    );
}
