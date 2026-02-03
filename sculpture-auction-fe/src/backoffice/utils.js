export function fmtDate(v) {
  if (!v) return "-";
  try {
    const d = new Date(v);
    return d.toLocaleString("vi-VN");
  } catch {
    return String(v);
  }
}

export function fmtMoney(v) {
  const n = Number(v ?? 0);
  if (Number.isNaN(n)) return String(v);
  try {
    return n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });
  } catch {
    return n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + " ₫";
  }
}

export function toneForStatus(status) {
  const s = String(status || "").toUpperCase();
  if (["SUCCESS", "PAID", "COMPLETED", "SOLD"].includes(s)) return "green";
  if (["PENDING", "SCHEDULED"].includes(s)) return "yellow";
  if (["FAILED", "CANCELLED", "HIDDEN"].includes(s)) return "red";
  if (["OPEN", "SHIPPING", "PUBLISHED"].includes(s)) return "blue";
  return "slate";
}

export const ROLE_LABEL = {
  ADMIN: "Quản trị",
  ARTIST: "Tác giả",
  USER: "Người dùng",
};

export function labelRole(role) {
  const k = String(role || "").toUpperCase();
  return ROLE_LABEL[k] || k || "-";
}

/**
 * kind: "sculpture" | "auction" | "order" | "payment" | "generic"
 */
export function labelStatus(kind, status) {
  const s = String(status || "").toUpperCase();
  const k = String(kind || "generic").toLowerCase();

  const map = {
    generic: {
      ACTIVE: "Đang hoạt động",
      INACTIVE: "Ngưng hoạt động",
    },
    sculpture: {
      DRAFT: "Nháp",
      PUBLISHED: "Đã đăng",
      HIDDEN: "Đã ẩn",
      SOLD: "Đã bán",
    },
    auction: {
      SCHEDULED: "Đã lên lịch",
      OPEN: "Đang mở",
      CLOSED: "Đã kết thúc",
      CANCELLED: "Đã hủy",
    },
    order: {
      PENDING: "Chờ xử lý",
      PAID: "Đã thanh toán",
      SHIPPING: "Đang giao",
      COMPLETED: "Hoàn tất",
      CANCELLED: "Đã hủy",
    },
    payment: {
      PENDING: "Chờ thanh toán",
      SUCCESS: "Thành công",
      FAILED: "Thất bại",
    },
  };

  return (map[k] && map[k][s]) || (map.generic && map.generic[s]) || s || "-";
}

export const PAYMENT_METHOD_LABEL = {
  COD: "COD",
  BANK: "Chuyển khoản",
  MOMO: "MoMo",
  VNPAY: "VNPay",
  CARD: "Thẻ",
  CRYPTO: "Crypto",
};

export function labelPaymentMethod(method) {
  const m = String(method || "").toUpperCase();
  return PAYMENT_METHOD_LABEL[m] || m || "-";
}
