import { http } from "./http";

function buildQuery(params = {}) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    const s = String(v).trim();
    if (s === "") return;
    sp.set(k, s);
  });
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export const usersApi = {
  me() {
    return http("/users/me");
  },
  list(params = {}) {
    return http(`/users${buildQuery(params)}`);
  },
  detail(id) {
    return http(`/users/${id}`);
  },
  setActive(id, is_active) {
    return http(`/users/${id}/active`, { method: "PATCH", body: { is_active } });
  },
  setRole(id, role) {
    return http(`/users/${id}/role`, { method: "PATCH", body: { role } });
  },
};
