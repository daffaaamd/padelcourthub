import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import RatingStars from '@/Components/RatingStars';
import StatusBadge from '@/Components/StatusBadge';
import { MapPin, Phone, Mail, Clock, Heart, Share2, ChevronRight, Car, ShowerHead, Wifi, Coffee, Package, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const facilityIcons: Record<string, React.ComponentType<any>> = {
    'Parking': Car, 'Shower': ShowerHead, 'Locker': Lock,
    'Cafe': Coffee, 'WiFi': Wifi, 'Rental Raket': Package,
};

interface Court {
    id: number; name: string; type: string; status: string;
    cover_image_url: string; description: string;
    pricing_rules: Array<{ name: string; day_type: string; start_time: string; end_time: string; price_per_hour: number }>;
}

interface Venue {
    id: number; name: string; slug: string; description: string;
    address: string; city: string; phone: string; email: string;
    cover_image_url: string; images: string[];
    facilities: string[]; opening_time: string; closing_time: string;
    average_rating: number; reviews_count: number;
    latitude: number; longitude: number;
    courts: Court[];
    reviews: Array<{ id: number; rating: number; comment: string; created_at: string; user: { name: string; avatar_url: string } }>;
    rating_distribution: Record<string, { count: number; percentage: number }>;
}

interface Props {
    venue: Venue;
    is_favorited: boolean;
}

export default function VenueShow({ venue, is_favorited }: Props) {
    const { auth } = usePage<any>().props;
    const [activeImage, setActiveImage] = useState(0);
    const [favorited, setFavorited] = useState(is_favorited);
    const allImages = [venue.cover_image_url, ...(venue.images || [])].filter(Boolean);

    const toggleFavorite = async () => {
        if (!auth.user) {
            toast.error('Silakan login untuk menyimpan favorit.');
            return;
        }
        try {
            const res = await axios.post(route('venues.favorite', venue.id));
            setFavorited(res.data.favorited);
            toast.success(res.data.favorited ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit');
        } catch { toast.error('Gagal memperbarui favorit.'); }
    };

    const formatPrice = (p: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(p);

    return (
        <AppLayout>
            <Head title={venue.name} />

            <div className="container-app py-6 md:py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-5">
                    <Link href={route('home')} className="hover:text-primary">Beranda</Link>
                    <ChevronRight size={14} />
                    <Link href={route('venues.index')} className="hover:text-primary">Venue</Link>
                    <ChevronRight size={14} />
                    <span className="text-neutral-900 font-medium truncate">{venue.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                    {/* Left/Main */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gallery */}
                        <div className="space-y-2">
                            <div className="relative h-72 md:h-96 rounded-xl overflow-hidden bg-neutral-200">
                                <img
                                    src={allImages[activeImage] || venue.cover_image_url}
                                    alt={venue.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === idx ? 'border-primary' : 'border-transparent'}`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="card p-5 md:p-6">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-xl md:text-2xl font-bold text-neutral-900 mb-1.5">{venue.name}</h1>
                                    <div className="flex items-center gap-1.5 text-neutral-500 text-sm">
                                        <MapPin size={14} />
                                        <span>{venue.address}, {venue.city}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button onClick={toggleFavorite} className={`p-2 rounded-lg border transition-colors ${favorited ? 'bg-red-50 border-red-200 text-red-500' : 'border-neutral-200 text-neutral-400 hover:border-red-200 hover:text-red-400'}`}>
                                        <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                                <RatingStars rating={venue.average_rating} showValue count={venue.reviews_count} />
                            </div>

                            {venue.description && (
                                <div>
                                    <h2 className="font-semibold text-neutral-900 mb-2">Tentang Venue</h2>
                                    <p className="text-sm text-neutral-600 leading-relaxed">{venue.description}</p>
                                </div>
                            )}
                        </div>

                        {/* Facilities */}
                        {venue.facilities && venue.facilities.length > 0 && (
                            <div className="card p-5">
                                <h2 className="font-semibold text-neutral-900 mb-4">Fasilitas</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {venue.facilities.map(f => {
                                        const Icon = facilityIcons[f];
                                        return (
                                            <div key={f} className="flex items-center gap-2.5 text-sm text-neutral-700">
                                                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    {Icon ? <Icon size={15} className="text-primary" /> : <span className="text-primary text-xs font-bold">{f[0]}</span>}
                                                </div>
                                                <span>{f}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Courts */}
                        <div className="card p-5">
                            <h2 className="font-semibold text-neutral-900 mb-4">Daftar Court</h2>
                            <div className="space-y-3">
                                {venue.courts.map(court => (
                                    <div key={court.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-neutral-200 hover:border-primary/40 hover:shadow-xs transition-all gap-3 bg-white">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-200 shadow-xs">
                                                <img src={court.cover_image_url} alt={court.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-neutral-900 text-sm sm:text-base truncate">{court.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${court.type === 'indoor' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                                                        {court.type === 'indoor' ? 'Indoor' : 'Outdoor'}
                                                    </span>
                                                    <StatusBadge status={court.status} size="sm" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100">
                                            {court.pricing_rules.length > 0 && (
                                                <p className="text-sm font-bold text-primary">
                                                    {formatPrice(Math.min(...court.pricing_rules.map(r => r.price_per_hour)))}<span className="text-xs font-normal text-neutral-500">/jam</span>
                                                </p>
                                            )}
                                            {court.status === 'available' ? (
                                                <Link
                                                    href={route('bookings.create') + `?court_id=${court.id}`}
                                                    className="btn-primary text-xs py-1.5 px-4 rounded-lg mt-1 font-semibold"
                                                >
                                                    Booking Slot →
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-neutral-400 font-medium mt-1">Penuh / Tutup</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        {venue.reviews.length > 0 && (
                            <div className="card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-neutral-900">Ulasan</h2>
                                    <div className="flex items-center gap-2">
                                        <RatingStars rating={venue.average_rating} showValue />
                                        <span className="text-sm text-neutral-500">({venue.reviews_count} ulasan)</span>
                                    </div>
                                </div>

                                {/* Rating distribution */}
                                <div className="space-y-1.5 mb-5">
                                    {[5, 4, 3, 2, 1].map(star => (
                                        <div key={star} className="flex items-center gap-2">
                                            <span className="text-xs text-neutral-500 w-4">{star}</span>
                                            <div className="flex-1 bg-neutral-100 rounded-full h-1.5">
                                                <div
                                                    className="bg-amber-400 h-1.5 rounded-full"
                                                    style={{ width: `${venue.rating_distribution[star]?.percentage || 0}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-neutral-500 w-8">{venue.rating_distribution[star]?.count || 0}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    {venue.reviews.map(review => (
                                        <div key={review.id} className="border-b border-neutral-100 last:border-0 pb-4 last:pb-0">
                                            <div className="flex items-center gap-2.5 mb-2">
                                                <img src={review.user.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                                <div>
                                                    <p className="text-sm font-medium text-neutral-900">{review.user.name}</p>
                                                    <div className="flex items-center gap-2">
                                                        <RatingStars rating={review.rating} size={11} />
                                                        <span className="text-xs text-neutral-400">{review.created_at}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {review.comment && (
                                                <p className="text-sm text-neutral-600 leading-relaxed">{review.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right sidebar */}
                    <div className="space-y-4">
                        {/* Quick info card */}
                        <div className="card p-5 sticky top-20">
                            <h3 className="font-semibold text-neutral-900 mb-4">Informasi Venue</h3>
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-2.5 text-sm">
                                    <Clock size={15} className="text-primary flex-shrink-0" />
                                    <span className="text-neutral-600">
                                        {venue.opening_time?.slice(0, 5)} — {venue.closing_time?.slice(0, 5)} WIB
                                    </span>
                                </div>
                                {venue.phone && (
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Phone size={15} className="text-primary flex-shrink-0" />
                                        <span className="text-neutral-600">{venue.phone}</span>
                                    </div>
                                )}
                                {venue.email && (
                                    <div className="flex items-center gap-2.5 text-sm">
                                        <Mail size={15} className="text-primary flex-shrink-0" />
                                        <span className="text-neutral-600">{venue.email}</span>
                                    </div>
                                )}
                                <div className="flex items-start gap-2.5 text-sm">
                                    <MapPin size={15} className="text-primary flex-shrink-0 mt-0.5" />
                                    <span className="text-neutral-600">{venue.address}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            {venue.courts.some(c => c.status === 'available') ? (
                                <Link
                                    href={route('bookings.create') + `?court_id=${venue.courts.find(c => c.status === 'available')?.id}`}
                                    className="btn-primary-lg w-full justify-center"
                                >
                                    Booking Sekarang
                                </Link>
                            ) : (
                                <button disabled className="btn-primary-lg w-full justify-center opacity-50 cursor-not-allowed">
                                    Semua Court Penuh
                                </button>
                            )}
                        </div>

                        {/* Pricing */}
                        {venue.courts.length > 0 && venue.courts[0].pricing_rules.length > 0 && (
                            <div className="card p-5">
                                <h3 className="font-semibold text-neutral-900 mb-3">Harga Sewa</h3>
                                <div className="space-y-2">
                                    {venue.courts[0].pricing_rules.map((rule, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-sm">
                                            <span className="text-neutral-600">{rule.name}</span>
                                            <span className="font-semibold text-neutral-900">{formatPrice(rule.price_per_hour)}/jam</span>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-neutral-400 mt-3">*Harga dapat berbeda per court</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
