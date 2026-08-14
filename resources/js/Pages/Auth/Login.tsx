import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Mail, Lock, LogIn, ShieldAlert, User } from 'lucide-react';

interface Props {
    status?: string;
    canResetPassword?: boolean;
}

export default function Login({ status, canResetPassword }: Props) {
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
        <GuestLayout
            title="Masuk ke Akun PadelCourt"
            subtitle="Pesan lapangan dan kelola jadwal permainanmu"
        >
            <Head title="Masuk Akun" />

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                    {status}
                </div>
            )}

            {/* Quick Demo Fillers for testing */}
            <div className="mb-6 bg-neutral-50 border border-neutral-200 rounded-xl p-3.5">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    Akun Demo (Klik untuk Isi):
                </p>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => fillDemoUser('admin')}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-white border border-neutral-300 hover:border-primary hover:text-primary rounded-lg text-xs font-medium transition-colors shadow-sm"
                    >
                        <ShieldAlert size={13} className="text-amber-500" />
                        Admin Demo
                    </button>
                    <button
                        type="button"
                        onClick={() => fillDemoUser('customer')}
                        className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 bg-white border border-neutral-300 hover:border-primary hover:text-primary rounded-lg text-xs font-medium transition-colors shadow-sm"
                    >
                        <User size={13} className="text-primary" />
                        Customer Demo
                    </button>
                </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="form-label" htmlFor="email">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
                            className="form-input pl-9"
                            autoComplete="username"
                            required
                        />
                    </div>
                    {errors.email && <p className="form-error">{errors.email}</p>}
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label className="form-label mb-0" htmlFor="password">
                            Kata Sandi
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-primary hover:underline"
                            >
                                Lupa sandi?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className="form-input pl-9"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded text-primary focus:ring-primary h-4 w-4"
                        />
                        <span className="ml-2 text-xs text-neutral-600">Ingat saya di perangkat ini</span>
                    </label>
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary w-full py-3 justify-center text-sm font-semibold shadow-md"
                >
                    <LogIn size={16} />
                    {processing ? 'Memproses...' : 'Masuk ke Akun'}
                </button>

                <div className="text-center pt-2 text-xs text-neutral-500">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="text-primary font-semibold hover:underline">
                        Daftar Sekarang
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
