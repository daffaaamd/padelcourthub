import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Venue {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    province: string;
    phone: string;
    email: string;
    opening_time: string;
    closing_time: string;
    facilities: string[];
    cover_image: string;
    is_active: boolean;
}

interface Props {
    venue: Venue | null;
}

const availableFacilities = [
    'Parking',
    'Shower',
    'Locker',
    'Cafe',
    'WiFi',
    'Rental Raket',
    'Musholla',
    'Pro Shop',
];

export default function AdminVenueForm({ venue }: Props) {
    const isEdit = !!venue;

    const { data, setData, post, put, processing, errors } = useForm({
        name: venue?.name || '',
        description: venue?.description || '',
        address: venue?.address || '',
        city: venue?.city || 'Jakarta Selatan',
        province: venue?.province || 'DKI Jakarta',
        phone: venue?.phone || '',
        email: venue?.email || '',
        opening_time: venue?.opening_time ? venue.opening_time.slice(0, 5) : '07:00',
        closing_time: venue?.closing_time ? venue.closing_time.slice(0, 5) : '23:00',
        facilities: venue?.facilities || ['Parking', 'Shower', 'WiFi'],
        cover_image: venue?.cover_image || '',
        is_active: venue ? venue.is_active : true,
    });

    const handleFacilityToggle = (facility: string) => {
        if (data.facilities.includes(facility)) {
            setData('facilities', data.facilities.filter((f) => f !== facility));
        } else {
            setData('facilities', [...data.facilities, facility]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.venues.update', venue.id), {
                onSuccess: () => toast.success('Venue berhasil diperbarui!'),
                onError: () => toast.error('Silakan periksa form kembali.'),
            });
        } else {
            post(route('admin.venues.store'), {
                onSuccess: () => toast.success('Venue berhasil ditambahkan!'),
                onError: () => toast.error('Silakan periksa form kembali.'),
            });
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Venue' : 'Tambah Venue Baru'}>
            <Head title={isEdit ? `Edit Venue: ${venue.name}` : 'Tambah Venue Baru'} />

            <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href={route('admin.venues.index')}
                        className="text-sm text-neutral-500 hover:text-primary flex items-center gap-1.5"
                    >
                        <ArrowLeft size={16} /> Kembali ke Daftar Venue
                    </Link>
                </div>

                <div className="card p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="border-b border-neutral-100 pb-4 mb-4">
                            <h2 className="text-lg font-bold text-neutral-900">Informasi Utama Venue</h2>
                            <p className="text-xs text-neutral-500">Isi data identitas dan lokasi venue padel</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="form-label">Nama Venue *</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: PadelClub Senayan Arena"
                                    className="form-input"
                                    required
                                />
                                {errors.name && <p className="form-error">{errors.name}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="form-label">Deskripsi Venue</label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Deskripsi fasilitas, suasana, dan keunggulan venue ini..."
                                    className="form-input"
                                />
                                {errors.description && <p className="form-error">{errors.description}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="form-label">Alamat Lengkap *</label>
                                <input
                                    type="text"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Jl. Pintu Satu Senayan No. 1..."
                                    className="form-input"
                                    required
                                />
                                {errors.address && <p className="form-error">{errors.address}</p>}
                            </div>

                            <div>
                                <label className="form-label">Kota *</label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Jakarta Selatan"
                                    className="form-input"
                                    required
                                />
                                {errors.city && <p className="form-error">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="form-label">Provinsi</label>
                                <input
                                    type="text"
                                    value={data.province}
                                    onChange={(e) => setData('province', e.target.value)}
                                    placeholder="DKI Jakarta"
                                    className="form-input"
                                />
                                {errors.province && <p className="form-error">{errors.province}</p>}
                            </div>

                            <div>
                                <label className="form-label">Nomor Telepon / WhatsApp</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    placeholder="08123456789"
                                    className="form-input"
                                />
                                {errors.phone && <p className="form-error">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="form-label">Email Kontak</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="contact@venue.com"
                                    className="form-input"
                                />
                                {errors.email && <p className="form-error">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Jam Operasional */}
                        <div className="border-t border-neutral-100 pt-6">
                            <h2 className="text-base font-bold text-neutral-900 mb-1">Jam Operasional</h2>
                            <p className="text-xs text-neutral-500 mb-4">Atur rentang waktu buka dan tutup venue</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Jam Buka *</label>
                                    <input
                                        type="time"
                                        value={data.opening_time}
                                        onChange={(e) => setData('opening_time', e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                    {errors.opening_time && <p className="form-error">{errors.opening_time}</p>}
                                </div>

                                <div>
                                    <label className="form-label">Jam Tutup *</label>
                                    <input
                                        type="time"
                                        value={data.closing_time}
                                        onChange={(e) => setData('closing_time', e.target.value)}
                                        className="form-input"
                                        required
                                    />
                                    {errors.closing_time && <p className="form-error">{errors.closing_time}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Facilities */}
                        <div className="border-t border-neutral-100 pt-6">
                            <h2 className="text-base font-bold text-neutral-900 mb-1">Fasilitas Venue</h2>
                            <p className="text-xs text-neutral-500 mb-4">Pilih fasilitas yang tersedia untuk pemain</p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {availableFacilities.map((facility) => (
                                    <label
                                        key={facility}
                                        className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                                            data.facilities.includes(facility)
                                                ? 'bg-primary-50 border-primary text-primary font-medium'
                                                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.facilities.includes(facility)}
                                            onChange={() => handleFacilityToggle(facility)}
                                            className="rounded text-primary focus:ring-primary h-4 w-4"
                                        />
                                        <span className="text-sm">{facility}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Media & Status */}
                        <div className="border-t border-neutral-100 pt-6 space-y-4">
                            <div>
                                <label className="form-label">URL Foto Sampul (Cover Image)</label>
                                <input
                                    type="url"
                                    value={data.cover_image}
                                    onChange={(e) => setData('cover_image', e.target.value)}
                                    placeholder="https://images.unsplash.com/photo-..."
                                    className="form-input"
                                />
                                <p className="text-xs text-neutral-400 mt-1">
                                    Masukkan URL gambar beresolusi tinggi untuk tampilan kartu dan galeri.
                                </p>
                                {data.cover_image && (
                                    <div className="mt-2 w-40 h-24 rounded-lg overflow-hidden border border-neutral-200">
                                        <img src={data.cover_image} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded text-primary focus:ring-primary h-4 w-4"
                                    />
                                    <span className="text-sm font-medium text-neutral-800">
                                        Status Venue Aktif (Dapat dilihat dan dibooking pemain)
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="border-t border-neutral-100 pt-6 flex items-center justify-end gap-3">
                            <Link href={route('admin.venues.index')} className="btn-outline">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary flex items-center gap-2"
                            >
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Venue'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
