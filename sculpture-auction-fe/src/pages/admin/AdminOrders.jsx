import React, { useEffect, useState } from "react";
import { ordersApi } from "../../api/orders.api";
import { Badge, Button, Select } from "../../backoffice/ui";
import { fmtDate, fmtMoney, toneForStatus } from "../../backoffice/utils";

export default function AdminOrders() {
  const [status, setStatus] = useState("");
  const [state, setState] = useState({ loading: true, error: "", items: [] });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await ordersApi.admin(status ? { status } : {});
      setState({ loading: false, error: "", items: data.orders || [] });
    } catch (e) {
      setState({ loading: false, error: e?.message || "Có lỗi xảy ra", items: [] });
    }
  }

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  async function updateStatus(orderId, next) {
    await ordersApi.adminUpdateStatus(orderId, next);
    await load();
  }

  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Đơn hàng</div>
      <div className="mt-1 text-sm text-slate-600">Admin quản lý trạng thái đơn hàng</div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Tất cả</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="SHIPPING">Đang vận chuyển</option>
          <option value="COMPLETED">Hoàn tất</option>
          <option value="CANCELLED">Đã hủy</option>
        </Select>
        <Button variant="secondary" onClick={load}>
          Áp dụng
        </Button>
      </div>

      {state.loading && <div className="mt-4 text-sm text-slate-600">Đang tải...</div>}
      {state.error && <div className="mt-4 text-sm text-rose-600">{state.error}</div>}

      <div className="mt-6 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Người mua</th>
              <th className="px-3 py-2">Tác phẩm</th>
              <th className="px-3 py-2">Số tiền</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Ngày tạo</th>
              <th className="px-3 py-2">Cập nhật</th>
            </tr>
          </thead>

          <tbody>
            {state.items.map((o) => (
              <tr key={o.id} className="border-b last:border-0">
                <td className="px-3 py-2">#{o.id}</td>
                <td className="px-3 py-2">{o.buyer?.full_name || "-"}</td>
                <td className="px-3 py-2">{o.sculpture?.title || o.sculpture_id}</td>
                <td className="px-3 py-2 font-semibold">{fmtMoney(o.amount)}</td>
                <td className="px-3 py-2">
                  <Badge tone={toneForStatus(o.status)}>{o.status}</Badge>
                </td>
                <td className="px-3 py-2">{fmtDate(o.createdAt)}</td>
                <td className="px-3 py-2">
                  <Select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="PAID">Đã thanh toán</option>
                    <option value="SHIPPING">Đang vận chuyển</option>
                    <option value="COMPLETED">Hoàn tất</option>
                    <option value="CANCELLED">Đã hủy</option>
                  </Select>
                </td>
              </tr>
            ))}

            {!state.items.length && !state.loading && (
              <tr>
                <td colSpan="7" className="px-3 py-6 text-center text-slate-500">
                  Chưa có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
