import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import { ConfirmModal, EmptyState, Pagination } from '@/Components/UI';
import { CalendarCheck, ChevronRight, Search, XCircle, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
    id: number;
    booking_code: string;
    venue_name: string;
    court_name: string;
    venue_city: string;
    venue_cover_image: string;
    date: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total: number;
    status: string;
    payment_status: string;
    can_cancel?: boolean;
    created_at: string;
}

interface Props {
    bookings?: {
        data: Booking[];
        total: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters?: { status?: string };
}

const tabs = [
    { key: '', label: 'Semua' },
    { key: 'pending', label: 'Menunggu Bayar' },
    { key: 'confirmed', label: 'Dikonfirmasi' },
    { key: 'completed', label: 'Selesai' },
    { key: 'cancelled', label: 'Dibatalkan' },
];

export default function BookingsIndex({
    bookings = { data: [], total: 0, last_page: 1, links: [] },
    filters = {}
}: Props) {
    const [cancelCode, setCancelCode] = useState<string | null>(null);
    const [cancelling, setCancelling] = useState(false);

    const activeTab = filters?.status || '';
    const bookingList = bookings?.data || [];
    const totalBookings = bookings?.total ?? bookingList.length;
    const lastPage = bookings?.last_page ?? 1;
    const links = bookings?.links || [];

    const handleCancel = () => {
        if (!cancelCode) return;
        setCancelling(true);
        router.post(route('bookings.cancel', cancelCode), {}, {
            onSuccess: () => {
                toast.success('Booking berhasil dibatalkan.');
                setCancelCode(null);
            },
            onError: (errs: any) => {
                toast.error(errs?.cancel || 'Gagal membatalkan booking.');
            },
            onFinish: () => setCancelling(false),
        });
    };

    return (
        <AppLayout>
            <Head title="Booking Saya" />

            <div className="bg-white border-b border-neutral-200">
                <div className="container-app py-6">
                    <h1 className="text-2xl font-bold text-neutral-900">Booking Saya</h1>
                    <p className="text-neutral-500 text-sm mt-1">{totalBookings} booking ditemukan</p>
                </div>
            </div>

            <div className="container-app py-6">
                {/* Tabs */}
                <div className="flex gap-1 bg-neutral-100 rounded-lg p-1 mb-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => router.get(route('bookings.index'), { status: tab.key || undefined }, { preserveState: true })}
                            className={`flex-shrink-0 text-sm px-3.5 py-2 rounded-md font-medium transition-all ${
                                activeTab === tab.key
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Booking list */}
                {bookingList.length > 0 ? (
                    <div className="space-y-3">
                        {bookingList.map(booking => (
                            <div key={booking.id} className="card p-4 md:p-5 hover:shadow-card-hover transition-shadow">
                                <div className="flex gap-4">
                                    {/* Venue image */}
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200">
                                        <img src={booking.venue_cover_image} alt="" className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-neutral-900 text-sm truncate">{booking.venue_name}</h3>
                                                <p className="text-xs text-neutral-500">{booking.court_name} · {booking.venue_city}</p>
                                            </div>
                                            <StatusBadge status={booking.status} size="sm" />
                                        </div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-600 mb-3">
                                            <span>
                                                📅 {new Date(booking.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </span>
                                            <span>⏰ {booking.start_time.slice(0, 5)} — {booking.end_time.slice(0, 5)}</span>
                                            <span>⏱ {booking.duration_hours} jam</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-primary">
                                                Rp {new Intl.NumberFormat('id-ID').format(booking.total)}
                                            </span>

                                            <div className="flex items-center gap-2">
                                                {booking.status === 'pending' && (
                                                    <Link href={route('bookings.checkout', booking.booking_code)} className="btn-primary text-xs py-1.5 px-3">
                                                        Bayar
                                                    </Link>
                                                )}
                                                {booking.can_cancel && (
                                                    <button onClick={() => setCancelCode(booking.booking_code)} className="text-xs text-red-500 hover:text-red-700 transition-colors">
                                                        Batalkan
                                                    </button>
                                                )}
                                                <Link href={route('bookings.show', booking.booking_code)} className="text-xs text-primary hover:underline flex items-center gap-1">
                                                    <Eye size={12} /> Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<CalendarCheck size={48} />}
                        title="Belum ada booking"
                        description="Ayo pesan lapangan padel favoritmu sekarang!"
                        action={<Link href={route('courts.index')} className="btn-primary">Cari Lapangan</Link>}
                    />
                )}

                {/* Pagination */}
                {lastPage > 1 && (
                    <Pagination links={links} className="mt-6" />
                )}
            </div>

            {/* Cancel confirm modal */}
            <ConfirmModal
                isOpen={!!cancelCode}
                title="Batalkan Booking?"
                message="Tindakan ini tidak dapat dibatalkan. Pastikan Anda yakin ingin membatalkan booking ini."
                confirmLabel={cancelling ? 'Membatalkan...' : 'Ya, Batalkan'}
                danger
                onConfirm={handleCancel}
                onCancel={() => setCancelCode(null)}
            />
        </AppLayout>
    );
}
