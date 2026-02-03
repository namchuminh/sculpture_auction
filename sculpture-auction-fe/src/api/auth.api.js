import { http } from "./http";

export const authApi = {
    register({ email, password, full_name }) {
        return http("/auth/register", {
            method: "POST",
            body: { email, password, full_name },
        });
    },
    login({ email, password }) {
        return http("/auth/login", {
            method: "POST",
            body: { email, password },
        });
    },
};
