// src/pages/user/Profile.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { http } from "../../api/http";

function toFormData(obj) {
    const fd = new FormData();
    Object.entries(obj).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        if (typeof v === "string" && v.trim() === "") return;
        fd.append(k, v);
    });
    return fd;
}

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [err, setErr] = useState("");
    const [ok, setOk] = useState("");

    const [user, setUser] = useState(null);

    // form fields
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [bio, setBio] = useState("");

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    const fileRef = useRef(null);

    const canSave = useMemo(() => {
        // allow partial update; require at least one change from empty? -> no, allow save anytime
        // but prevent saving while loading/saving
        return !loading && !saving;
    }, [loading, saving]);

    async function loadMe() {
        setErr("");
        setOk("");
        setLoading(true);
        try {
            const res = await http("/users/me"); // expected: { user: {...} }
            const u = res?.user || res;
            setUser(u);

            setFullName(u?.full_name || "");
            setPhone(u?.phone || "");
            setAddress(u?.address || "");
            setBio(u?.bio || "");
            setAvatarPreview(u?.avatar_url || "");
            setAvatarFile(null);
        } catch (e) {
            setErr(e.message || "Load failed");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadMe();
        // cleanup preview blob
        return () => {
            if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        };
    }, []);

    function onPickFile(f) {
        setOk("");
        setErr("");
        if (!f) return;

        setAvatarFile(f);

        // revoke old blob preview if any
        if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(URL.createObjectURL(f));
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!canSave) return;

        setErr("");
        setOk("");
        setSaving(true);

        try {
            // PUT /users/me using multipart/form-data as per screenshot
            const fd = toFormData({
                full_name: fullName,
                phone,
                address,
                bio,
                avatar: avatarFile, // file
            });

            const res = await http("/users/me", {
                method: "PUT",
                body: fd,
                headers: {}, // http() will not set JSON header when body is FormData (handled below)
            });

            // refresh UI with returned user OR refetch
            const u = res?.user || res?.data?.user || res?.data || res?.user || null;
            if (u) {
                setUser(u);
                setFullName(u?.full_name || fullName);
                setPhone(u?.phone || phone);
                setAddress(u?.address || address);
                setBio(u?.bio || bio);
                setAvatarPreview(u?.avatar_url || avatarPreview);
                setAvatarFile(null);
                if (fileRef.current) fileRef.current.value = "";
            } else {
                await loadMe();
            }

            setOk("Cập nhật thành công.");
        } catch (e2) {
            setErr(e2.message || "Update failed");
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left: profile card */}
                    <div className="lg:col-span-1">
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 border border-slate-200">
                                    {avatarPreview ? (
                                        <img
                                            alt="avatar"
                                            src={avatarPreview}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-400 text-sm">
                                            No avatar
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-lg font-semibold text-slate-900 truncate">
                                        {user?.full_name || "—"}
                                    </div>
                                    <div className="text-sm text-slate-500 truncate">{user?.email || "—"}</div>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-3 text-sm">
                                <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                                    <div className="text-slate-500">Role</div>
                                    <div className="font-medium text-slate-900">{user?.role || "—"}</div>
                                </div>
                                <div className="flex items-center justify-between rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
                                    <div className="text-slate-500">Status</div>
                                    <div className="font-medium text-slate-900">
                                        {user?.is_active ? "Active" : "Inactive"}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={loadMe}
                                disabled={loading}
                                className="mt-6 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                            >
                                {loading ? "Đang tải..." : "Tải lại"}
                            </button>
                        </div>
                    </div>

                    {/* Right: form */}
                    <div className="lg:col-span-2">
                        <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-slate-900">Hồ sơ cá nhân</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Cập nhật thông tin và ảnh đại diện.
                                    </p>
                                </div>
                            </div>

                            {err && (
                                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    {err}
                                </div>
                            )}

                            {ok && (
                                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                                    {ok}
                                </div>
                            )}

                            <form onSubmit={onSubmit} className="mt-6 space-y-5">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">
                                            Họ tên
                                        </label>
                                        <input
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                            placeholder="User One Updated"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700">
                                            Số điện thoại
                                        </label>
                                        <input
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                            placeholder="0900000000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700">
                                        Địa chỉ
                                    </label>
                                    <input
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                        placeholder="123 Nguyen Trai, Q1, HCM"
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Bio
                                        </label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={5}
                                            className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                                            placeholder="Collector of contemporary sculptures..."
                                        />
                                        <div className="mt-2 text-xs text-slate-500">
                                            {bio.length}/500
                                        </div>
                                    </div>

                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-slate-700">
                                            Ảnh đại diện
                                        </label>

                                        <div className="mt-2 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-14 w-14 overflow-hidden rounded-2xl bg-white border border-slate-200">
                                                    {avatarPreview ? (
                                                        <img
                                                            alt="avatar-preview"
                                                            src={avatarPreview}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
                                                            No img
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="text-sm font-medium text-slate-900 truncate">
                                                        {avatarFile ? avatarFile.name : "Chọn ảnh (jpg/png)"}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Tối ưu: ảnh vuông
                                                    </div>
                                                </div>
                                            </div>

                                            <input
                                                ref={fileRef}
                                                type="file"
                                                accept="image/*"
                                                className="mt-3 block w-full text-sm text-slate-700 file:mr-3 file:rounded-xl file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white file:text-sm file:font-medium hover:file:bg-slate-800"
                                                onChange={(e) => onPickFile(e.target.files?.[0])}
                                            />

                                            {avatarFile && (
                                                <button
                                                    type="button"
                                                    className="mt-3 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white"
                                                    onClick={() => {
                                                        setAvatarFile(null);
                                                        if (fileRef.current) fileRef.current.value = "";
                                                        // keep existing avatar_url preview if user has one
                                                        if (user?.avatar_url) {
                                                            if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
                                                            setAvatarPreview(user.avatar_url);
                                                        } else {
                                                            if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
                                                            setAvatarPreview("");
                                                        }
                                                    }}
                                                >
                                                    Bỏ chọn ảnh
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                                    <button
                                        type="button"
                                        disabled={loading || saving}
                                        onClick={() => {
                                            setErr("");
                                            setOk("");
                                            setFullName(user?.full_name || "");
                                            setPhone(user?.phone || "");
                                            setAddress(user?.address || "");
                                            setBio(user?.bio || "");
                                            setAvatarFile(null);
                                            if (fileRef.current) fileRef.current.value = "";
                                            if (avatarPreview && avatarPreview.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
                                            setAvatarPreview(user?.avatar_url || "");
                                        }}
                                        className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                    >
                                        Reset
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={!canSave}
                                        className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {saving ? "Đang lưu..." : "Cập nhật"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
