import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, UserPlus, Sparkles, ShieldCheck, Trophy, Bookmark, FileText, CheckCircle2 } from 'lucide-react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen bg-[#EEF2F6] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
            <Head title="Daftar Akun Baru — PadelCourt" />

            {/* Decorative Background Accents matching reference image */}
            <div className="absolute top-6 right-8 hidden md:flex gap-1.5 opacity-35 transform -rotate-12 select-none pointer-events-none" aria-hidden="true">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1.5 h-16 bg-[#1877F2] rounded-full" />
                ))}
            </div>

            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-[#1877F2]/10 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-10 right-10 hidden sm:block pointer-events-none" aria-hidden="true">
                <div className="w-4 h-4 rounded-full bg-[#1877F2] shadow-sm animate-pulse" />
                <svg className="w-48 h-48 -mr-10 -mb-10 text-orange-400/40" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
            </div>

            {/* Main Split Portal Card */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.07)] border border-slate-100/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 min-h-[640px]">
                
                {/* LEFT COLUMN: 3D Illustration & Community Highlights */}
                <div className="lg:col-span-5 bg-gradient-to-b from-[#E9F3FC] via-[#EEF5FD] to-[#E3EEFB] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-50">
                    
                    {/* Top Headline with Orange/Amber Highlights */}
                    <div className="relative z-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 leading-snug tracking-tight">
                            Mulai main dan temukan <span className="text-[#EA580C] font-extrabold">Komunitas Padel</span> terbaik di Indonesia!
                        </h2>
                    </div>

                    {/* Center 3D Showcase & Floating Tile Badges */}
                    <div className="my-6 lg:my-0 relative flex items-center justify-center">
                        
                        {/* Floating Top-Left 3D Tile */}
                        <div className="absolute -top-3 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] border border-white/90 transform -rotate-6">
                            <div className="w-9 h-9 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center shadow-inner">
                                <span className="text-xl">🎾</span>
                            </div>
                        </div>

                        {/* Floating Top-Right 3D Tile */}
                        <div className="absolute -top-2 right-2 sm:right-4 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] border border-white/90 transform rotate-6">
                            <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl flex items-center justify-center text-white shadow-md">
                                <Bookmark size={18} fill="currentColor" />
                            </div>
                        </div>

                        {/* Floating Bottom-Right 3D Tile */}
                        <div className="absolute -bottom-3 right-2 sm:right-6 z-20 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-[0_12px_24px_-8px_rgba(0,0,0,0.12)] border border-white/90 transform -rotate-6">
                            <div className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center text-emerald-700 shadow-inner">
                                <Trophy size={18} />
                            </div>
                        </div>

                        {/* Center Smartphone / Member Benefit Card */}
                        <div className="w-60 sm:w-64 bg-white rounded-3xl p-3.5 shadow-2xl border-4 border-white/90 ring-1 ring-black/5 relative z-10">
                            <div className="relative rounded-2xl overflow-hidden h-32 sm:h-36 bg-neutral-900 mb-3 shadow-inner">
                                <img
                                    src="/images/venues/padel_players_action.jpg"
                                    alt="Padel Players"
                                    className="w-full h-full object-cover opacity-90"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-900/20 to-transparent flex flex-col justify-end p-3 text-white">
                                    <p className="text-xs font-bold">Member Baru PadelCourt</p>
                                    <p className="text-[10px] text-amber-300 font-semibold">Bonus Voucher Rp50.000</p>
                                </div>
                            </div>

                            <div className="bg-neutral-50 rounded-2xl p-3 border border-neutral-100 space-y-1.5 text-[11px] text-neutral-600">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <CheckCircle2 size={13} className="text-emerald-500" />
                                    <span>Pesan 32+ Court Terbaik</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-medium">
                                    <CheckCircle2 size={13} className="text-emerald-500" />
                                    <span>Jadwal Real-Time & QR Pass</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Bottom feature badges */}
                    <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-white">
                            <Sparkles size={12} className="text-amber-500" /> Gratis Selamanya
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-neutral-600 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-white">
                            <ShieldCheck size={12} className="text-[#1877F2]" /> Data Terproteksi
                        </span>
                    </div>

                </div>

                {/* RIGHT COLUMN: Registration Form (7 Cols on desktop) */}
                <div className="lg:col-span-7 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    
                    {/* Brand Logo on Top */}
                    <div className="text-center mb-5">
                        <Link href="/" className="inline-flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-to-tr from-[#1877F2] to-blue-400 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="8" width="20" height="8" rx="1" stroke="white" strokeWidth="2" />
                                    <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="2" />
                                    <circle cx="12" cy="4" r="2.5" fill="white" />
                                    <path d="M7 16v3M17 16v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="font-extrabold text-2xl tracking-tight text-neutral-900 flex items-center">
                                Padel<span className="text-[#1877F2]">Court</span>
                            </span>
                        </Link>

                        <h1 className="text-2xl sm:text-[25px] font-bold text-neutral-900 mt-3 tracking-tight">
                            Buat Akun PadelCourt Baru
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Sudah memiliki akun?{' '}
                            <Link href={route('login')} className="text-[#1877F2] font-semibold hover:underline">
                                Masuk di Sini
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-3.5">
                        {/* Name Input */}
                        <div>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Nama Lengkap"
                                className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/10 text-sm outline-none transition-all placeholder:text-neutral-400 bg-white"
                                autoComplete="name"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
                        </div>

                        {/* Email & Phone grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Contoh: email@example.com"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/10 text-sm outline-none transition-all placeholder:text-neutral-400 bg-white"
                                    autoComplete="username"
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>

                            <div>
                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="No. WhatsApp / HP (08xx)"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/10 text-sm outline-none transition-all placeholder:text-neutral-400 bg-white"
                                    autoComplete="tel"
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
                            </div>
                        </div>

                        {/* Password & Confirm Password grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            <div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Kata Sandi (min. 8)"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/10 text-sm outline-none transition-all placeholder:text-neutral-400 pr-10 bg-white"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
                            </div>

                            <div>
                                <div className="relative">
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Ulangi Kata Sandi"
                                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/10 text-sm outline-none transition-all placeholder:text-neutral-400 pr-10 bg-white"
                                        autoComplete="new-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-500 text-xs mt-1 font-medium">{errors.password_confirmation}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-[#1877F2] hover:bg-[#166FE5] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Mendaftarkan...</span>
                                    </>
                                ) : (
                                    'Daftar Sekarang'
                                )}
                            </button>
                        </div>

                        {/* Terms and Privacy Policy Note */}
                        <p className="text-[11px] text-neutral-400 text-center leading-relaxed pt-2">
                            Dengan mendaftar, kamu menyetujui{' '}
                            <a href="#" className="text-[#1877F2] font-semibold hover:underline">
                                Syarat Penggunaan
                            </a>{' '}
                            dan{' '}
                            <a href="#" className="text-[#1877F2] font-semibold hover:underline">
                                Kebijakan Privasi
                            </a>{' '}
                            kami.
                        </p>
                    </form>
                </div>

            </div>
        </div>
    );
}
