import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import VenueCard from '@/Components/VenueCard';
import { EmptyState, Pagination } from '@/Components/UI';
import { SlidersHorizontal, X, Building2, ChevronLeft, ChevronRight } from 'lucide-react';

interface Venue {
    id: number;
    name: string;
    slug: string;
    city: string;
    address: string;
    cover_image_url: string;
    facilities: string[];
    average_rating: number;
    reviews_count: number;
    starting_price: number;
    courts_count: number;
    has_indoor: boolean;
    has_outdoor: boolean;
}

interface Props {
    venues: {
        data: Venue[];
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
    cities: string[];
    filters: { city?: string; type?: string; sort?: string };
}

export default function VenuesIndex({ venues, cities, filters }: Props) {
    const [filterOpen, setFilterOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState(filters);

    const applyFilters = () => {
        router.get(route('venues.index'), localFilters, { preserveState: true });
        setFilterOpen(false);
    };

    const clearFilters = () => {
        setLocalFilters({});
        router.get(route('venues.index'));
    };

    const activeFilterCount = Object.values(localFilters).filter(Boolean).length;

    return (
        <AppLayout>
            <Head title="Daftar Venue" />

            {/* Header */}
            <div className="bg-white border-b border-neutral-200">
                <div className="container-app py-6">
                    <h1 className="text-2xl font-bold text-neutral-900 mb-1">Daftar Venue Padel</h1>
                    <p className="text-neutral-500 text-sm">
                        {venues.total} venue ditemukan
                        {filters.city ? ` di ${filters.city}` : ' di seluruh Indonesia'}
                    </p>
                </div>
            </div>

            <div className="container-app py-6">
                {/* Toolbar */}
                <div className="flex items-center justify-between mb-5 gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* City pills */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                            <button
                                onClick={() => { setLocalFilters({ ...localFilters, city: '' }); router.get(route('venues.index'), { ...localFilters, city: '' }); }}
                                className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-full border transition-colors ${!localFilters.city ? 'bg-primary text-white border-primary' : 'border-neutral-300 text-neutral-600 hover:border-primary hover:text-primary'}`}
                            >
                                Semua Kota
                            </button>
                            {cities.map(city => (
                                <button
                                    key={city}
                                    onClick={() => { setLocalFilters({ ...localFilters, city }); router.get(route('venues.index'), { ...localFilters, city }); }}
                                    className={`flex-shrink-0 text-sm px-3 py-1.5 rounded-full border transition-colors ${localFilters.city === city ? 'bg-primary text-white border-primary' : 'border-neutral-300 text-neutral-600 hover:border-primary hover:text-primary'}`}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {activeFilterCount > 0 && (
                            <button onClick={clearFilters} className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1">
                                <X size={12} /> Reset
                            </button>
                        )}
                        <select
                            value={localFilters.sort || 'popular'}
                            onChange={e => { const sort = e.target.value; setLocalFilters({ ...localFilters, sort }); router.get(route('venues.index'), { ...localFilters, sort }); }}
                            className="form-select text-sm py-1.5 pl-3 pr-8 w-auto"
                        >
                            <option value="popular">Terpopuler</option>
                            <option value="rating">Rating Tertinggi</option>
                            <option value="price_asc">Harga Terendah</option>
                            <option value="price_desc">Harga Tertinggi</option>
                        </select>
                    </div>
                </div>

                {/* Grid */}
                {venues.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {venues.data.map(venue => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Building2 size={48} />}
                        title="Venue tidak ditemukan"
                        description="Coba ubah filter atau cari di kota lain."
                        action={<button onClick={clearFilters} className="btn-primary">Reset Filter</button>}
                    />
                )}

                {/* Pagination */}
                {venues.last_page > 1 && (
                    <Pagination links={venues.links} className="mt-8" />
                )}
            </div>
        </AppLayout>
    );
}
