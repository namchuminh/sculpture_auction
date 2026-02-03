const KEY = "sa_auth";

export function setAuth({ token, user }) {
  localStorage.setItem(KEY, JSON.stringify({ token, user }));
}

export function getAuth() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { token: "", user: null };
  } catch {
    return { token: "", user: null };
  }
}

export function getToken() {
  return getAuth().token || "";
}

export function getUser() {
  return getAuth().user || null;
}

export function getRole() {
  return getAuth().user?.role || "";
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}
