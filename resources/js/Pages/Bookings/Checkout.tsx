import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CreditCard, Wallet, Building2, Phone, ChevronRight, Shield, Loader2, AlertCircle } from 'lucide-react';

interface Booking {
    id: number;
    booking_code: string;
    court?: { name: string; type: string; venue?: { name: string; city: string } } | null;
    venue?: { name: string; city: string } | null;
    date: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    subtotal: number;
    service_fee?: number;
    discount?: number;
    discount_amount?: number;
    total: number;
    promo?: { code: string } | null;
    status: string;
}

interface Props {
    booking: Booking;
}

const paymentMethods = [
    { id: 'bank_transfer', label: 'Transfer Bank', icon: Building2, desc: 'BCA, Mandiri, BNI, BRI' },
    { id: 'e_wallet', label: 'E-Wallet', icon: Wallet, desc: 'GoPay, OVO, Dana, ShopeePay' },
    { id: 'virtual_account', label: 'Virtual Account', icon: CreditCard, desc: 'Semua bank tersedia' },
    { id: 'cash', label: 'Bayar di Venue', icon: Phone, desc: 'Bayar langsung saat tiba' },
];

export default function BookingCheckout({ booking }: Props) {
    const [method, setMethod] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const venueName = booking.venue?.name || booking.court?.venue?.name || 'Padel Venue';
    const courtName = booking.court?.name || 'Court';

    const formatCurrency = (v: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v);
    const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const handlePay = (e: React.FormEvent) => {
        e.preventDefault();
        if (!method) { setError('Pilih metode pembayaran terlebih dahulu.'); return; }
        setSubmitting(true);
        router.post(route('bookings.pay', booking.booking_code), { payment_method: method }, {
            onError: () => setSubmitting(false),
            onFinish: () => setSubmitting(false),
        });
    };

    return (
        <AppLayout>
            <Head title={`Checkout — ${booking.booking_code}`} />

            <div className="container-app py-8 max-w-3xl">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                    <Link href={route('bookings.index')} className="hover:text-primary">Booking</Link>
                    <ChevronRight size={14} />
                    <span className="text-neutral-900 font-medium">Checkout</span>
                </nav>

                {/* Progress */}
                <div className="flex items-center justify-center gap-0 mb-8">
                    {[
                        { n: '1', label: 'Pilih Waktu', done: true },
                        { n: '2', label: 'Pembayaran', done: false, active: true },
                        { n: '3', label: 'Konfirmasi', done: false },
                    ].map((step, idx) => (
                        <React.Fragment key={step.n}>
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step.done ? 'bg-primary text-white' : step.active ? 'bg-primary text-white ring-4 ring-primary/20' : 'bg-neutral-200 text-neutral-500'}`}>
                                    {step.done ? '✓' : step.n}
                                </div>
                                <span className={`text-xs mt-1 ${step.active ? 'text-primary font-medium' : 'text-neutral-400'}`}>{step.label}</span>
                            </div>
                            {idx < 2 && <div className={`flex-1 h-0.5 mx-2 mb-4 ${step.done ? 'bg-primary' : 'bg-neutral-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handlePay} className="space-y-5">
                    {/* Booking summary */}
                    <div className="card p-5">
                        <h2 className="font-semibold text-neutral-900 mb-4">Detail Pesanan</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-neutral-600">
                                <span>Kode Booking</span>
                                <span className="font-mono font-semibold text-neutral-900">{booking.booking_code}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>Venue</span>
                                <span className="font-medium text-neutral-900">{venueName}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>Court</span>
                                <span className="font-medium text-neutral-900">{courtName}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>Tanggal</span>
                                <span className="font-medium text-neutral-900">{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex justify-between text-neutral-600">
                                <span>Waktu</span>
                                <span className="font-medium text-neutral-900">
                                    {booking.start_time.slice(0, 5)} — {booking.end_time.slice(0, 5)} WIB ({booking.duration_hours} jam)
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-neutral-100 mt-4 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-neutral-600">
                                <span>Subtotal</span>
                                <span>{formatCurrency(booking.subtotal)}</span>
                            </div>
                            {((booking.discount ?? booking.discount_amount ?? 0) > 0) && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Diskon {booking.promo ? `(${booking.promo.code})` : ''}</span>
                                    <span className="font-medium">-{formatCurrency(booking.discount ?? booking.discount_amount ?? 0)}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base pt-2 border-t border-neutral-100">
                                <span>Total Pembayaran</span>
                                <span className="text-primary">{formatCurrency(booking.total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment methods */}
                    <div className="card p-5">
                        <h2 className="font-semibold text-neutral-900 mb-4">Metode Pembayaran</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {paymentMethods.map(pm => {
                                const Icon = pm.icon;
                                return (
                                    <label
                                        key={pm.id}
                                        className={`flex items-center gap-3 p-3.5 rounded-lg border-2 cursor-pointer transition-all ${
                                            method === pm.id
                                                ? 'border-primary bg-primary-50'
                                                : 'border-neutral-200 hover:border-primary/40'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value={pm.id}
                                            checked={method === pm.id}
                                            onChange={() => { setMethod(pm.id); setError(''); }}
                                            className="sr-only"
                                        />
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${method === pm.id ? 'bg-primary' : 'bg-neutral-100'}`}>
                                            <Icon size={18} className={method === pm.id ? 'text-white' : 'text-neutral-500'} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{pm.label}</p>
                                            <p className="text-xs text-neutral-500">{pm.desc}</p>
                                        </div>
                                        {method === pm.id && (
                                            <div className="ml-auto w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                                                <span className="text-white text-xs">✓</span>
                                            </div>
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                                <AlertCircle size={15} /> {error}
                            </div>
                        )}
                    </div>

                    {/* Security note */}
                    <div className="flex items-center gap-2.5 text-sm text-neutral-500 bg-neutral-50 border border-neutral-200 rounded-lg p-3.5">
                        <Shield size={16} className="text-primary flex-shrink-0" />
                        <p>Pembayaran Anda dilindungi dengan enkripsi SSL 256-bit. Data Anda aman bersama kami.</p>
                    </div>

                    <button type="submit" disabled={submitting} className="btn-primary-lg w-full justify-center">
                        {submitting
                            ? <><Loader2 size={17} className="animate-spin" /> Memproses Pembayaran...</>
                            : `Bayar ${formatCurrency(booking.total)}`
                        }
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
