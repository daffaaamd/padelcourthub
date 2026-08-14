import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { User, Mail, Lock, Phone, UserPlus } from 'lucide-react';

export default function Register() {
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
        <GuestLayout
            title="Daftar Akun PadelCourt"
            subtitle="Mulai temukan dan booking lapangan padel terbaik"
        >
            <Head title="Daftar Akun Baru" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="form-label" htmlFor="name">
                        Nama Lengkap *
                    </label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Daffa Ahmad"
                            className="form-input pl-9"
                            autoComplete="name"
                            required
                        />
                    </div>
                    {errors.name && <p className="form-error">{errors.name}</p>}
                </div>

                <div>
                    <label className="form-label" htmlFor="email">
                        Alamat Email *
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
                    <label className="form-label" htmlFor="phone">
                        Nomor WhatsApp / HP
                    </label>
                    <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={data.phone}
                            onChange={(e) => setData('phone', e.target.value)}
                            placeholder="08123456789"
                            className="form-input pl-9"
                            autoComplete="tel"
                        />
                    </div>
                    {errors.phone && <p className="form-error">{errors.phone}</p>}
                </div>

                <div>
                    <label className="form-label" htmlFor="password">
                        Kata Sandi *
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
                            className="form-input pl-9"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    {errors.password && <p className="form-error">{errors.password}</p>}
                </div>

                <div>
                    <label className="form-label" htmlFor="password_confirmation">
                        Konfirmasi Kata Sandi *
                    </label>
                    <div className="relative">
                        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Ketik ulang kata sandi"
                            className="form-input pl-9"
                            autoComplete="new-password"
                            required
                        />
                    </div>
                    {errors.password_confirmation && (
                        <p className="form-error">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="btn-primary w-full py-3 justify-center text-sm font-semibold shadow-md"
                    >
                        <UserPlus size={16} />
                        {processing ? 'Mendaftarkan...' : 'Daftar Akun Sekarang'}
                    </button>
                </div>

                <div className="text-center pt-2 text-xs text-neutral-500">
                    Sudah memiliki akun?{' '}
                    <Link href={route('login')} className="text-primary font-semibold hover:underline">
                        Masuk di Sini
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
