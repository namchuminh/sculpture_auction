// src/pages/user/NotificationsCenter.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
    fetchMyNotifications,
    markNotificationRead,
    readAllNotifications,
} from "../../api/notifications.api";

function fmtTime(s) {
    if (!s) return "";
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString("vi-VN");
}

export default function NotificationsCenter() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const unreadCount = useMemo(
        () => items.filter((x) => !Number(x.is_read)).length,
        [items]
    );

    const totalPages = useMemo(() => {
        const n = Math.ceil(items.length / pageSize);
        return n < 1 ? 1 : n;
    }, [items.length]);

    const pageItems = useMemo(() => {
        const start = (page - 1) * pageSize;
        return items.slice(start, start + pageSize);
    }, [items, page]);

    async function load() {
        setLoading(true);
        setErr("");
        try {
            const list = await fetchMyNotifications();
            setItems(list);
            setPage(1);
        } catch (e) {
            setErr(e?.message || "Lỗi tải thông báo");
        } finally {
            setLoading(false);
        }
    }

    async function onReadOne(id) {
        try {
            await markNotificationRead(id);
            setItems((prev) =>
                prev.map((x) => (x.id === id ? { ...x, is_read: 1 } : x))
            );
        } catch (_) { }
    }

    async function onReadAll() {
        setErr("");
        try {
            await readAllNotifications();
            setItems((prev) => prev.map((x) => ({ ...x, is_read: 1 })));
        } catch (e) {
            setErr(e?.message || "Không thể đánh dấu đã đọc");
        }
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        if (page > totalPages) setPage(totalPages);
    }, [totalPages, page]);

    return (
        <div className="mx-auto max-w-6xl px-4 py-6">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900">
                        Trung tâm thông báo
                    </h1>
                    <div className="mt-1 text-sm text-slate-600">
                        Tổng: <span className="font-semibold">{items.length}</span> • Chưa đọc:{" "}
                        <span className="font-semibold">{unreadCount}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={load}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Làm mới
                    </button>
                    <button
                        onClick={onReadAll}
                        className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                        Đọc tất cả
                    </button>
                </div>
            </div>

            {err && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                </div>
            )}

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {loading ? (
                    <div className="p-6 text-sm text-slate-600">Đang tải...</div>
                ) : pageItems.length === 0 ? (
                    <div className="p-6 text-sm text-slate-600">Chưa có thông báo.</div>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {pageItems.map((n) => {
                            const unread = !Number(n.is_read);
                            return (
                                <li
                                    key={n.id}
                                    className={`p-4 hover:bg-slate-50 ${unread ? "bg-slate-50/60" : ""
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                {unread && (
                                                    <span className="inline-block h-2 w-2 rounded-full bg-slate-900" />
                                                )}
                                                <div className="truncate text-sm font-extrabold text-slate-900">
                                                    {n.title}
                                                </div>
                                                {n.type && (
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                                                        {n.type}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                                {n.content}
                                            </div>

                                            <div className="mt-2 text-xs text-slate-500">
                                                {fmtTime(n.createdAt)}
                                            </div>
                                        </div>

                                        {unread && (
                                            <button
                                                onClick={() => onReadOne(n.id)}
                                                className="shrink-0 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white"
                                            >
                                                Đã đọc
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm text-slate-600">
                    Trang <span className="font-semibold">{page}</span> /{" "}
                    <span className="font-semibold">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Trước
                    </button>

                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}
