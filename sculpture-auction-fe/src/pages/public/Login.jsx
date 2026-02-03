import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const nav = useNavigate();
    const { login } = useAuth();

    async function onSubmit(e) {
        e.preventDefault();
        if (loading) return;

        setErr("");
        setLoading(true);

        try {
            const res = await authApi.login({ email: email.trim(), password });
            login({ token: res.token, user: res.user }); // lưu localStorage + setState
            nav("/", { replace: true }); // không reload
        } catch (e2) {
            setErr(e2.message || "Đăng nhập thất bại");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mx-auto max-w-md px-4 py-10">
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                <h2 className="text-2xl font-semibold text-slate-900">Đăng nhập</h2>
                <p className="mt-1 text-sm text-slate-500">Đăng nhập để truy cập hệ thống.</p>

                {err && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {err}
                    </div>
                )}

                <form onSubmit={onSubmit} className="mt-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                            placeholder="Nhập email ..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                        <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                            placeholder="Nhập mật khẩu ..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <div className="text-center text-sm text-slate-600">
                        Chưa có tài khoản?{" "}
                        <Link className="font-medium text-slate-900 hover:underline" to="/register">
                            Đăng ký
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
