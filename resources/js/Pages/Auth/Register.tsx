import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';

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
        <div className="min-h-screen bg-[#EDF2F7] flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
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
                <div className="lg:col-span-5 bg-gradient-to-b from-[#E8F3FD] via-[#EEF6FE] to-[#E2EFFC] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-50">
                    
                    {/* Top Headline with Orange/Amber Highlights */}
                    <div className="relative z-10">
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-800 leading-snug tracking-tight">
                            Mulai main dan temukan <span className="text-[#EA580C] font-extrabold">Komunitas Padel</span> terbaik di Indonesia!
                        </h2>
                    </div>

                    {/* Center 3D Padel Player Illustration */}
                    <div className="my-4 relative flex items-center justify-center">
                        <div className="relative w-full max-w-[300px] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white/90 bg-white group transform hover:scale-[1.02] transition-transform duration-500">
                            <img
                                src="/images/auth/padel_3d_player.jpg"
                                alt="3D Padel Player Illustration"
                                className="w-full h-full object-cover select-none"
                            />
                        </div>
                    </div>

                    {/* Bottom feature badges */}
                    <div className="relative z-10 flex items-center justify-center gap-2 pt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white shadow-xs">
                            <span className="text-amber-500">✨</span> Gratis Selamanya
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white shadow-xs">
                            <span className="text-[#1877F2]">🛡️</span> Data Terproteksi
                        </span>
                    </div>

                </div>

                {/* RIGHT COLUMN: Registration Form (7 Cols on desktop) */}
                <div className="lg:col-span-7 bg-white p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    
                    {/* Brand Logo on Top */}
                    <div className="text-center mb-5">
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
