// src/api/auctions.api.js
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

export const auctionsApi = {
    async list(params = {}) {
        const data = await http(`/auctions${buildQuery(params)}`);
        return normalizeList(data);
    },

    detail(id) {
        return http(`/auctions/${id}`);
    },

    // artist/admin
    myList() {
        return http(`/auctions/me/list`);
    },
    create(body) {
        return http(`/auctions`, { method: "POST", body });
    },
    updateScheduled(id, body) {
        return http(`/auctions/${id}`, { method: "PUT", body });
    },
    close(id) {
        return http(`/auctions/${id}/close`, { method: "POST" });
    },
    cancel(id) {
        return http(`/auctions/${id}/cancel`, { method: "PATCH" });
    },

    // giữ để không vỡ code cũ (nếu dự án có route bids riêng thì đổi lại sau)
    bid(auctionId, amount) {
        return http(`/auctions/${auctionId}/bids`, { method: "POST", body: { amount } });
    },
};
