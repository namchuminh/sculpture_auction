// src/pages/public/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { categoriesApi } from "../../api/categories.api";
import { auctionsApi } from "../../api/auctions.api";

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
function getEndMs(a) {
  const t = a?.end_time || a?.endTime;
  const ms = t ? new Date(t).getTime() : 0;
  return Number.isFinite(ms) ? ms : 0;
}
function getCreatedMs(a) {
  const t = a?.createdAt || a?.created_at;
  const ms = t ? new Date(t).getTime() : 0;
  return Number.isFinite(ms) ? ms : 0;
}
function useNow(stepMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  React.useEffect(() => {
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

function Skeleton({ className }) {
  return <div className={cx("animate-pulse rounded-2xl bg-slate-100", className)} />;
}

/* ---------- Icons (inline SVG) ---------- */
function IconSearch({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.3 16.3 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function IconHammer({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M6 8l4-4 5 5-4 4-5-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M11 13 4.5 19.5a2.1 2.1 0 0 0 3 3L14 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 9l3-3 2 2-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}
function IconClock({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTag({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M20 13 13 20a2 2 0 0 1-2.8 0l-6.4-6.4A2 2 0 0 1 3 12.2V5a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6L20 10a2 2 0 0 1 0 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7.5 7.5h.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
function IconShield({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2 20 6v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTruck({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M3 7h11v10H3V7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 10h4l3 3v4h-7v-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M7 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM18 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function IconSpark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path d="M12 2l1.3 5.2L18 8.5l-4.7 1.3L12 15l-1.3-5.2L6 8.5l4.7-1.3L12 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M5 14l.7 2.8L8.5 17l-2.8.7L5 20l-.7-2.3L1.5 17l2.8-.2L5 14Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M19 13l.8 3 3.2 1-3.2.8L19 21l-.8-3.2L15 17l3.2-1L19 13Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

/* ---------- Small UI helpers ---------- */
function ImgCover({ src, alt }) {
  if (src)
    return (
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        loading="lazy"
      />
    );

  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-slate-50 to-slate-200">
      <IconSpark className="h-10 w-10 text-slate-400" />
    </div>
  );
}

function SectionHead({ title, subtitle, right }) {
  return (
    <div className="mt-12 flex items-end justify-between gap-3">
      <div>
        <div className="text-lg md:text-xl font-semibold text-slate-900">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-slate-600">{subtitle}</div> : null}
      </div>
      {right}
    </div>
  );
}

function Pill({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 backdrop-blur">
      {icon}
      <span className="leading-none">{label}</span>
    </span>
  );
}

function StatCard({ icon, label, value, note }) {
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-900 text-white">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-slate-500">{label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {value}
          </div>
        </div>
      </div>
      {note ? <div className="mt-3 text-xs text-slate-500">{note}</div> : null}
      <div className="pointer-events-none mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/2 rounded-full bg-slate-900/20 transition group-hover:w-2/3" />
      </div>
    </div>
  );
}

function Badge({ children, tone = "neutral" }) {
  const cls =
    tone === "urgent"
      ? "bg-slate-900 text-white"
      : tone === "soft"
      ? "bg-white/90 text-slate-900 ring-1 ring-slate-200"
      : "bg-slate-50 text-slate-700 ring-1 ring-slate-200";

  return (
    <span className={cx("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold", cls)}>
      {children}
    </span>
  );
}

function CategoryCard({ c }) {
  const img = toAbsUrl(c?.image_url);
  return (
    <Link
      to={PATHS.CATEGORIES}
      className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
        <ImgCover src={img} alt={c?.name || ""} />
        <div className="absolute left-4 top-4">
          <Badge tone="soft">
            <IconTag className="h-4 w-4 text-slate-700" />
            Danh mục
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="truncate text-sm font-semibold text-slate-900">{c?.name || "Danh mục"}</div>
        <div className="mt-1 line-clamp-2 text-xs text-slate-500">
          {c?.description ? c.description : "Xem các tác phẩm trong danh mục."}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-slate-700">
          Khám phá
          <span className="h-5 w-5 grid place-items-center rounded-full bg-slate-900 text-white">→</span>
        </div>
      </div>
    </Link>
  );
}

function AuctionCard({ a, now, compact = false }) {
  const s = a?.sculpture || {};
  const seller = a?.seller || {};
  const title = s?.title || `Phiên #${a?.id}`;
  const img = toAbsUrl(s?.image_url);
  const endMs = getEndMs(a);
  const tl = timeLeft(endMs, now);

  const status = (a?.status || "OPEN").toUpperCase();
  const price = money(a?.current_price);
  const buyNow = a?.buy_now_price ? money(a?.buy_now_price) : null;

  return (
    <Link
      to={PATHS.AUCTION_DETAIL.replace(":id", a.id)}
      className={cx(
        "group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
        compact ? "min-w-[320px] snap-start" : ""
      )}
    >
      <div className={cx("relative w-full overflow-hidden bg-slate-100", compact ? "h-44" : "h-52")}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-transparent" />
        <ImgCover src={img} alt={title} />

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <Badge tone="soft">{status}</Badge>
          <Badge tone={tl.urgent ? "urgent" : "soft"}>
            <span className={cx("h-1.5 w-1.5 rounded-full", tl.urgent ? "bg-white" : "bg-slate-900")} />
            {tl.label}
          </Badge>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
          <Badge tone="soft">Giá: {price}</Badge>
          {buyNow ? <Badge tone="soft">Mua ngay: {buyNow}</Badge> : null}
        </div>
      </div>

      <div className="p-4">
        <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-1 truncate text-xs text-slate-500">
          Người đăng: {seller?.full_name || "—"}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs text-slate-600 ring-1 ring-slate-200">
            <IconHammer className="h-4 w-4 text-slate-600" />
            Bước: {money(a?.bid_step)}
          </span>

          {!compact ? (
            <span className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-medium text-white group-hover:bg-slate-800">
              Vào phiên →
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

function FeaturedAuction({ a, now }) {
  const s = a?.sculpture || {};
  const seller = a?.seller || {};
  const title = s?.title || `Phiên #${a?.id}`;
  const img = toAbsUrl(s?.image_url);
  const endMs = getEndMs(a);
  const tl = timeLeft(endMs, now);

  return (
    <Link
      to={PATHS.AUCTION_DETAIL.replace(":id", a.id)}
      className="group relative overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative h-[360px] w-full bg-slate-100">
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <ImgCover src={img} alt={title} />

        <div className="absolute left-5 right-5 bottom-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="soft">Nổi bật</Badge>
            <Badge tone={tl.urgent ? "urgent" : "soft"}>
              <IconClock className="h-4 w-4" />
              {tl.label}
            </Badge>
            <Badge tone="soft">{money(a?.current_price)}</Badge>
          </div>

          <div className="mt-3 text-2xl md:text-[28px] font-semibold tracking-tight text-white line-clamp-1">
            {title}
          </div>
          <div className="mt-1 text-sm text-white/80 line-clamp-1">
            Người đăng: {seller?.full_name || "—"}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-white/95 px-4 py-2.5 text-sm font-medium text-slate-900 ring-1 ring-white/30">
            Xem chi tiết
            <span className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
              Vào phiên →
            </span>
          </div>
        </div>

        <div className="pointer-events-none absolute right-5 top-5 rounded-2xl bg-white/10 px-3 py-2 text-xs text-white/80 ring-1 ring-white/15 backdrop-blur">
          Live countdown
        </div>
      </div>
    </Link>
  );
}

function StepCard({ icon, title, desc }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">{icon}</div>
      <div className="mt-4 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{desc}</div>
    </div>
  );
}

function SellerChip({ seller, count }) {
  const name = seller?.full_name || "User";
  const letter = String(name).trim().charAt(0).toUpperCase();
  return (
    <div className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-3 min-w-0">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white text-sm font-semibold">
          {letter}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">Nghệ sĩ / Người đăng</div>
        </div>
      </div>
      <span className="shrink-0 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
        {count} phiên
      </span>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Home() {
  const nav = useNavigate();
  const now = useNow(1000);

  const [q, setQ] = useState("");
  const [cats, setCats] = useState([]);
  const [openAuctions, setOpenAuctions] = useState([]);
  const [totalOpen, setTotalOpen] = useState(0);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setErr("");
      try {
        const [c, a] = await Promise.all([
          categoriesApi.list(),
          auctionsApi.list({ status: "OPEN", page: 1, limit: 50 }),
        ]);

        if (!alive) return;

        setCats((c || []).slice(0, 8));
        setOpenAuctions(a?.items || []);
        setTotalOpen(Number(a?.total || 0));
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Không tải được dữ liệu trang chủ");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const endingSoon = useMemo(() => {
    return [...openAuctions]
      .filter((x) => getEndMs(x) > 0)
      .sort((a, b) => getEndMs(a) - getEndMs(b))
      .slice(0, 10);
  }, [openAuctions]);

  const featured = useMemo(() => {
    if (endingSoon.length > 0) return endingSoon[0];
    return openAuctions[0] || null;
  }, [endingSoon, openAuctions]);

  const mosaic = useMemo(() => {
    const list = [...openAuctions].sort((a, b) => getCreatedMs(b) - getCreatedMs(a));
    return list.slice(0, 3);
  }, [openAuctions]);

  const trending = useMemo(() => {
    const score = (x) => Number(x?.current_price || 0) - Number(x?.start_price || 0);
    return [...openAuctions]
      .sort((a, b) => score(b) - score(a) || Number(b?.current_price || 0) - Number(a?.current_price || 0))
      .slice(0, 6);
  }, [openAuctions]);

  const topSellers = useMemo(() => {
    const m = new Map();
    for (const a of openAuctions) {
      const id = a?.seller?.id;
      if (!id) continue;
      const prev = m.get(id) || { seller: a.seller, n: 0 };
      prev.n += 1;
      m.set(id, prev);
    }
    return [...m.values()].sort((x, y) => y.n - x.n).slice(0, 4);
  }, [openAuctions]);

  const heroStats = useMemo(() => {
    const sellerCount = new Set(openAuctions.map((a) => a?.seller?.id).filter(Boolean)).size;
    return {
      open: totalOpen || openAuctions.length,
      categories: cats.length,
      ending: endingSoon.length,
      sellers: sellerCount,
    };
  }, [totalOpen, openAuctions.length, cats.length, endingSoon.length, openAuctions]);

  const quickTags = useMemo(() => ["Tượng gỗ", "Đồng", "Trừu tượng", "Đá", "Hiện đại"], []);

  function onSubmitSearch(e) {
    e.preventDefault();
    const s = q.trim();
    if (!s) {
      nav(PATHS.AUCTIONS);
      return;
    }
    nav(`${PATHS.AUCTIONS}?q=${encodeURIComponent(s)}`);
  }

  function goQuick(term) {
    nav(`${PATHS.AUCTIONS}?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-slate-200/40 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 h-[560px] w-[560px] rounded-full bg-slate-200/30 blur-3xl" />
        <div className="absolute -right-48 top-40 h-[560px] w-[560px] rounded-full bg-slate-200/25 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.55] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
          <div className="h-full w-full bg-[linear-gradient(to_right,rgba(15,23,42,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.05)_1px,transparent_1px)] bg-[size:36px_36px]" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[36px] border border-slate-200 bg-white shadow-sm">
          <div className="relative p-6 md:p-10">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
              {/* Left */}
              <div className="pt-1">
                <div className="flex flex-wrap gap-2">
                  <Pill icon={<IconHammer className="h-4 w-4" />} label="Minh bạch" />
                  <Pill icon={<IconClock className="h-4 w-4" />} label="Đếm ngược realtime" />
                  <Pill icon={<IconShield className="h-4 w-4" />} label="JWT + Role" />
                  <Pill icon={<IconTag className="h-4 w-4" />} label="Danh mục" />
                </div>

                <h1 className="mt-5 text-[28px] leading-[1.12] md:text-[44px] md:leading-[1.05] font-semibold tracking-tight text-slate-900">
                  DAUGIADIEUKHAC.VN
                </h1>

                <p className="mt-3 text-sm md:text-[15px] leading-6 text-slate-600 max-w-xl">
                  Trang chủ tối ưu cho quyết định nhanh: xem phiên nổi bật, ưu tiên sắp kết thúc, theo dõi giá và thời gian rõ ràng.
                </p>

                {/* Search */}
                <form onSubmit={onSubmitSearch} className="mt-6">
                  <div className="rounded-[28px] border border-slate-200 bg-white p-2 shadow-sm transition focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white">
                        <IconSearch className="h-5 w-5" />
                      </div>

                      <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="w-full bg-transparent px-2 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                        placeholder="Tìm theo tên tác phẩm, chất liệu, danh mục..."
                      />

                      <button
                        type="submit"
                        className="rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 active:scale-[0.99] transition"
                      >
                        Tìm
                      </button>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {quickTags.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => goQuick(t)}
                          className="rounded-full bg-white/80 px-3 py-1 text-xs text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                        >
                          {t}
                        </button>
                      ))}
                      <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-500 ring-1 ring-slate-200">
                        Tip: vào “Sắp kết thúc” để tránh lỡ phiên
                      </span>
                    </div>
                  </div>
                </form>

                {/* CTAs */}
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    to={PATHS.AUCTIONS}
                    className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 active:scale-[0.99] transition"
                  >
                    Xem phiên đấu giá →
                  </Link>
                  <Link
                    to={PATHS.CATEGORIES}
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 active:scale-[0.99] transition"
                  >
                    Xem danh mục
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <StatCard
                    icon={<IconHammer className="h-5 w-5" />}
                    label="Phiên đang mở"
                    value={heroStats.open}
                    note="Tổng phiên OPEN (server)"
                  />
                  <StatCard
                    icon={<IconClock className="h-5 w-5" />}
                    label="Sắp kết thúc"
                    value={heroStats.ending}
                    note="Sort theo end_time"
                  />
                  <StatCard
                    icon={<IconTag className="h-5 w-5" />}
                    label="Danh mục"
                    value={heroStats.categories}
                    note="Danh mục hiển thị"
                  />
                  <StatCard
                    icon={<IconSpark className="h-5 w-5" />}
                    label="Người đăng"
                    value={heroStats.sellers}
                    note="Theo seller trong OPEN"
                  />
                </div>
              </div>

              {/* Right */}
              <div className="grid gap-4">
                {loading ? (
                  <>
                    <Skeleton className="h-[360px] w-full" />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                      <Skeleton className="h-28 w-full" />
                    </div>
                  </>
                ) : featured ? (
                  <>
                    <FeaturedAuction a={featured} now={now} />

                    <div className="grid gap-4 sm:grid-cols-3">
                      {mosaic.map((a) => {
                        const s = a?.sculpture || {};
                        const img = toAbsUrl(s?.image_url);
                        const title = s?.title || `Phiên #${a?.id}`;
                        return (
                          <Link
                            key={a.id}
                            to={PATHS.AUCTION_DETAIL.replace(":id", a.id)}
                            className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <div className="relative h-28 bg-slate-100 overflow-hidden">
                              <ImgCover src={img} alt={title} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                            </div>
                            <div className="p-3">
                              <div className="truncate text-xs font-medium text-slate-900">{title}</div>
                              <div className="mt-1 text-[11px] text-slate-500 truncate">
                                Giá: {money(a?.current_price)}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
                    Chưa có phiên OPEN để hiển thị.
                  </div>
                )}

                {err ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <SectionHead
          title="Danh mục nổi bật"
          subtitle="Khám phá theo chủ đề"
          right={
            <Link to={PATHS.CATEGORIES} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Xem tất cả →
            </Link>
          }
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <Skeleton className="h-40 w-full rounded-none" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="mt-2 h-3 w-full" />
                    <Skeleton className="mt-2 h-3 w-4/5" />
                  </div>
                </div>
              ))
            : cats.map((c) => <CategoryCard key={c.id} c={c} />)}
        </div>

        {/* ENDING SOON */}
        <SectionHead
          title="Sắp kết thúc"
          subtitle="Ưu tiên theo thời gian kết thúc"
          right={
            <Link to={PATHS.AUCTIONS} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Xem tất cả →
            </Link>
          }
        />
        <div className="mt-4 flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory [scrollbar-width:thin]">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="min-w-[320px] snap-start">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-2 h-3 w-2/3" />
                    <Skeleton className="mt-4 h-6 w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : endingSoon.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
              Chưa có phiên OPEN hoặc thiếu end_time.
            </div>
          ) : (
            endingSoon.slice(0, 10).map((a) => <AuctionCard key={a.id} a={a} now={now} compact />)
          )}
        </div>

        {/* TRENDING */}
        <SectionHead
          title="Đang hot"
          subtitle="Tạm tính theo mức tăng giá hiện tại"
          right={
            <Link to={PATHS.AUCTIONS} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Xem tất cả →
            </Link>
          }
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                  <Skeleton className="h-52 w-full rounded-none" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="mt-2 h-3 w-2/3" />
                    <Skeleton className="mt-4 h-10 w-full" />
                  </div>
                </div>
              ))
            : trending.length === 0 ? (
                <div className="rounded-3xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 lg:col-span-3">
                  Chưa có dữ liệu.
                </div>
              )
            : trending.map((a) => <AuctionCard key={a.id} a={a} now={now} />)}
        </div>

        {/* OPEN AUCTIONS */}
        <SectionHead
          title="Phiên đang mở"
          subtitle="Danh sách phiên OPEN"
          right={
            <Link to={PATHS.AUCTIONS} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              Xem tất cả →
            </Link>
          }
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <Skeleton className="h-52 w-full rounded-none" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="mt-2 h-3 w-2/3" />
                  <Skeleton className="mt-4 h-10 w-full" />
                </div>
              </div>
            ))
          ) : openAuctions.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 lg:col-span-3">
              Hiện không có phiên OPEN.
            </div>
          ) : (
            openAuctions.slice(0, 12).map((a) => <AuctionCard key={a.id} a={a} now={now} />)
          )}
        </div>

        {/* TOP SELLERS */}
        <SectionHead title="Người đăng nổi bật" subtitle="Tạm thống kê theo số phiên OPEN" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[86px] w-full" />)
          ) : topSellers.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600 lg:col-span-4">
              Chưa có dữ liệu.
            </div>
          ) : (
            topSellers.map((x) => <SellerChip key={x.seller.id} seller={x.seller} count={x.n} />)
          )}
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-12">
          <div className="text-lg md:text-xl font-semibold text-slate-900">Cách hoạt động</div>
          <div className="mt-1 text-sm text-slate-600">Quy trình cơ bản từ xem đến chốt đơn</div>

          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <StepCard icon={<IconSearch className="h-6 w-6" />} title="Tìm tác phẩm / phiên" desc="Duyệt theo danh mục hoặc tìm theo tên tác phẩm." />
            <StepCard icon={<IconClock className="h-6 w-6" />} title="Theo dõi thời gian" desc="Ưu tiên mục “Sắp kết thúc” để ra quyết định nhanh." />
            <StepCard icon={<IconHammer className="h-6 w-6" />} title="Trả giá theo bước" desc="Giá hiện tại tăng theo bid_step, ghi nhận theo server." />
            <StepCard icon={<IconTruck className="h-6 w-6" />} title="Chốt đơn & giao nhận" desc="Khi phiên đóng: tạo đơn hàng, tiến hành thanh toán." />
          </div>
        </div>

        {/* TRUST */}
        <div className="mt-12 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm">
          <div className="p-6 md:p-10">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-1">
                <div className="text-lg md:text-xl font-semibold text-slate-900">Tại sao chọn nền tảng</div>
                <div className="mt-2 text-sm text-slate-600">
                  UI ưu tiên thông tin quyết định: thời gian, giá, bước giá. Ít thao tác, rõ ràng, nhanh.
                </div>
              </div>

              <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                    <IconShield className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-slate-900">Bảo mật cơ bản</div>
                  <div className="mt-2 text-sm text-slate-600">JWT, phân quyền, kiểm soát thao tác theo vai trò.</div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                    <IconClock className="h-6 w-6" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-slate-900">Tập trung thời gian</div>
                  <div className="mt-2 text-sm text-slate-600">Đếm ngược, ưu tiên “sắp kết thúc”, giảm lỡ phiên.</div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 md:col-span-2 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Tốc độ và rõ ràng</div>
                      <div className="mt-2 text-sm text-slate-600">
                        Thông tin đủ quyết định: giá hiện tại, bước giá, thời gian kết thúc.
                      </div>
                    </div>
                    <div className="grid h-14 w-14 place-items-center rounded-3xl bg-slate-900 text-white">
                      <IconSpark className="h-7 w-7" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
