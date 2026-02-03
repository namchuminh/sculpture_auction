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

function normalizeList(data) {
  return {
    items: data?.items || [],
    total: Number(data?.total || 0),
    page: Number(data?.page || 1),
    limit: Number(data?.limit || 12),
  };
}

export const sculpturesApi = {
  list(params = {}) {
    return http(`/sculptures${buildQuery(params)}`).then(normalizeList);
  },
  detail(id) {
    return http(`/sculptures/${id}`);
  },
  create(formData) {
    return http(`/sculptures`, { method: "POST", body: formData });
  },
  update(id, formData) {
    return http(`/sculptures/${id}`, { method: "PUT", body: formData });
  },
  setStatus(id, status) {
    return http(`/sculptures/${id}/status`, { method: "PATCH", body: { status } });
  },
};
