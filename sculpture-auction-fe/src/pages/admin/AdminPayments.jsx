import React, { useEffect, useState } from "react";
import { paymentsApi } from "../../api/payments.api";
import { Badge, Button, Input, Select } from "../../backoffice/ui";
import { fmtDate, fmtMoney, toneForStatus } from "../../backoffice/utils";

export default function AdminPayments() {
  const [state, setState] = useState({ loading: true, error: "", items: [] });
  const [modal, setModal] = useState({ open: false, item: null, status: "SUCCESS", transaction_code: "" });

  async function load() {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const data = await paymentsApi.listAll();
      setState({ loading: false, error: "", items: data.payments || [] });
    } catch (e) {
      setState({ loading: false, error: e?.message || "Có lỗi xảy ra", items: [] });
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openComplete(p) {
    setModal({ open: true, item: p, status: "SUCCESS", transaction_code: p.transaction_code || "" });
  }

  async function complete() {
    await paymentsApi.complete(modal.item.id, modal.status);
    setModal({ open: false, item: null, status: "SUCCESS", transaction_code: "" });
    await load();
  }

  return (
    <div>
      <div className="text-xl font-bold text-slate-900">Thanh toán</div>
      <div className="mt-1 text-sm text-slate-600">Admin đối soát và hoàn tất SUCCESS/FAILED</div>

      {state.loading && <div className="mt-4 text-sm text-slate-600">Đang tải...</div>}
      {state.error && <div className="mt-4 text-sm text-rose-600">{state.error}</div>}

      <div className="mt-6 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">Mã</th>
              <th className="px-3 py-2">Đơn hàng</th>
              <th className="px-3 py-2">Phương thức</th>
              <th className="px-3 py-2">Số tiền</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Ngày tạo</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {state.items.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="px-3 py-2">#{p.id}</td>
                <td className="px-3 py-2">#{p.order_id}</td>
                <td className="px-3 py-2">{p.method}</td>
                <td className="px-3 py-2 font-semibold">{fmtMoney(p.amount)}</td>
                <td className="px-3 py-2">
                  <Badge tone={toneForStatus(p.status)}>{p.status}</Badge>
                </td>
                <td className="px-3 py-2">{fmtDate(p.createdAt)}</td>
                <td className="px-3 py-2">
                  <Button variant="secondary" onClick={() => openComplete(p)} disabled={p.status !== "PENDING"}>
                    Hoàn tất
                  </Button>
                </td>
              </tr>
            ))}

            {!state.items.length && !state.loading && (
              <tr>
                <td colSpan="7" className="px-3 py-6 text-center text-slate-500">
                  Chưa có giao dịch thanh toán
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-slate-900">Hoàn tất thanh toán #{modal.item.id}</div>
              <button
                className="rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-50"
                onClick={() => setModal({ open: false, item: null, status: "SUCCESS", transaction_code: "" })}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <div className="text-xs font-semibold text-slate-600">Trạng thái</div>
                <Select value={modal.status} onChange={(e) => setModal({ ...modal, status: e.target.value })}>
                  <option value="SUCCESS">Thành công (SUCCESS)</option>
                  <option value="FAILED">Thất bại (FAILED)</option>
                </Select>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-600">Mã giao dịch (không bắt buộc)</div>
                <Input
                  value={modal.transaction_code}
                  onChange={(e) => setModal({ ...modal, transaction_code: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setModal({ open: false, item: null, status: "SUCCESS", transaction_code: "" })}
                >
                  Hủy
                </Button>
                <Button onClick={complete}>Gửi</Button>
              </div>

              <div className="text-xs text-slate-500">
                Backend hiện tại chỉ cần status; transaction_code không bắt buộc.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
