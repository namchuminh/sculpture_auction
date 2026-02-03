// src/routes/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { PATHS } from "./paths";

function IconFacebook(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={props.className}>
            <path
                d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v3H7v3h3v6h3v-6h3l1-3h-4v-3c0-.6.4-1 1-1Z"
                fill="currentColor"
            />
        </svg>
    );
}
function IconInstagram(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={props.className}>
            <path
                d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                stroke="currentColor"
                strokeWidth="1.6"
            />
            <path
                d="M17.5 6.5h.01"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
            />
        </svg>
    );
}
function IconYoutube(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={props.className}>
            <path
                d="M21 8.2s-.2-1.5-.9-2.2c-.8-.9-1.7-.9-2.1-1C15.1 4.8 12 4.8 12 4.8h0s-3.1 0-6 .2c-.4.1-1.3.1-2.1 1C3.2 6.7 3 8.2 3 8.2S2.8 10 2.8 11.8v.4C2.8 14 3 15.8 3 15.8s.2 1.5.9 2.2c.8.9 1.9.9 2.4 1 1.7.2 5.7.2 5.7.2s3.1 0 6-.2c.4-.1 1.3-.1 2.1-1 .7-.7.9-2.2.9-2.2s.2-1.8.2-3.6v-.4c0-1.8-.2-3.6-.2-3.6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
            />
            <path
                d="M10.2 9.3v5.4l5-2.7-5-2.7Z"
                fill="currentColor"
            />
        </svg>
    );
}

function Chip({ children }) {
    return (
        <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
            {children}
        </span>
    );
}

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-12">
            {/* Top gradient band */}
            <div className="bg-slate-950">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <div className="grid gap-8 md:grid-cols-2 md:items-center">
                        <div>
                            <div className="flex items-center gap-3">
                                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-950 text-sm font-extrabold">
                                    SA
                                </div>
                                <div>
                                    <div className="text-base font-extrabold text-white">
                                        sculpture_auction
                                    </div>
                                    <div className="text-sm text-white/70">
                                        Nền tảng đấu giá tác phẩm điêu khắc
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-white/70 max-w-xl">
                                Hỗ trợ đăng tác phẩm, mở phiên đấu giá, trả giá theo thời gian thực,
                                theo dõi phiên quan tâm và quản lý đơn hàng sau đấu giá.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Chip>#Đấu giá</Chip>
                                <Chip>#Điêu khắc</Chip>
                                <Chip>#Tác phẩm</Chip>
                                <Chip>#Rao bán</Chip>
                            </div>
                        </div>

                        {/* Contact card */}
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                            <div className="text-sm font-extrabold text-white">Liên hệ</div>
                            <div className="mt-4 grid gap-2 text-sm text-white/75">
                                <div className="flex items-center justify-between gap-4">
                                    <span>Hotline</span>
                                    <a className="font-semibold text-white" href="tel:19001234">
                                        1900 1234
                                    </a>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span>Email</span>
                                    <a
                                        className="font-semibold text-white"
                                        href="mailto:support@sculpture-auction.vn"
                                    >
                                        support@sculpture-auction.vn
                                    </a>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span>Giờ làm việc</span>
                                    <span className="font-semibold text-white">08:00–17:30 (T2–T7)</span>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-2">
                                <a
                                    href="#"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    aria-label="Facebook"
                                >
                                    <IconFacebook className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    aria-label="Instagram"
                                >
                                    <IconInstagram className="h-5 w-5" />
                                </a>
                                <a
                                    href="#"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                                    aria-label="YouTube"
                                >
                                    <IconYoutube className="h-5 w-5" />
                                </a>

                                <div className="ml-auto text-xs text-white/60">
                                    Hỗ trợ: 24/7 (ticket)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main footer */}
            <div className="border-t border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-10">
                    <div className="grid gap-10 md:grid-cols-4">
                        <div>
                            <div className="text-sm font-extrabold text-slate-900">Về nền tảng</div>
                            <p className="mt-3 text-sm text-slate-600">
                                Nền tảng phục vụ đấu giá tác phẩm điêu khắc. Quy trình: nghệ sĩ đăng tác phẩm
                                → tạo phiên đấu giá → người dùng trả giá → chốt phiên → tạo đơn hàng và thanh toán.
                            </p>
                            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                                Giá trả được ghi nhận theo thời điểm server. Trạng thái phiên/đơn hàng cập nhật theo nghiệp vụ.
                            </div>
                        </div>

                        <div>
                            <div className="text-sm font-extrabold text-slate-900">Liên kết</div>
                            <ul className="mt-4 space-y-2 text-sm">
                                <li>
                                    <Link className="text-slate-600 hover:text-slate-900" to={PATHS.HOME}>
                                        Trang chủ
                                    </Link>
                                </li>
                                <li>
                                    <Link className="text-slate-600 hover:text-slate-900" to={PATHS.CATEGORIES}>
                                        Danh mục
                                    </Link>
                                </li>
                                <li>
                                    <Link className="text-slate-600 hover:text-slate-900" to={PATHS.SCULPTURES}>
                                        Tác phẩm
                                    </Link>
                                </li>
                                <li>
                                    <Link className="text-slate-600 hover:text-slate-900" to={PATHS.AUCTIONS}>
                                        Phiên đấu giá
                                    </Link>
                                </li>
                                <li>
                                    <Link className="text-slate-600 hover:text-slate-900" to={PATHS.NOTIFICATIONS}>
                                        Thông báo
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <div className="text-sm font-extrabold text-slate-900">Chính sách</div>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                <li>Điều khoản sử dụng</li>
                                <li>Chính sách bảo mật</li>
                                <li>Quy chế đấu giá & hoàn tiền</li>
                                <li>Quy định đăng tác phẩm</li>
                                <li>Hướng dẫn thanh toán (VNPay/COD)</li>
                            </ul>
                        </div>

                        <div>
                            <div className="text-sm font-extrabold text-slate-900">Địa chỉ</div>
                            <div className="mt-4 space-y-2 text-sm text-slate-600">
                                <div>Trụ sở: Tầng 6, ArtSpace, 12 Nguyễn Huệ, Q1, TP. HCM</div>
                                <div>Kho trưng bày: 58 Lê Duẩn, Q1, TP. HCM</div>
                                <div>MST: 0312 345 678</div>
                            </div>

                            <div className="mt-5 grid gap-2">
                                <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs">
                                    <span className="text-slate-600">Thanh toán</span>
                                    <span className="font-semibold text-slate-900">Ngân hàng / COD</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col gap-3 border-t pt-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                        <div>© {year} sculpture_auction. All rights reserved.</div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                Version 1.0
                            </span>
                            <span className="text-slate-300">•</span>
                            <span>Web đấu giá</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
