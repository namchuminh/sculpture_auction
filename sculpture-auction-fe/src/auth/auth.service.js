import { setAuth, clearAuth, getToken, getRole, getUser } from "./storage";

export const authService = {
    setSession({ token, user }) {
        setAuth({ token, user });
    },
    logout() {
        clearAuth();
    },
    isAuthed() {
        return !!getToken();
    },
    role() {
        return getRole();
    },
    user() {
        return getUser();
    },
};
