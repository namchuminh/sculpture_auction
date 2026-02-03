import { http } from "./http";

export const ordersApi = {
  my(params = {}) {
    const q = new URLSearchParams(params).toString();
    return http(`/orders/me${q ? `?${q}` : ""}`);
  },
  artist(params = {}) {
    const q = new URLSearchParams(params).toString();
    return http(`/orders/artist${q ? `?${q}` : ""}`);
  },
  admin(params = {}) {
    const q = new URLSearchParams(params).toString();
    return http(`/orders${q ? `?${q}` : ""}`);
  },
  detail(id) {
    return http(`/orders/${id}`);
  },
  updateShippingAddress(id, shipping_address) {
    return http(`/orders/${id}/shipping-address`, {
      method: "PATCH",
      body: { shipping_address },
    });
  },
  adminUpdateStatus(id, status) {
    return http(`/orders/${id}/status`, { method: "PATCH", body: { status } });
  },
};
