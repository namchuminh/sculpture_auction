import React, { useMemo, useState } from "react";
import { authApi } from "../../api/auth.api";

function isEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function strengthScore(v) {
    const s = v || "";
    let n = 0;
    if (s.length >= 6) n++;
    if (s.length >= 10) n++;
    if (/[A-Z]/.test(s)) n++;
    if (/[0-9]/.test(s)) n++;
    if (/[^A-Za-z0-9]/.test(s)) n++;
    return Math.min(n, 5);
}

export default function Register() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState(false);

    const v = useMemo(() => {
        const errors = [];
        if (!fullName.trim()) errors.push("Họ tên bắt buộc.");
        if (!email.trim() || !isEmail(email)) errors.push("Email không hợp lệ.");
        if ((password || "").length < 6) errors.push("Mật khẩu tối thiểu 6 ký tự.");
        return { ok: errors.length === 0, errors };
    }, [fullName, email, password]);

    const score = useMemo(() => strengthScore(password), [password]);
    const width = `${(score / 5) * 100}%`;
    const label = ["Rất yếu", "Yếu", "Trung bình", "Khá", "Mạnh", "Rất mạnh"][score];

    async function onSubmit(e) {
        e.preventDefault();
        if (!v.ok || loading) return;

        setErr("");
        setOk(false);
        setLoading(true);

        try {
            await authApi.register({
                email: email.trim(),
                password,
                full_name: fullName.trim(),
            });

            setOk(true);
            setTimeout(() => {
                window.location.href = "/login";
            }, 700);
        } catch (e2) {
            setErr(e2.message || "Đăng ký thất bại");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid items-center gap-8 lg:grid-cols-2">
                    {/* Left visual */}
                    <div className="hidden lg:block">
                        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-white shadow-2xl">
                            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
                            <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

                            <div className="relative">
                                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    Đăng ký tài khoản
                                </div>

                                <h1 className="mt-6 text-4xl font-semibold leading-tight">
                                    Tạo tài khoản
                                    <br />
                                    để tham gia đấu giá.
                                </h1>

                                <p className="mt-4 text-sm text-white/75">
                                    Quản lý hồ sơ, theo dõi tác phẩm và tham gia phiên đấu giá trực tiếp.
                                </p>

                                <div className="mt-10 grid grid-cols-2 gap-3 text-xs text-white/80">
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <div className="font-semibold text-white">Nhanh</div>
                                        <div className="mt-1">Đăng ký trong 1 phút</div>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <div className="font-semibold text-white">Bảo mật</div>
                                        <div className="mt-1">Mật khẩu tối thiểu 6 ký tự</div>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <div className="font-semibold text-white">Trực quan</div>
                                        <div className="mt-1">UI gọn, dễ dùng</div>
                                    </div>
                                    <div className="rounded-2xl bg-white/10 p-4">
                                        <div className="font-semibold text-white">Theo dõi</div>
                                        <div className="mt-1">Lưu phiên quan tâm</div>
                                    </div>
                                </div>

                                <div className="mt-12 rounded-2xl bg-white/10 p-5 text-sm text-white/80">
                                    Đã có tài khoản?{" "}
                                    <a href="/login" className="font-semibold text-white hover:underline">
                                        Đăng nhập
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right form */}
                    <div className="flex items-center">
                        <div className="w-full rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl">
                            <div>
                                <h2 className="text-2xl font-semibold text-slate-900">Đăng ký</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Nhập thông tin để tạo tài khoản mới.
                                </p>
                            </div>

                            {err && (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {err}
                                </div>
                            )}

                            {ok && (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    Đăng ký thành công. Đang chuyển hướng...
                                </div>
                            )}

                            {!ok && v.errors.length > 0 && (
                                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                    <ul className="list-disc pl-5">
                                        {v.errors.map((m, i) => (
                                            <li key={i}>{m}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Họ tên</label>
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Nhập họ tên ..."
                                        autoComplete="name"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Email</label>
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Nhập email ..."
                                        autoComplete="email"
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Mật khẩu</label>
                                    <div className="mt-2 flex gap-2">
                                        <input
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={show ? "text" : "password"}
                                            placeholder="••••••"
                                            autoComplete="new-password"
                                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShow((x) => !x)}
                                            className="shrink-0 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                                        >
                                            {show ? "Ẩn" : "Hiện"}
                                        </button>
                                    </div>

                                    <div className="mt-3">
                                        <div className="flex items-center justify-between text-xs text-slate-500">
                                            <span>Độ mạnh mật khẩu</span>
                                            <span className="font-medium text-slate-700">{label}</span>
                                        </div>
                                        <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-slate-900" style={{ width }} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={!v.ok || loading}
                                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? "Đang tạo..." : "Tạo tài khoản"}
                                </button>

                                <div className="text-center text-sm text-slate-600">
                                    Đã có tài khoản?{" "}
                                    <a href="/login" className="font-medium text-slate-900 hover:underline">
                                        Đăng nhập
                                    </a>
                                </div>
                            </form>

                            <div className="mt-6 text-xs text-slate-500">
                                Bằng việc đăng ký, bạn đồng ý với các điều khoản sử dụng.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
