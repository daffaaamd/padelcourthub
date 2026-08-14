import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import RatingStars from '@/Components/RatingStars';
import { ConfirmModal } from '@/Components/UI';
import {
    MapPin, Calendar, Clock, Download, ChevronRight,
    ArrowLeft, Shield, AlertTriangle, Star, CheckCircle, Printer, MessageSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
    id: number;
    booking_code: string;
    date: string;
    date_formatted: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    subtotal: number;
    service_fee: number;
    discount: number;
    total: number;
    status: string;
    notes?: string;
    can_cancel: boolean;
    can_review: boolean;
    has_review: boolean;
    court: {
        id: number;
        name: string;
        type: string;
        cover_image_url: string;
    } | null;
    venue: {
        name: string;
        slug: string;
        city: string;
        address: string;
        cover_image_url: string;
    } | null;
    payment: {
        method: string;
        method_label: string;
        status: string;
        paid_at?: string;
    } | null;
    promo: {
        code: string;
        name: string;
    } | null;
    created_at: string;
}

interface Props {
    booking: Booking;
}

export default function BookingShow({ booking }: Props) {
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);

    const reviewForm = useForm({
        rating: 5,
        comment: '',
    });

    const formatCurrency = (v: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v);

    const handleCancel = () => {
        setCancelling(true);
        router.post(route('bookings.cancel', booking.booking_code), {
            reason: cancelReason || undefined,
        }, {
            onSuccess: () => {
                setCancelModalOpen(false);
                toast.success('Booking berhasil dibatalkan.');
            },
            onError: (errs: any) => {
                toast.error(errs?.cancel || 'Gagal membatalkan booking.');
            },
            onFinish: () => setCancelling(false),
        });
    };

    const handleReviewSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        reviewForm.post(route('reviews.store', booking.booking_code), {
            onSuccess: () => {
                toast.success('Ulasan berhasil dikirim!');
            },
            onError: () => {
                toast.error('Gagal mengirim ulasan.');
            },
        });
    };

    const handlePrint = () => {
        window.print();
    };

    // QR Code URL based on booking code
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(booking.booking_code)}`;

    return (
        <AppLayout>
            <Head title={`Detail Booking #${booking.booking_code}`} />

            <div className="container-app py-8 max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center justify-between mb-6">
                    <nav className="flex items-center gap-2 text-sm text-neutral-500">
                        <Link href={route('bookings.index')} className="hover:text-primary flex items-center gap-1">
                            <ArrowLeft size={14} /> Riwayat Booking
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-neutral-900 font-medium">{booking.booking_code}</span>
                    </nav>

                    <button
                        onClick={handlePrint}
                        className="btn-outline text-xs py-2 px-3 flex items-center gap-1.5 print:hidden"
                    >
                        <Printer size={14} /> Cetak Bukti
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Ticket & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ticket Card */}
                    <div className="card overflow-hidden shadow-panel border border-neutral-100">
                        {/* Ticket Header */}
                        <div className="bg-primary text-white p-6 flex items-center justify-between">
                            <div>
                                <span className="text-xs uppercase tracking-wider text-primary-200 font-semibold">
                                    Tiket Booking Padel
                                </span>
                                <h1 className="text-2xl font-bold font-mono tracking-wider mt-0.5">
                                    {booking.booking_code}
                                </h1>
                            </div>
                            <div className="text-right">
                                <StatusBadge status={booking.status} />
                            </div>
                        </div>

                        {/* Venue & Court Summary */}
                        <div className="p-6 border-b border-neutral-100">
                            <div className="flex items-start gap-4">
                                <img
                                    src={booking.venue?.cover_image_url || '/images/venues/padel_senayan_arena.jpg'}
                                    alt={booking.venue?.name || 'Venue'}
                                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0 shadow-xs border border-neutral-100"
                                />
                                <div className="flex-1 min-w-0">
                                    <h2 className="text-lg font-bold text-neutral-900">{booking.venue?.name}</h2>
                                    <p className="text-sm text-neutral-500 flex items-center gap-1.5 mt-1">
                                        <MapPin size={14} className="text-primary flex-shrink-0" />
                                        <span>{booking.venue?.address}, {booking.venue?.city}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-2.5">
                                        <span className="text-xs font-semibold text-primary bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                                            {booking.court?.name}
                                        </span>
                                        <span className="text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md capitalize font-medium">
                                            {booking.court?.type} Court
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Schedule Info Cards */}
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 border-b border-neutral-100 bg-neutral-50/70">
                            <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-xs flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Calendar size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs text-neutral-500 font-medium block">Tanggal Bermain</span>
                                    <p className="text-sm font-semibold text-neutral-900 leading-snug mt-0.5">
                                        {booking.date_formatted}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-xs flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Clock size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs text-neutral-500 font-medium block">Jam Bermain</span>
                                    <p className="text-sm font-semibold text-neutral-900 leading-snug mt-0.5">
                                        {booking.start_time} - {booking.end_time} WIB
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-xs flex items-start gap-3">
                                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Clock size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs text-neutral-500 font-medium block">Durasi Main</span>
                                    <p className="text-sm font-semibold text-neutral-900 leading-snug mt-0.5">
                                        {booking.duration_hours} Jam
                                    </p>
                                </div>
                            </div>
                        </div>

                            {/* Payment Breakdown */}
                            <div className="p-6 space-y-3">
                                <h3 className="text-sm font-semibold text-neutral-900">Rincian Biaya</h3>
                                <div className="space-y-2 text-sm text-neutral-600">
                                    <div className="flex justify-between">
                                        <span>Biaya Sewa Lapangan ({booking.duration_hours} jam)</span>
                                        <span className="font-medium text-neutral-900">{formatCurrency(booking.subtotal)}</span>
                                    </div>
                                    {booking.service_fee > 0 && (
                                        <div className="flex justify-between">
                                            <span>Biaya Layanan</span>
                                            <span className="font-medium text-neutral-900">{formatCurrency(booking.service_fee)}</span>
                                        </div>
                                    )}
                                    {booking.discount > 0 && (
                                        <div className="flex justify-between text-emerald-600">
                                            <span>Diskon Promo {booking.promo ? `(${booking.promo.code})` : ''}</span>
                                            <span className="font-medium">-{formatCurrency(booking.discount)}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-neutral-200 pt-3 flex justify-between items-center text-base font-bold text-neutral-900">
                                        <span>Total Pembayaran</span>
                                        <span className="text-primary text-lg">{formatCurrency(booking.total)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Form (if completed and not yet reviewed) */}
                        {booking.can_review && !booking.has_review && (
                            <div className="card p-6 border-2 border-accent-100 bg-amber-50/20">
                                <div className="flex items-center gap-2 mb-3">
                                    <Star size={20} className="text-accent fill-accent" />
                                    <h3 className="font-bold text-neutral-900">Beri Ulasan Permainan</h3>
                                </div>
                                <p className="text-sm text-neutral-600 mb-4">
                                    Bagikan pengalamanmu bermain di {booking.venue?.name} untuk membantu pemain lain.
                                </p>

                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="form-label">Rating</label>
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => reviewForm.setData('rating', star)}
                                                    className="p-1 hover:scale-110 transition-transform focus:outline-none"
                                                >
                                                    <Star
                                                        size={24}
                                                        className={
                                                            star <= reviewForm.data.rating
                                                                ? 'text-amber-400 fill-amber-400'
                                                                : 'text-neutral-300'
                                                        }
                                                    />
                                                </button>
                                            ))}
                                            <span className="text-sm font-semibold text-neutral-700 ml-2">
                                                {reviewForm.data.rating} dari 5 Bintang
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label">Komentar & Pengalaman</label>
                                        <textarea
                                            value={reviewForm.data.comment}
                                            onChange={(e) => reviewForm.setData('comment', e.target.value)}
                                            placeholder="Ceritakan tentang kondisi lapangan, fasilitas, atau pelayanan di venue ini..."
                                            rows={3}
                                            className="form-input"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={reviewForm.processing}
                                        className="btn-primary"
                                    >
                                        {reviewForm.processing ? 'Mengirim...' : 'Kirim Ulasan'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {booking.has_review && (
                            <div className="card p-5 bg-emerald-50/50 border border-emerald-200 flex items-center gap-3">
                                <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-emerald-900">Ulasan Telah Dikirim</p>
                                    <p className="text-xs text-emerald-700">Terima kasih telah memberikan ulasan untuk booking ini.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar / Check-in QR & Actions */}
                    <div className="space-y-6">
                        {/* Check-in QR Card */}
                        <div className="card p-6 text-center">
                            <h3 className="font-bold text-neutral-900 text-sm mb-1">Check-in QR Code</h3>
                            <p className="text-xs text-neutral-500 mb-4">
                                Tunjukkan QR Code ini ke petugas saat tiba di lokasi.
                            </p>

                            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 inline-block mb-4">
                                <img
                                    src={qrUrl}
                                    alt={`QR Code ${booking.booking_code}`}
                                    className="w-40 h-40 object-contain mx-auto"
                                />
                            </div>

                            <p className="font-mono text-sm font-bold text-neutral-800 tracking-wider">
                                {booking.booking_code}
                            </p>
                        </div>

                        {/* Payment Status Card */}
                        <div className="card p-5 space-y-3">
                            <h3 className="font-semibold text-neutral-900 text-sm">Status Pembayaran</h3>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Metode</span>
                                <span className="font-medium text-neutral-900 capitalize">
                                    {booking.payment?.method_label || '-'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-500">Status</span>
                                <StatusBadge status={booking.payment?.status || 'pending'} size="sm" />
                            </div>
                            {booking.payment?.paid_at && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-neutral-500">Waktu Bayar</span>
                                    <span className="text-xs text-neutral-700">{booking.payment.paid_at}</span>
                                </div>
                            )}

                            {booking.status === 'pending' && (
                                <Link
                                    href={route('bookings.checkout', booking.booking_code)}
                                    className="btn-primary w-full justify-center mt-3 text-sm"
                                >
                                    Lanjutkan Pembayaran
                                </Link>
                            )}
                        </div>

                        {/* Cancellation Card */}
                        {booking.can_cancel && (
                            <div className="card p-5 border border-red-100">
                                <h3 className="font-semibold text-neutral-900 text-sm mb-1">Batalkan Booking</h3>
                                <p className="text-xs text-neutral-500 mb-3">
                                    Pembatalan dapat dilakukan sebelum waktu bermain dimulai.
                                </p>
                                <button
                                    onClick={() => setCancelModalOpen(true)}
                                    className="btn-outline text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 w-full justify-center text-xs"
                                >
                                    Batalkan Booking Ini
                                </button>
                            </div>
                        )}

                        {/* Need Help Card */}
                        <div className="card p-5 bg-neutral-50">
                            <div className="flex items-center gap-2 mb-2 text-neutral-900 font-semibold text-sm">
                                <Shield size={16} className="text-primary" />
                                Butuh Bantuan?
                            </div>
                            <p className="text-xs text-neutral-600 leading-relaxed">
                                Hubungi customer care kami melalui WhatsApp di +62 812-3456-7890 jika ada kendala seputar booking Anda.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Modal */}
            <ConfirmModal
                isOpen={cancelModalOpen}
                title="Batalkan Booking Lapangan?"
                message="Apakah Anda yakin ingin membatalkan booking ini? Slot yang dibatalkan akan dibuka kembali untuk pemain lain."
                confirmLabel={cancelling ? 'Membatalkan...' : 'Ya, Batalkan Booking'}
                danger
                onConfirm={handleCancel}
                onCancel={() => setCancelModalOpen(false)}
            />
        </AppLayout>
    );
}
