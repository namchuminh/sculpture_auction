// src/api/notifications.api.js
import { http } from "./http";

export async function fetchMyNotifications() {
  const data = await http("/notifications/me");
  return data?.notifications || [];
}

export async function markNotificationRead(id) {
  const data = await http(`/notifications/${id}/read`, { method: "PATCH" });
  return data?.notification || null;
}

export async function readAllNotifications() {
  return http("/notifications/me/read-all", { method: "PATCH" });
}
