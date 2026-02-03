// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { getAuth, setAuth, clearAuth } from "./storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(() => getAuth()); // { token, user }

    const value = useMemo(() => {
        const isAuthed = !!session?.token;
        const role = session?.user?.role || "";

        return {
            session,
            isAuthed,
            role,
            user: session?.user || null,
            login({ token, user }) {
                const next = { token, user };
                setAuth(next);
                setSession(next);
            },
            logout() {
                clearAuth();
                setSession({ token: "", user: null });
            },
        };
    }, [session]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
