import { http } from "./http";

export const sculptureImagesApi = {
  addMany(sculptureId, formData) {
    return http(`/sculpture-images/sculptures/${sculptureId}`, { method: "POST", body: formData });
  },
  update(id, body) {
    return http(`/sculpture-images/${id}`, { method: "PATCH", body });
  },
  remove(id) {
    return http(`/sculpture-images/${id}`, { method: "DELETE" });
  },
};
