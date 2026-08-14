import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ConfirmModal, Pagination } from '@/Components/UI';
import { Tag, Plus, Edit, Trash2, X, Save, Calendar, CheckCircle2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

interface Promo {
    id: number;
    code: string;
    name: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_transaction: number;
    used_count: number;
    max_uses: number | null;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
    is_valid: boolean;
}

interface Props {
    promos: {
        data: Promo[];
        total: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function AdminPromosIndex({ promos }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
    const [deletingPromo, setDeletingPromo] = useState<Promo | null>(null);

    const today = new Date().toISOString().split('T')[0];
    const nextMonth = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const form = useForm({
        code: '',
        name: '',
        description: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: 10,
        max_discount: null as number | null,
        min_transaction: 100000,
        max_uses: null as number | null,
        max_uses_per_user: 1,
        valid_from: today,
        valid_until: nextMonth,
        is_active: true,
    });

    const openCreateModal = () => {
        setEditingPromo(null);
        form.reset();
        form.setData({
            code: '',
            name: '',
            description: '',
            type: 'percentage',
            value: 20,
            max_discount: 50000,
            min_transaction: 100000,
            max_uses: 100,
            max_uses_per_user: 1,
            valid_from: today,
            valid_until: nextMonth,
            is_active: true,
        });
        setModalOpen(true);
    };

    const openEditModal = (promo: Promo) => {
        setEditingPromo(promo);
        form.setData({
            code: promo.code,
            name: promo.name,
            description: '',
            type: promo.type,
            value: promo.value,
            max_discount: null,
            min_transaction: promo.min_transaction,
            max_uses: promo.max_uses,
            max_uses_per_user: 1,
            valid_from: today,
            valid_until: nextMonth,
            is_active: promo.is_active,
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPromo) {
            form.put(route('admin.promos.update', editingPromo.id), {
                onSuccess: () => {
                    toast.success('Promo berhasil diperbarui!');
                    setModalOpen(false);
                },
                onError: () => toast.error('Silakan periksa form kembali.'),
            });
        } else {
            form.post(route('admin.promos.store'), {
                onSuccess: () => {
                    toast.success('Promo berhasil dibuat!');
                    setModalOpen(false);
                },
                onError: () => toast.error('Silakan periksa form kembali.'),
            });
        }
    };

    const handleDelete = () => {
        if (!deletingPromo) return;
        router.delete(route('admin.promos.destroy', deletingPromo.id), {
            onSuccess: () => {
                toast.success('Promo dinonaktifkan.');
                setDeletingPromo(null);
            },
            onError: () => toast.error('Gagal menonaktifkan promo.'),
        });
    };

    const formatValue = (p: Promo) =>
        p.type === 'percentage'
            ? `${p.value}%`
            : 'Rp ' + new Intl.NumberFormat('id-ID').format(p.value);

    return (
        <AdminLayout title="Manajemen Promo & Diskon">
            <Head title="Admin — Manajemen Promo" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">Daftar Kode Promo</h1>
                    <p className="text-sm text-neutral-500">{promos.total} voucher promo terdaftar</p>
                </div>

                <button
                    onClick={openCreateModal}
                    className="btn-primary flex items-center gap-1.5 self-start sm:self-auto"
                >
                    <Plus size={16} /> Buat Promo Baru
                </button>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Kode Promo</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Nama Promo</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Nilai Diskon</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Min. Transaksi</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Penggunaan</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Periode</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Status</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {promos.data.map((promo) => (
                                <tr key={promo.id} className="hover:bg-neutral-50/80 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <span className="font-mono font-bold text-sm bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded">
                                            {promo.code}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 font-medium text-neutral-900">{promo.name}</td>
                                    <td className="px-4 py-3.5 text-center font-bold text-primary">
                                        {formatValue(promo)}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-neutral-600">
                                        Rp {new Intl.NumberFormat('id-ID').format(promo.min_transaction)}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span className="font-semibold text-neutral-800">{promo.used_count}</span>
                                        {promo.max_uses ? (
                                            <span className="text-neutral-400"> / {promo.max_uses}</span>
                                        ) : (
                                            <span className="text-neutral-400"> / ∞</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-xs text-neutral-500">
                                        {promo.valid_from} - {promo.valid_until}
                                    </td>
                                    <td className="px-4 py-3.5 text-center">
                                        <span
                                            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                                                promo.is_valid
                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                    : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                                            }`}
                                        >
                                            {promo.is_valid ? 'Aktif' : 'Nonaktif / Expired'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                onClick={() => openEditModal(promo)}
                                                className="p-1.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit Promo"
                                            >
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                onClick={() => setDeletingPromo(promo)}
                                                className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Nonaktifkan Promo"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {promos.data.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Belum ada promo yang dibuat.
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {promos.last_page > 1 && (
                <Pagination links={promos.links} className="mt-4" />
            )}

            {/* Create / Edit Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                            <h3 className="font-bold text-neutral-900 text-base">
                                {editingPromo ? `Edit Promo: ${editingPromo.code}` : 'Buat Kode Promo Baru'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-neutral-400 hover:text-neutral-600 p-1"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!editingPromo && (
                                <div>
                                    <label className="form-label">Kode Voucher (Huruf Kapital) *</label>
                                    <input
                                        type="text"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                        placeholder="Contoh: PADELRALLY20"
                                        className="form-input font-mono font-bold uppercase tracking-wider"
                                        required
                                    />
                                    {form.errors.code && <p className="form-error">{form.errors.code}</p>}
                                </div>
                            )}

                            <div>
                                <label className="form-label">Nama Promo *</label>
                                <input
                                    type="text"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Diskon Akhir Pekan 20%"
                                    className="form-input"
                                    required
                                />
                                {form.errors.name && <p className="form-error">{form.errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Tipe Diskon *</label>
                                    <select
                                        value={form.data.type}
                                        onChange={(e) => form.setData('type', e.target.value as any)}
                                        className="form-select"
                                        required
                                    >
                                        <option value="percentage">Persentase (%)</option>
                                        <option value="fixed">Nominal Tetap (Rp)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="form-label">
                                        Nilai Diskon ({form.data.type === 'percentage' ? '%' : 'Rp'}) *
                                    </label>
                                    <input
                                        type="number"
                                        value={form.data.value}
                                        onChange={(e) => form.setData('value', Number(e.target.value))}
                                        className="form-input"
                                        min="1"
                                        required
                                    />
                                    {form.errors.value && <p className="form-error">{form.errors.value}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Minimal Transaksi (Rp) *</label>
                                <input
                                    type="number"
                                    value={form.data.min_transaction}
                                    onChange={(e) => form.setData('min_transaction', Number(e.target.value))}
                                    className="form-input"
                                    min="0"
                                    step="10000"
                                    required
                                />
                                {form.errors.min_transaction && <p className="form-error">{form.errors.min_transaction}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="form-label">Berlaku Mulai</label>
                                    <input
                                        type="date"
                                        value={form.data.valid_from}
                                        onChange={(e) => form.setData('valid_from', e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="form-label">Berlaku Sampai *</label>
                                    <input
                                        type="date"
                                        value={form.data.valid_until}
                                        onChange={(e) => form.setData('valid_until', e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                    {form.errors.valid_until && <p className="form-error">{form.errors.valid_until}</p>}
                                </div>
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                        className="rounded text-primary focus:ring-primary h-4 w-4"
                                    />
                                    <span className="text-sm font-medium text-neutral-800">
                                        Promo Aktif (Dapat digunakan saat checkout)
                                    </span>
                                </label>
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
                isOpen={!!deletingPromo}
                title="Nonaktifkan Promo?"
                message={`Apakah Anda yakin ingin menonaktifkan promo "${deletingPromo?.code}"? Kode ini tidak dapat digunakan pemain lagi.`}
                confirmLabel="Ya, Nonaktifkan"
                danger
                onConfirm={handleDelete}
                onCancel={() => setDeletingPromo(null)}
            />
        </AdminLayout>
    );
}
