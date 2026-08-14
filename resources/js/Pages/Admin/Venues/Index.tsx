import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ConfirmModal, Pagination } from '@/Components/UI';
import { Building2, Plus, Edit, Trash2, MapPin, Eye, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface Venue {
    id: number;
    name: string;
    slug: string;
    city: string;
    is_active: boolean;
    courts_count: number;
    bookings_count: number;
    reviews_count: number;
    cover_image_url: string;
    created_at: string;
}

interface Props {
    venues: {
        data: Venue[];
        total: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function AdminVenuesIndex({ venues }: Props) {
    const [deleteVenue, setDeleteVenue] = useState<Venue | null>(null);

    const handleDelete = () => {
        if (!deleteVenue) return;
        router.delete(route('admin.venues.destroy', deleteVenue.id), {
            onSuccess: () => {
                toast.success('Venue berhasil dinonaktifkan.');
                setDeleteVenue(null);
            },
            onError: () => {
                toast.error('Gagal menonaktifkan venue.');
            },
        });
    };

    return (
        <AdminLayout title="Manajemen Venue">
            <Head title="Admin — Manajemen Venue" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">Daftar Venue Padel</h1>
                    <p className="text-sm text-neutral-500">{venues.total} venue terdaftar di sistem</p>
                </div>

                <Link
                    href={route('admin.venues.create')}
                    className="btn-primary flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus size={16} /> Tambah Venue
                </Link>
            </div>

            {/* Table Card */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Venue</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Kota</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Court</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Booking</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Review</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Status</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {venues.data.map((venue) => (
                                <tr key={venue.id} className="hover:bg-neutral-50/80 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={venue.cover_image_url || '/images/venues/padel_senayan_arena.jpg'}
                                                alt={venue.name}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-neutral-900 truncate">{venue.name}</p>
                                                <p className="text-xs text-neutral-400">Dibuat: {venue.created_at}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 text-neutral-600">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={13} className="text-neutral-400" />
                                            {venue.city}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-semibold text-neutral-700">
                                        {venue.courts_count}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-semibold text-primary">
                                        {venue.bookings_count}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-neutral-600">
                                        {venue.reviews_count}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                                venue.is_active
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                            }`}
                                        >
                                            {venue.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link
                                                href={route('venues.show', venue.slug)}
                                                target="_blank"
                                                className="p-1.5 text-neutral-500 hover:text-primary hover:bg-neutral-100 rounded"
                                                title="Lihat Halaman Publik"
                                            >
                                                <Eye size={15} />
                                            </Link>
                                            <Link
                                                href={route('admin.venues.edit', venue.id)}
                                                className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit Venue"
                                            >
                                                <Edit size={15} />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteVenue(venue)}
                                                className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Nonaktifkan Venue"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {venues.data.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Belum ada venue yang ditambahkan.
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {venues.last_page > 1 && (
                <Pagination links={venues.links} className="mt-4" />
            )}

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={!!deleteVenue}
                title="Nonaktifkan Venue?"
                message={`Apakah Anda yakin ingin menonaktifkan venue "${deleteVenue?.name}"? Pelanggan tidak akan dapat melihat atau membooking di venue ini.`}
                confirmLabel="Ya, Nonaktifkan"
                danger
                onConfirm={handleDelete}
                onCancel={() => setDeleteVenue(null)}
            />
        </AdminLayout>
    );
}
