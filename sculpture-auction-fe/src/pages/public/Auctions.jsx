// src/pages/public/Auctions.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../../api/http";

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

// icon SVG nhỏ gọn
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
    default:
      return null;
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
        <button key={n} className={`${btnBase} ${n === page ? btnActive : btnIdle}`} onClick={() => onPage(n)}>
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

export default function Auctions() {
  const nav = useNavigate();

  const [status, setStatus] = useState(""); // "", SCHEDULED, OPEN, CLOSED, CANCELLED...
  const [q, setQ] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  async function loadAuctions() {
    setLoading(true);
    setErr("");
    try {
      const query = buildQuery({
        status: status || undefined,
        q: q || undefined,
        page,
        limit,
      });

      const res = await http(`/auctions${query}`);
      setItems(res?.items || []);
      setTotal(res?.total || 0);
    } catch (e) {
      setErr(e.message || "Tải danh sách đấu giá thất bại");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAuctions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, page, limit]);

  function applySearch(e) {
    e.preventDefault();
    setPage(1);
    loadAuctions();
  }

  function resetFilters() {
    setStatus("");
    setQ("");
    setPage(1);
    setLimit(12);
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
              <Icon name="gavel" className="h-4 w-4" />
              Đấu giá
            </div>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Danh sách phiên đấu giá</h1>
            <p className="mt-1 text-sm text-slate-500">Bấm vào một phiên để xem chi tiết và trả giá.</p>
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
              onClick={loadAuctions}
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
            <div className="lg:col-span-6">
              <label className="block text-sm font-medium text-slate-700">Từ khoá</label>
              <div className="mt-2 relative">
                <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Icon name="search" />
                </div>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Nhập tên tác phẩm / người bán / người thắng..."
                  className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                />
              </div>
            </div>

            <div className="lg:col-span-3">
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
                <option value="SCHEDULED">Sắp diễn ra</option>
                <option value="OPEN">Đang diễn ra</option>
                <option value="CLOSED">Đã kết thúc</option>
                <option value="CANCELLED">Đã huỷ</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Số dòng/trang</label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
              >
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
                <option value={24}>24</option>
              </select>
            </div>

            <div className="lg:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-medium text-white hover:bg-slate-800 inline-flex items-center justify-center gap-2"
              >
                <Icon name="filter" />
                Lọc
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

        {/* List */}
        {loading ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {Array.from({ length: Math.min(6, limit) }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex gap-4">
                  <div className="h-24 w-28 rounded-2xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="mt-3 h-3 w-1/3 rounded bg-slate-100" />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="h-8 rounded-2xl bg-slate-100" />
                      <div className="h-8 rounded-2xl bg-slate-100" />
                      <div className="h-8 rounded-2xl bg-slate-100" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-900">Không có phiên đấu giá</div>
            <div className="mt-2 text-sm text-slate-500">Thử thay đổi bộ lọc.</div>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {items.map((a) => {
                const s = a.sculpture || {};
                const img = s.image_url || "";
                const detailPath = `/auctions/${a.id}`;

                return (
                  <div
                    key={a.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => nav(detailPath)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") nav(detailPath);
                    }}
                    className="cursor-pointer rounded-3xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition focus:outline-none focus:ring-4 focus:ring-slate-900/10"
                    title="Xem chi tiết phiên đấu giá"
                  >
                    <div className="flex gap-4">
                      <Link
                        to={detailPath}
                        onClick={(e) => e.stopPropagation()}
                        className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-100"
                        title="Xem chi tiết"
                      >
                        {img ? (
                          <img alt={s.title || "tác phẩm"} src={img} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                            Không có ảnh
                          </div>
                        )}
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              to={detailPath}
                              onClick={(e) => e.stopPropagation()}
                              className="text-base font-semibold text-slate-900 line-clamp-1 hover:underline"
                            >
                              Phiên #{a.id} • {s.title || "Tác phẩm"}
                            </Link>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${statusBadgeClass(
                                  a.status
                                )}`}
                              >
                                <Icon name="tag" className="h-3.5 w-3.5" />
                                {viAuctionStatus(a.status)}
                              </span>

                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 border border-slate-100 px-3 py-1 text-xs text-slate-700">
                                <Icon name="user" className="h-3.5 w-3.5" />
                                Bán: <span className="font-medium">{a.seller?.full_name || "—"}</span>
                              </span>

                              {a.winner?.full_name && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs text-emerald-800">
                                  <Icon name="user" className="h-3.5 w-3.5" />
                                  Thắng: <span className="font-medium">{a.winner.full_name}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                              <Icon name="clock" className="h-3.5 w-3.5" />
                              {fmtDate(a.start_time)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="text-[11px] text-slate-500">Khởi điểm</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                              <Icon name="money" className="h-4 w-4" />
                              {fmtMoney(a.start_price)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="text-[11px] text-slate-500">Hiện tại</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                              <Icon name="money" className="h-4 w-4" />
                              {fmtMoney(a.current_price)}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="text-[11px] text-slate-500">Bước giá</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900">{fmtMoney(a.bid_step)}</div>
                          </div>

                          <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="text-[11px] text-slate-500">Mua ngay</div>
                            <div className="mt-1 text-sm font-semibold text-slate-900">
                              {a.buy_now_price ? fmtMoney(a.buy_now_price) : "—"}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-3">
                          <div className="text-xs text-slate-500 inline-flex items-center gap-1">
                            <Icon name="clock" className="h-3.5 w-3.5" />
                            Kết thúc: {fmtDate(a.end_time)}
                          </div>

                          <Link
                            to={detailPath}
                            onClick={(e) => e.stopPropagation()}
                            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 inline-flex items-center gap-2"
                            title="Xem chi tiết và trả giá"
                          >
                            <Icon name="gavel" />
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
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
