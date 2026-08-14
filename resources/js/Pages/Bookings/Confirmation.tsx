import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { CheckCircle2, MapPin, Calendar, Clock, Download, ArrowRight, Home } from 'lucide-react';

interface Booking {
    booking_code: string;
    date: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total: number;
    status: string;
    payment?: { method_label?: string; status?: string } | null;
    court?: { name?: string; type?: string; venue?: { name?: string; city?: string; address?: string } } | null;
    venue?: { name?: string; city?: string; address?: string } | null;
    qr_code_url?: string;
}

interface Props {
    booking: Booking;
}

export default function BookingConfirmation({ booking }: Props) {
    const venueName = booking.venue?.name || booking.court?.venue?.name || 'Padel Venue';
    const venueCity = booking.venue?.city || booking.court?.venue?.city || '';
    const courtName = booking.court?.name || 'Court';
    const paymentMethod = booking.payment?.method_label || 'Transfer / Online';

    const formatCurrency = (v: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v);
    const formatDate = (d: string) => new Date(d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <AppLayout>
            <Head title="Booking Dikonfirmasi" />

            <div className="container-app py-10 max-w-xl">
                {/* Success header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
                        <CheckCircle2 size={44} className="text-emerald-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-2">Booking Berhasil!</h1>
                    <p className="text-neutral-500 text-sm">
                        Booking Anda telah dikonfirmasi. Silakan tunjukkan kode di bawah saat tiba di venue.
                    </p>
                </div>

                {/* Booking ticket */}
                <div className="bg-white rounded-xl shadow-panel border border-neutral-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-primary px-6 py-5 flex items-center justify-between">
                        <div>
                            <p className="text-white/70 text-xs mb-1">Kode Booking</p>
                            <p className="text-white font-mono font-bold text-2xl tracking-widest">{booking.booking_code}</p>
                        </div>
                        <div className="text-right">
                            <span className="bg-emerald-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full">Confirmed</span>
                        </div>
                    </div>

                    {/* Divider with dots */}
                    <div className="relative flex items-center justify-between px-0 -my-0">
                        <div className="w-5 h-5 rounded-full bg-surface-alt -ml-2.5 flex-shrink-0" />
                        <div className="flex-1 border-t-2 border-dashed border-neutral-200 mx-2" />
                        <div className="w-5 h-5 rounded-full bg-surface-alt -mr-2.5 flex-shrink-0" />
                    </div>

                    {/* Details */}
                    <div className="px-6 py-5 space-y-3.5">
                        <div className="flex items-start justify-between text-sm gap-3">
                            <span className="text-neutral-500 flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                                <MapPin size={14} className="text-primary" /> Venue
                            </span>
                            <span className="font-semibold text-neutral-900 text-right">
                                {venueName}
                                {venueCity && <span className="text-xs text-neutral-500 font-normal block mt-0.5">{venueCity}</span>}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Court</span>
                            <span className="font-semibold text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded text-xs">
                                {courtName}
                            </span>
                        </div>
                        <div className="flex items-start justify-between text-sm gap-3">
                            <span className="text-neutral-500 flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                                <Calendar size={14} className="text-primary" /> Tanggal
                            </span>
                            <span className="font-semibold text-neutral-900 text-right">{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500 flex items-center gap-1.5">
                                <Clock size={14} className="text-emerald-600" /> Waktu
                            </span>
                            <span className="font-semibold text-neutral-900">
                                {booking.start_time.slice(0, 5)} — {booking.end_time.slice(0, 5)} WIB
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Durasi</span>
                            <span className="font-semibold text-neutral-900">{booking.duration_hours} Jam</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-neutral-500">Pembayaran</span>
                            <span className="font-semibold text-neutral-900">{paymentMethod}</span>
                        </div>
                        <div className="border-t border-neutral-100 pt-3.5 flex items-center justify-between">
                            <span className="font-semibold text-neutral-900">Total Dibayar</span>
                            <span className="font-bold text-primary text-xl">{formatCurrency(booking.total)}</span>
                        </div>
                    </div>

                    {/* QR code */}
                    {booking.qr_code_url && (
                        <div className="border-t border-neutral-100 px-6 py-5 flex flex-col items-center">
                            <p className="text-xs text-neutral-500 mb-3">Tunjukkan QR code ini ke staff venue</p>
                            <img src={booking.qr_code_url} alt="QR Code" className="w-36 h-36 border border-neutral-200 rounded-lg p-1" />
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                    <Link href={route('bookings.show', booking.booking_code)} className="flex-1 btn-outline justify-center gap-2">
                        <Download size={16} /> Lihat Detail
                    </Link>
                    <Link href={route('home')} className="flex-1 btn-primary justify-center gap-2">
                        <Home size={16} /> Beranda
                    </Link>
                </div>

                {/* Info note */}
                <div className="mt-5 bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-amber-800 mb-1">Tips sebelum bermain</h4>
                    <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                        <li>Tiba 10 menit sebelum waktu bermain dimulai</li>
                        <li>Tunjukkan kode booking atau QR code ke staff</li>
                        <li>Bawa perlengkapan bermain yang diperlukan</li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
