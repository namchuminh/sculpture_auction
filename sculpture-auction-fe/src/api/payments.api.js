import { http } from "./http";

export const paymentsApi = {
  createForOrder(orderId, method) {
    return http(`/payments/orders/${orderId}`, {
      method: "POST",
      body: { method },
    });
  },
  listForOrder(orderId) {
    return http(`/payments/orders/${orderId}`);
  },
  listAll(params = {}) {
    const q = new URLSearchParams(params).toString();
    return http(`/payments${q ? `?${q}` : ""}`);
  },
  complete(id, status) {
    return http(`/payments/${id}/complete`, { method: "PATCH", body: { status } });
  },
};
