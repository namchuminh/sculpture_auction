import { http } from "./http";

export const categoriesApi = {
  async list() {
    const data = await http("/categories");
    return data?.categories || [];
  },
  create(body) {
    return http("/categories", { method: "POST", body });
  },
  update(id, body) {
    return http(`/categories/${id}`, { method: "PUT", body });
  },
  remove(id) {
    return http(`/categories/${id}`, { method: "DELETE" });
  },
};
