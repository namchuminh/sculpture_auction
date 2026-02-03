import { http } from "./http";

export const reviewsApi = {
  list(params = {}) {
    const q = new URLSearchParams(params).toString();
    return http(`/reviews${q ? `?${q}` : ""}`);
  },
};
