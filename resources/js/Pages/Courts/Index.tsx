import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { EmptyState, Pagination } from '@/Components/UI';
import { MapPin, Star, TableProperties, ArrowRight, Tag, X } from 'lucide-react';

interface Court {
    id: number;
    name: string;
    type: string;
    status: string;
    cover_image_url: string;
    starting_price: number;
    venue: {
        id: number;
        name: string;
        slug: string;
        city: string;
        cover_image_url: string;
        average_rating: number;
        reviews_count: number;
        facilities: string[];
    };
}

interface Props {
    courts: {
        data: Court[];
        total: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    cities: string[];
    filters: { city?: string; type?: string; date?: string; time?: string; sort?: string; promo?: string };
}

export default function CourtsIndex({ courts, cities, filters }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const [city, setCity] = useState(filters.city || '');
    const [type, setType] = useState(filters.type || '');
    const [date, setDate] = useState(filters.date || '');
    const [time, setTime] = useState(filters.time || '');
    const [promo, setPromo] = useState<string>('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const p = urlParams.get('promo') || filters.promo || '';
        if (p) setPromo(p.toUpperCase());
    }, []);

    const applyFilter = (newFilters: object) => {
        router.get(route('courts.index'), {
            ...filters,
            city: city || undefined,
            date: date || undefined,
            time: time || undefined,
            promo: promo || undefined,
            ...newFilters,
        }, { preserveState: true });
    };

    return (
        <AppLayout>
            <Head title="Cari Lapangan Padel" />

            <div className="bg-white border-b border-neutral-200">
                <div className="container-app py-6">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-1">Cari Lapangan Padel</h1>
                    <p className="text-neutral-500 text-sm">{courts.total} lapangan tersedia di berbagai kota</p>
                </div>
            </div>

            {/* Active Promo Notification Banner */}
            {promo && (
                <div className="bg-emerald-50 border-b border-emerald-200 py-3">
                    <div className="container-app flex items-center justify-between text-sm text-emerald-800">
                        <div className="flex items-center gap-2">
                            <Tag size={16} className="text-emerald-600 flex-shrink-0" />
                            <span>
                                Voucher <strong>{promo}</strong> aktif! Pilih lapangan di bawah untuk melanjutkan booking dengan diskon.
                            </span>
                        </div>
                        <button
                            onClick={() => setPromo('')}
                            className="text-xs text-emerald-600 hover:text-emerald-900 flex items-center gap-1 font-medium"
                        >
                            <X size={14} /> Batalkan
                        </button>
                    </div>
                </div>
            )}

            <div className="container-app py-6">
                {/* Filters Toolbar */}
                <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-neutral-200 shadow-xs mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        {/* Main Filters */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:flex md:items-center gap-2.5 flex-wrap">
                            {/* Kota */}
                            <select
                                value={city}
                                onChange={e => { setCity(e.target.value); applyFilter({ city: e.target.value }); }}
                                className="form-select text-xs sm:text-sm py-2 pl-3 pr-8 w-full md:w-44 bg-neutral-50 border-neutral-200"
                            >
                                <option value="">Semua Kota</option>
                                {cities.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>

                            {/* Tipe Court */}
                            <div className="flex gap-1 items-center col-span-2 sm:col-span-1 md:w-auto">
                                {['', 'indoor', 'outdoor'].map(t => (
                                    <button
                                        key={t || 'all'}
                                        onClick={() => { setType(t); applyFilter({ type: t }); }}
                                        className={`flex-1 md:flex-none text-xs sm:text-sm px-3 py-2 rounded-lg border font-medium transition-colors ${type === t ? 'bg-primary text-white border-primary shadow-xs' : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-primary hover:text-primary'}`}
                                    >
                                        {t === '' ? 'Semua' : t === 'indoor' ? 'Indoor' : 'Outdoor'}
                                    </button>
                                ))}
                            </div>

                            {/* Tanggal */}
                            <input
                                type="date"
                                value={date}
                                min={today}
                                onChange={e => { setDate(e.target.value); applyFilter({ date: e.target.value }); }}
                                className="form-input text-xs sm:text-sm py-2 w-full md:w-40 bg-neutral-50 border-neutral-200"
                                title="Filter tanggal"
                            />

                            {/* Jam */}
                            <select
                                value={time}
                                onChange={e => { setTime(e.target.value); applyFilter({ time: e.target.value }); }}
                                className="form-select text-xs sm:text-sm py-2 pl-3 pr-8 w-full md:w-36 bg-neutral-50 border-neutral-200"
                                title="Filter jam"
                            >
                                <option value="">Semua Jam</option>
                                {Array.from({ length: 16 }, (_, i) => i + 7).map(h => (
                                    <option key={h} value={`${String(h).padStart(2, '0')}:00`}>
                                        {String(h).padStart(2, '0')}:00
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort */}
                        <div className="pt-2 md:pt-0 border-t md:border-t-0 border-neutral-100 flex-shrink-0">
                            <select
                                value={filters.sort || 'popular'}
                                onChange={e => applyFilter({ sort: e.target.value })}
                                className="form-select text-xs sm:text-sm py-2 pl-3 pr-8 w-full md:w-48 bg-neutral-50 border-neutral-200"
                            >
                                <option value="popular">Urutkan: Terpopuler</option>
                                <option value="price_asc">Urutkan: Harga Terendah</option>
                            </select>
                        </div>
                    </div>
                </div>

                {courts.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courts.data.map(court => (
                            <div key={court.id} className="card-hover group">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={court.cover_image_url}
                                        alt={court.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${court.type === 'indoor' ? 'bg-blue-600 text-white' : 'bg-amber-500 text-white'}`}>
                                            {court.type === 'indoor' ? 'Indoor' : 'Outdoor'}
                                        </span>
                                    </div>
                                    <div className="absolute top-3 right-3">
                                        <span className="text-xs bg-white/95 backdrop-blur-sm text-neutral-800 font-medium px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                                            <Star size={11} className="text-amber-400 fill-amber-400" />
                                            {court.venue?.average_rating || '5.0'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <p className="text-xs text-neutral-400 mb-0.5">{court.venue?.name}</p>
                                    <h3 className="font-semibold text-neutral-900 mb-2 group-hover:text-primary transition-colors text-base">
                                        {court.name}
                                    </h3>
                                    <div className="flex items-center gap-1 text-xs text-neutral-500 mb-3">
                                        <MapPin size={12} className="text-primary flex-shrink-0" />
                                        <span>{court.venue?.city}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                                        <div>
                                            <span className="text-xs text-neutral-400">Mulai dari</span>
                                            <p className="text-sm font-bold text-primary">
                                                Rp {court.starting_price > 0 ? new Intl.NumberFormat('id-ID').format(court.starting_price) : '—'}/jam
                                            </p>
                                        </div>
                                        <Link
                                            href={route('bookings.create') + `?court_id=${court.id}${promo ? `&promo=${promo}` : ''}`}
                                            className="btn-primary text-xs py-2 px-4 font-semibold shadow-sm"
                                        >
                                            Booking Sekarang
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<TableProperties size={48} />}
                        title="Lapangan tidak ditemukan"
                        description="Coba ubah kota, tanggal, atau jam main — lapangan yang tampil hanya yang masih ada slot kosong."
                    />
                )}

                {/* Pagination */}
                {courts.last_page > 1 && (
                    <Pagination links={courts.links} className="mt-8" />
                )}
            </div>
        </AppLayout>
    );
}
