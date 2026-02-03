// src/api/http.js
import { getToken } from "../auth/storage";

const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:3001";

export async function http(path, { method = "GET", body, headers } = {}) {
    const token = getToken();

    const isFormData =
        typeof FormData !== "undefined" && body instanceof FormData;

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(headers || {}),
        },
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });

    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text || null;
    }

    if (!res.ok) {
        const msg =
            (data && typeof data === "object" && (data.message || data.error)) ||
            (typeof data === "string" && data) ||
            `HTTP ${res.status}`;
        throw new Error(msg);
    }

    return data;
}
