import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff, ShieldCheck, UserCheck } from 'lucide-react';

interface Props {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const fillDemoUser = (type: 'admin' | 'customer') => {
        if (type === 'admin') {
            setData({
                email: 'admin@padelcourt.id',
                password: 'password',
                remember: true,
            });
        } else {
            setData({
                email: 'daffa@padelcourt.id',
                password: 'password',
                remember: true,
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#EDF2F7] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
            <Head title="Masuk ke Akun PadelCourt" />

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
                
                {/* LEFT COLUMN: 3D Illustration & Visual Feature (6 Cols on desktop) */}
                <div className="lg:col-span-6 bg-gradient-to-b from-[#E8F3FD] via-[#EEF6FE] to-[#E2EFFC] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-50">
                    
                    {/* Top Headline with Orange/Amber Highlights */}
                    <div className="relative z-10 max-w-md">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 leading-snug tracking-tight">
                            Main <span className="text-[#EA580C] font-extrabold">Padel</span> makin asik, cari & pesan lapangan <span className="text-[#EA580C] font-extrabold">tanpa ribet!</span>
                        </h2>
                    </div>

                    {/* Center 3D Padel Player Illustration */}
                    <div className="my-4 relative flex items-center justify-center">
                        <div className="relative w-full max-w-[360px] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white/90 bg-white group transform hover:scale-[1.02] transition-transform duration-500">
                            <img
                                src="/images/auth/padel_3d_player.jpg"
                                alt="3D Padel Player Illustration"
                                className="w-full h-full object-cover select-none"
                            />
                        </div>
                    </div>

                    {/* Bottom feature badges */}
                    <div className="relative z-10 flex items-center justify-center gap-3 pt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white shadow-xs">
                            <span className="text-amber-500">✨</span> Booking Instan
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white shadow-xs">
                            <span className="text-[#1877F2]">🛡️</span> 100% Terverifikasi
                        </span>
                    </div>

                </div>

                {/* RIGHT COLUMN: Clean Login Form (6 Cols on desktop) */}
                <div className="lg:col-span-6 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    
                    {/* Brand Logo on Top */}
                    <div className="text-center mb-6">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
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

                        <h1 className="text-2xl sm:text-[25px] font-bold text-neutral-900 mt-4 tracking-tight">
                            Selamat Datang
                        </h1>
                        <p className="text-sm text-neutral-500 mt-1">
                            Baru di PadelCourt?{' '}
                            <Link href={route('register')} className="text-[#1877F2] font-semibold hover:underline">
                                Daftar Gratis
                            </Link>
                        </p>
                    </div>

                    {status && (
                        <div className="mb-4 text-sm font-medium text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Contoh: email@example.com"
                                className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/10 text-sm outline-none transition-all placeholder:text-neutral-400 bg-white"
                                autoComplete="username"
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
                        </div>

                        {/* Password Input with Show/Hide Toggle */}
                        <div>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Masukkan kata sandi kamu"
                                    className="w-full px-4 py-3.5 rounded-xl border border-neutral-300 focus:border-[#1877F2] focus:ring-4 focus:ring-[#1877F2]/10 text-sm outline-none transition-all placeholder:text-neutral-400 pr-11 bg-white"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors p-1"
                                    aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
                        </div>

                        {/* Primary Submit Button */}
                        <div className="pt-1">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-[#1877F2] hover:bg-[#166FE5] active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    'Masuk'
                                )}
                            </button>
                        </div>

                        {/* Right-aligned Forgot Password Link (matching reference image) */}
                        {canResetPassword && (
                            <div className="text-right -mt-1">
                                <Link
                                    href={route('password.request')}
                                    className="text-xs text-[#1877F2] font-semibold hover:underline"
                                >
                                    Lupa kata sandi?
                                </Link>
                            </div>
                        )}

                        {/* Remember Me Checkbox */}
                        <div className="flex items-center pt-1">
                            <label className="flex items-center cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded text-[#1877F2] focus:ring-[#1877F2] h-4 w-4 border-neutral-300 cursor-pointer"
                                />
                                <span className="ml-2 text-xs text-neutral-600 font-medium">
                                    Ingat perangkat ini
                                </span>
                            </label>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-neutral-100 my-4" />

                        {/* Quick Demo Fillers */}
                        <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-center mb-2">
                                Akun Demo (Klik untuk Isi Instan):
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('customer')}
                                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-neutral-200 hover:border-[#1877F2] hover:text-[#1877F2] rounded-lg text-xs font-semibold text-neutral-700 transition-colors shadow-xs"
                                >
                                    <UserCheck size={13} className="text-[#1877F2]" />
                                    Customer Demo
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoUser('admin')}
                                    className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white border border-neutral-200 hover:border-amber-500 hover:text-amber-600 rounded-lg text-xs font-semibold text-neutral-700 transition-colors shadow-xs"
                                >
                                    <ShieldCheck size={13} className="text-amber-500" />
                                    Admin Demo
                                </button>
                            </div>
                        </div>

                        {/* Terms and Privacy Policy Note */}
                        <p className="text-[11px] text-neutral-400 text-center leading-relaxed pt-2">
                            Dengan melanjutkan, kamu menerima{' '}
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
