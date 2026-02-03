import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { PATHS } from "../../routes/paths";
import { ordersApi } from "../../api/orders.api";
import { paymentsApi } from "../../api/payments.api";

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

function paymentTone(s) {
  if (s === "SUCCESS") return "dark";
  if (s === "FAILED") return "soft";
  return "ring";
}

function methodLabel(m) {
  if (m === "COD") return "COD";
  if (m === "BANK_TRANSFER") return "Chuyển khoản";
  if (m === "CREDIT_CARD") return "Thẻ";
  return "Khác";
}

export default function Order() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [order, setOrder] = useState(null);
  const [payments, setPayments] = useState([]);

  const [shipping, setShipping] = useState("");
  const [shippingSaving, setShippingSaving] = useState(false);

  const [payMethod, setPayMethod] = useState("COD");
  const [payCreating, setPayCreating] = useState(false);

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      const res = await ordersApi.detail(id);
      const o = res?.order;
      setOrder(o || null);
      setShipping(o?.shipping_address || "");

      const payRes = await paymentsApi.listForOrder(id);
      setPayments(payRes?.payments || []);
    } catch (e) {
      setErr(e?.message || "Không tải được chi tiết đơn hàng");
      setOrder(null);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!alive) return;
      await loadAll();
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const sculpture = order?.sculpture || {};
  const auction = order?.auction || {};

  const img = toAbsUrl(sculpture?.image_url);

  const lastPayment = useMemo(() => payments?.[0] || null, [payments]);

  async function saveShipping() {
    const v = String(shipping || "").trim();
    if (!v) {
      setErr("Vui lòng nhập địa chỉ giao hàng");
      return;
    }
    setShippingSaving(true);
    setErr("");
    try {
      const res = await ordersApi.updateShippingAddress(id, v);
      setOrder(res?.order || order);
    } catch (e) {
      setErr(e?.message || "Cập nhật địa chỉ thất bại");
    } finally {
      setShippingSaving(false);
    }
  }

  async function createPayment() {
    setPayCreating(true);
    setErr("");
    try {
      await paymentsApi.createForOrder(id, payMethod);
      const payRes = await paymentsApi.listForOrder(id);
      setPayments(payRes?.payments || []);
      // order sẽ chuyển PAID khi admin complete; tạm thời chỉ hiển thị payments PENDING
    } catch (e) {
      setErr(e?.message || "Tạo thanh toán thất bại");
    } finally {
      setPayCreating(false);
    }
  }

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6">
              <Skeleton className="h-6 w-44" />
              <Skeleton className="mt-3 h-4 w-72" />
              <Skeleton className="mt-8 h-64 w-full" />
            </div>
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-6">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="mt-3 h-24 w-full" />
              <Skeleton className="mt-4 h-10 w-full" />
            </div>
          </div>
        ) : !order ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-sm text-slate-600">
            Không tìm thấy đơn hàng.
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="text-2xl font-semibold tracking-tight text-slate-900">
                  Đơn hàng #{order.id}
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Tạo lúc {fmtTime(order.createdAt)} • Cập nhật {fmtTime(order.updatedAt)}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                {lastPayment ? (
                  <Badge tone={paymentTone(lastPayment.status)}>
                    Thanh toán: {lastPayment.status}
                  </Badge>
                ) : (
                  <Badge tone="ring">Chưa có thanh toán</Badge>
                )}
              </div>
            </div>

            {err ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {err}
              </div>
            ) : null}

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {/* Left */}
              <div className="lg:col-span-2 space-y-4">
                {/* Artwork */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                  <div className="grid gap-0 md:grid-cols-5">
                    <div className="md:col-span-2 bg-slate-100">
                      {img ? (
                        <img src={img} alt={sculpture?.title || ""} className="h-64 w-full object-cover" />
                      ) : (
                        <div className="h-64 w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                      )}
                    </div>
                    <div className="md:col-span-3 p-6">
                      <div className="text-sm text-slate-500">Tác phẩm</div>
                      <div className="mt-1 text-lg font-semibold text-slate-900">
                        {sculpture?.title || "—"}
                      </div>
                      <div className="mt-2 text-sm text-slate-600 line-clamp-3">
                        {sculpture?.description || "—"}
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="text-[11px] text-slate-500">Tổng tiền</div>
                          <div className="mt-1 text-lg font-semibold text-slate-900">
                            {money(order.total_amount)}
                          </div>
                        </div>
                        <div className="rounded-2xl bg-slate-50 p-4">
                          <div className="text-[11px] text-slate-500">Phiên đấu giá</div>
                          <div className="mt-1 text-sm font-medium text-slate-900">#{order.auction_id}</div>
                          <div className="mt-2">
                            <Link
                              to={PATHS.AUCTION_DETAIL.replace(":id", order.auction_id)}
                              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                            >
                              Mở phiên
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Badge tone="ring">Auction status: {auction?.status || "—"}</Badge>
                        <Badge tone="ring">Giá: {money(auction?.current_price)}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">Giao hàng</div>
                      <div className="mt-1 text-sm text-slate-600">
                        Chỉ cập nhật khi đơn đang ở trạng thái PENDING.
                      </div>
                    </div>
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium text-slate-700">Địa chỉ giao hàng</label>
                    <textarea
                      value={shipping}
                      onChange={(e) => setShipping(e.target.value)}
                      disabled={order.status !== "PENDING"}
                      rows={3}
                      className={cx(
                        "mt-2 w-full rounded-2xl bg-white p-3 text-sm text-slate-900 ring-1 ring-slate-200 focus:outline-none",
                        order.status !== "PENDING" ? "bg-slate-50 text-slate-600" : ""
                      )}
                      placeholder="Nhập địa chỉ giao hàng…"
                    />
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={saveShipping}
                      disabled={order.status !== "PENDING" || shippingSaving}
                      className={cx(
                        "rounded-2xl px-4 py-2.5 text-sm font-medium",
                        order.status !== "PENDING" || shippingSaving
                          ? "bg-slate-100 text-slate-400"
                          : "bg-slate-900 text-white hover:bg-slate-800"
                      )}
                    >
                      {shippingSaving ? "Đang lưu…" : "Lưu địa chỉ"}
                    </button>
                    <div className="text-xs text-slate-500">
                      Hiện tại: {order.shipping_address || "—"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="space-y-4">
                {/* Payment */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-lg font-semibold text-slate-900">Thanh toán</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Tạo bản ghi thanh toán cho đơn hàng. Trạng thái SUCCESS/FAILED do hệ thống/admin cập nhật.
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                    <div className="text-[11px] text-slate-500">Số tiền</div>
                    <div className="mt-1 text-lg font-semibold text-slate-900">{money(order.total_amount)}</div>
                  </div>

                  <div className="mt-4">
                    <div className="text-sm font-medium text-slate-700">Phương thức</div>
                    <div className="mt-2 grid gap-2">
                      {["COD", "BANK_TRANSFER"].map((m) => (
                        <label
                          key={m}
                          className={cx(
                            "flex cursor-pointer items-center justify-between rounded-2xl bg-white px-3 py-2.5 ring-1 ring-slate-200",
                            payMethod === m ? "ring-slate-900" : ""
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="payMethod"
                              value={m}
                              checked={payMethod === m}
                              onChange={() => setPayMethod(m)}
                              className="h-4 w-4"
                            />
                            <div className="text-sm text-slate-900">{methodLabel(m)}</div>
                          </div>
                          <Badge tone="ring">{m}</Badge>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={createPayment}
                    disabled={payCreating}
                    className={cx(
                      "mt-4 inline-flex w-full items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium",
                      payCreating ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                  >
                    {payCreating ? "Đang tạo…" : "Tạo thanh toán"}
                  </button>

                  <div className="mt-4 text-xs text-slate-500">
                    Gợi ý:
                    <div className="mt-1">
                      • COD: chờ giao/đối soát. • Chuyển khoản/Thẻ: chờ xác nhận giao dịch.
                    </div>
                  </div>
                </div>

                {/* Payments history */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-lg font-semibold text-slate-900">Lịch sử thanh toán</div>
                      <div className="mt-1 text-sm text-slate-600">Mới nhất ở trên.</div>
                    </div>
                    <Badge tone="ring">{payments.length}</Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {payments.length === 0 ? (
                      <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                        Chưa có bản ghi thanh toán.
                      </div>
                    ) : (
                      payments.map((p) => (
                        <div key={p.id} className="rounded-2xl bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900">
                                {methodLabel(p.method)} • {money(p.amount)}
                              </div>
                              <div className="mt-1 text-xs text-slate-500">
                                Tạo lúc {fmtTime(p.createdAt)}
                                {p.paid_at ? ` • Paid: ${fmtTime(p.paid_at)}` : ""}
                              </div>
                              {p.transaction_code ? (
                                <div className="mt-1 text-xs text-slate-600">
                                  Mã giao dịch: <span className="font-medium">{p.transaction_code}</span>
                                </div>
                              ) : null}
                            </div>
                            <Badge tone={paymentTone(p.status)}>{p.status}</Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Quick links */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-sm font-medium text-slate-900">Liên kết nhanh</div>
                  <div className="mt-3 grid gap-2">
                    <Link
                      to={PATHS.ORDERS}
                      className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Quay lại danh sách đơn
                    </Link>
                    <Link
                      to={PATHS.AUCTIONS}
                      className="rounded-2xl bg-white px-4 py-2.5 text-sm font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      Xem đấu giá
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
