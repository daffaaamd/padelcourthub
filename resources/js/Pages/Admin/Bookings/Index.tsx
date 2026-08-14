import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';
import { Pagination } from '@/Components/UI';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
    id: number;
    booking_code: string;
    user_name: string;
    user_email: string;
    venue_name: string;
    court_name: string;
    date: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    total: number;
    status: string;
    payment_status: string;
    payment_method: string;
    created_at: string;
}

interface Props {
    bookings: {
        data: Booking[];
        total: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: { status?: string; search?: string; date_from?: string; date_to?: string };
}

export default function AdminBookings({ bookings, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get(route('admin.bookings.index'), { search, status }, { preserveState: true });
    };

    const updateStatus = (id: number, newStatus: string) => {
        router.patch(route('admin.bookings.status', id), { status: newStatus }, {
            onSuccess: () => toast.success('Status diperbarui'),
            onError: () => toast.error('Gagal memperbarui status'),
        });
    };

    const fmt = (v: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v);

    return (
        <AdminLayout title="Manajemen Booking">
            <Head title="Admin — Booking" />

            {/* Filters */}
            <div className="card p-4 mb-5 flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="form-label">Cari</label>
                    <div className="relative">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters()}
                            placeholder="Kode booking, nama pelanggan..."
                            className="form-input pl-9 text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="form-label">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)} className="form-select text-sm">
                        <option value="">Semua Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
                <button onClick={applyFilters} className="btn-primary py-2.5">
                    <Filter size={15} /> Filter
                </button>
            </div>

            {/* Total */}
            <p className="text-sm text-neutral-500 mb-3">{bookings.total} booking ditemukan</p>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-neutral-50 border-b border-neutral-200">
                                {['Kode', 'Pelanggan', 'Venue · Court', 'Tanggal & Waktu', 'Total', 'Status', 'Aksi'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-neutral-500">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {bookings.data.map(b => (
                                <tr key={b.id} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <span className="font-mono text-xs text-primary font-semibold">{b.booking_code}</span>
                                        <p className="text-xs text-neutral-400 mt-0.5">{b.created_at}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="font-medium text-neutral-900">{b.user_name}</p>
                                        <p className="text-xs text-neutral-400">{b.user_email}</p>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="text-neutral-900">{b.venue_name}</p>
                                        <p className="text-xs text-neutral-400">{b.court_name}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-neutral-600 text-xs">
                                        <p>{b.date}</p>
                                        <p>{b.start_time} — {b.end_time} ({b.duration_hours}j)</p>
                                    </td>
                                    <td className="px-4 py-3.5 font-semibold text-neutral-900">{fmt(b.total)}</td>
                                    <td className="px-4 py-3.5">
                                        <StatusBadge status={b.status} size="sm" />
                                        <br />
                                        <StatusBadge status={b.payment_status} size="sm" />
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {b.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(b.id, 'confirmed')}
                                                className="text-xs text-emerald-600 hover:text-emerald-800 font-medium block"
                                            >
                                                Konfirmasi
                                            </button>
                                        )}
                                        {b.status === 'confirmed' && (
                                            <button
                                                onClick={() => updateStatus(b.id, 'completed')}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium block"
                                            >
                                                Selesai
                                            </button>
                                        )}
                                        {(b.status === 'pending' || b.status === 'confirmed') && (
                                            <button
                                                onClick={() => updateStatus(b.id, 'cancelled')}
                                                className="text-xs text-red-500 hover:text-red-700 font-medium block mt-1"
                                            >
                                                Batalkan
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {bookings.data.length === 0 && (
                        <div className="text-center py-12 text-neutral-400 text-sm">Tidak ada booking ditemukan.</div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {bookings.last_page > 1 && (
                <Pagination links={bookings.links} className="mt-4" />
            )}
        </AdminLayout>
    );
}
