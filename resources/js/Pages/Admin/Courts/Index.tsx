import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';
import { ConfirmModal, Pagination } from '@/Components/UI';
import { TableProperties, Plus, Edit, Trash2, X, Save, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Court {
    id: number;
    name: string;
    type: 'indoor' | 'outdoor';
    status: string;
    cover_image_url: string;
    venue_name: string;
    venue_city: string;
    bookings_count: number;
    min_price: number;
}

interface VenueOption {
    id: number;
    name: string;
    city: string;
}

interface Props {
    courts: {
        data: Court[];
        total: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    venues: VenueOption[];
}

export default function AdminCourtsIndex({ courts, venues }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCourt, setEditingCourt] = useState<Court | null>(null);
    const [deletingCourt, setDeletingCourt] = useState<Court | null>(null);

    const form = useForm({
        venue_id: venues[0]?.id || '',
        name: '',
        type: 'indoor',
        description: '',
        cover_image: '',
        status: 'available',
    });

    const openCreateModal = () => {
        setEditingCourt(null);
        form.reset();
        form.setData({
            venue_id: venues[0]?.id || '',
            name: '',
            type: 'indoor',
            description: '',
            cover_image: '',
            status: 'available',
        });
        setModalOpen(true);
    };

    const openEditModal = (court: Court) => {
        setEditingCourt(court);
        form.setData({
            venue_id: '',
            name: court.name,
            type: court.type,
            description: '',
            cover_image: court.cover_image_url,
            status: court.status,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourt) {
            form.put(route('admin.courts.update', editingCourt.id), {
                onSuccess: () => {
                    toast.success('Court berhasil diperbarui!');
                    setModalOpen(false);
                },
                onError: () => toast.error('Silakan periksa form kembali.'),
            });
        } else {
            form.post(route('admin.courts.store'), {
                onSuccess: () => {
                    toast.success('Court berhasil ditambahkan!');
                    setModalOpen(false);
                },
                onError: () => toast.error('Silakan periksa form kembali.'),
            });
        }
    };

    const handleDelete = () => {
        if (!deletingCourt) return;
        router.delete(route('admin.courts.destroy', deletingCourt.id), {
            onSuccess: () => {
                toast.success('Court berhasil dinonaktifkan.');
                setDeletingCourt(null);
            },
            onError: () => toast.error('Gagal menonaktifkan court.'),
        });
    };

    const formatCurrency = (v: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v);

    return (
        <AdminLayout title="Manajemen Court (Lapangan)">
            <Head title="Admin — Manajemen Court" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">Daftar Court Lapangan</h1>
                    <p className="text-sm text-neutral-500">{courts.total} lapangan terdaftar</p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="btn-primary flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus size={16} /> Tambah Court
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Lapangan</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Venue</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Tipe</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Harga Mulai</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Total Booking</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Status</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {courts.data.map((court) => (
                                <tr key={court.id} className="hover:bg-neutral-50/80 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={court.cover_image_url || '/images/venues/padel_senayan_arena.jpg'}
                                                alt={court.name}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            />
                                            <div>
                                                <p className="font-semibold text-neutral-900">{court.name}</p>
                                                <p className="text-xs text-neutral-400">ID: #{court.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        <p className="font-medium text-neutral-900">{court.venue_name}</p>
                                        <p className="text-xs text-neutral-500">{court.venue_city}</p>
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                                court.type === 'indoor'
                                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                                            }`}
                                        >
                                            {court.type === 'indoor' ? 'Indoor' : 'Outdoor'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-semibold text-primary">
                                        {formatCurrency(court.min_price)}/jam
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-medium text-neutral-700">
                                        {court.bookings_count}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <StatusBadge status={court.status} size="sm" />
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEditModal(court)}
                                                className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit Court"
                                            >
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                onClick={() => setDeletingCourt(court)}
                                                className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Nonaktifkan Court"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {courts.data.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Belum ada court yang ditambahkan.
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {courts.last_page > 1 && (
                <Pagination links={courts.links} className="mt-4" />
            )}

            {/* Create/Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-slide-up">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                            <h3 className="font-bold text-neutral-900 text-base">
                                {editingCourt ? `Edit Court: ${editingCourt.name}` : 'Tambah Court Baru'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-neutral-400 hover:text-neutral-600 p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingCourt && (
                                <div>
                                    <label className="form-label">Venue Induk *</label>
                                    <select
                                        value={form.data.venue_id}
                                        onChange={(e) => form.setData('venue_id', e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">Pilih Venue</option>
                                        {venues.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.name} ({v.city})
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.venue_id && <p className="form-error">{form.errors.venue_id}</p>}
                                </div>
                            )}

                            <div>
                                <label className="form-label">Nama Lapangan / Court *</label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Contoh: Court 01 (Center Court)"
                                    className="form-input"
                                    required
                                />
                                {form.errors.name && <p className="form-error">{form.errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Tipe Court *</label>
                                    <select
                                        value={form.data.type}
                                        onChange={(e) => form.setData('type', e.target.value as any)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="indoor">Indoor (AC / Indoor)</option>
                                        <option value="outdoor">Outdoor (Terbuka)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label">Status *</label>
                                    <select
                                        value={form.data.status}
                                        onChange={(e) => form.setData('status', e.target.value)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="available">Tersedia (Available)</option>
                                        <option value="maintenance">Dalam Perawatan (Maintenance)</option>
                                        <option value="inactive">Nonaktif (Inactive)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Deskripsi Tambahan</label>
                                <input
                                    type="text"
                                    value={form.data.description}
                                    onChange={(e) => form.setData('description', e.target.value)}
                                    placeholder="Rumput sintetis Mondo Supercourt XN..."
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label className="form-label">URL Foto Court</label>
                                <input
                                    type="url"
                                    value={form.data.cover_image}
                                    onChange={(e) => form.setData('cover_image', e.target.value)}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="form-input"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="btn-outline text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="btn-primary text-sm flex items-center gap-1.5"
                                >
                                    <Save size={15} />
                                    {form.processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={!!deletingCourt}
                title="Nonaktifkan Court Lapangan?"
                message={`Apakah Anda yakin ingin menonaktifkan court "${deletingCourt?.name}"? Lapangan ini tidak akan dapat dibooking pemain.`}
                confirmLabel="Ya, Nonaktifkan"
                danger
                onConfirm={handleDelete}
                onCancel={() => setDeletingCourt(null)}
            />
        </AdminLayout>
    );
}
