import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import StatusBadge from '@/Components/StatusBadge';
import {
    CalendarCheck, TrendingUp, Clock, Award, ArrowRight,
    MapPin, Calendar, PlusCircle, Sparkles, Heart, Search, ChevronRight
} from 'lucide-react';

interface BookingItem {
    id?: number;
    booking_code: string;
    venue_name?: string;
    court_name?: string;
    venue_cover_image?: string;
    venue_image?: string;
    venue_city?: string;
    date?: string;
    date_formatted?: string;
    start_time: string;
    end_time: string;
    total: number;
    status: string;
}

interface Props {
    stats?: {
        total_bookings?: number;
        completed_bookings?: number;
        pending_bookings?: number;
        upcoming_count?: number;
        total_spent?: number;
        total_games?: number;
        favorite_venues?: number;
    };
    recent_bookings?: BookingItem[];
    upcoming?: BookingItem[];
    user?: {
        id?: number;
        name: string;
        email: string;
        phone?: string;
        avatar_url?: string;
    };
}

export default function CustomerDashboard({
    stats = {},
    recent_bookings = [],
    upcoming = [],
    user: propUser,
}: Props) {
    const { auth } = usePage<any>().props;
    const user = propUser || auth?.user || {
        name: 'Pengguna',
        email: '',
        avatar_url: 'https://ui-avatars.com/api/?name=User&background=1B4D3E&color=fff',
    };

    const formatCurrency = (v?: number) =>
        'Rp ' + new Intl.NumberFormat('id-ID').format(v || 0);

    const totalBookings = stats.total_bookings ?? 0;
    const completedBookings = stats.completed_bookings ?? stats.total_games ?? 0;
    const pendingBookings = stats.pending_bookings ?? 0;
    const totalSpent = stats.total_spent ?? 0;

    return (
        <AppLayout>
            <Head title="Dashboard Member" />

            {/* Profile Greeting Header */}
            <div className="bg-primary text-white">
                <div className="container-app py-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=1B4D3E&color=fff`}
                                alt={user.name}
                                className="w-16 h-16 rounded-2xl border-2 border-white/20 object-cover shadow-md bg-white/10"
                            />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent/20 text-accent">
                                        Member
                                    </span>
                                </div>
                                <h1 className="text-2xl font-extrabold text-white mt-1">
                                    Halo, {user.name}!
                                </h1>
                                <p className="text-white/70 text-xs mt-0.5">
                                    {user.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                            <Link
                                href={route('courts.index')}
                                className="btn-accent px-4 py-2.5 text-sm font-bold flex items-center gap-2 shadow-lg"
                            >
                                <PlusCircle size={16} /> Booking Lapangan
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-app py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        {
                            icon: CalendarCheck,
                            label: 'Total Booking',
                            value: totalBookings,
                            desc: 'Semua transaksi',
                            color: 'text-primary',
                            bg: 'bg-primary/10',
                        },
                        {
                            icon: Award,
                            label: 'Selesai Main',
                            value: completedBookings,
                            desc: 'Game diselesaikan',
                            color: 'text-emerald-600',
                            bg: 'bg-emerald-50',
                        },
                        {
                            icon: Clock,
                            label: 'Menunggu / Aktif',
                            value: pendingBookings,
                            desc: 'Jadwal mendatang',
                            color: 'text-amber-600',
                            bg: 'bg-amber-50',
                        },
                        {
                            icon: TrendingUp,
                            label: 'Total Pengeluaran',
                            value: formatCurrency(totalSpent),
                            desc: 'Aktivitas bermain',
                            color: 'text-primary',
                            bg: 'bg-primary/10',
                            isMoney: true,
                        },
                    ].map(stat => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.label} className="card p-5 border border-neutral-200/80 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-neutral-500">{stat.label}</span>
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg}`}>
                                        <Icon size={17} className={stat.color} />
                                    </div>
                                </div>
                                <p className={`font-black ${stat.isMoney ? 'text-lg lg:text-xl' : 'text-2xl'} ${stat.color}`}>
                                    {stat.value}
                                </p>
                                <p className="text-[11px] text-neutral-400 mt-1">{stat.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left 2 Cols: Upcoming & Recent Bookings */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Bookings */}
                        <div className="card p-6 border border-neutral-200/80">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <Clock size={18} className="text-primary" />
                                    <h2 className="font-bold text-neutral-900 text-base">Jadwal Main Mendatang</h2>
                                </div>
                                <Link
                                    href={route('bookings.index')}
                                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                >
                                    Semua Booking <ArrowRight size={13} />
                                </Link>
                            </div>

                            {upcoming.length > 0 ? (
                                <div className="space-y-3">
                                    {upcoming.map(booking => (
                                        <div
                                            key={booking.booking_code}
                                            className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white hover:border-primary/40 hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-200 shadow-sm">
                                                    <img
                                                        src={booking.venue_cover_image || booking.venue_image || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80'}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-neutral-900">
                                                            {booking.venue_name || 'Padel Court'}
                                                        </span>
                                                        <StatusBadge status={booking.status} size="sm" />
                                                    </div>
                                                    <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                                                        <span>{booking.court_name}</span>
                                                        <span>•</span>
                                                        <span className="font-medium text-neutral-700">
                                                            {booking.date_formatted || booking.date}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs font-semibold text-primary mt-1">
                                                        ⏰ {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)} WIB
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end sm:self-center">
                                                <Link
                                                    href={route('bookings.show', booking.booking_code)}
                                                    className="btn-outline px-3.5 py-1.5 text-xs font-semibold"
                                                >
                                                    Lihat E-Tiket
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                                        <Calendar size={22} />
                                    </div>
                                    <p className="text-sm font-semibold text-neutral-700">Belum ada jadwal main mendatang</p>
                                    <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
                                        Booking lapangan favoritmu sekarang untuk mengamankan slot waktu bermain.
                                    </p>
                                    <Link
                                        href={route('courts.index')}
                                        className="btn-primary mt-4 inline-flex text-xs px-4 py-2"
                                    >
                                        Pesan Lapangan Sekarang
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Recent Bookings List */}
                        <div className="card p-6 border border-neutral-200/80">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
                                <h2 className="font-bold text-neutral-900 text-base">Riwayat Transaksi Terbaru</h2>
                                <Link
                                    href={route('bookings.index')}
                                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                                >
                                    Lihat Semua <ArrowRight size={13} />
                                </Link>
                            </div>

                            {recent_bookings.length > 0 ? (
                                <div className="divide-y divide-neutral-100">
                                    {recent_bookings.map(b => (
                                        <Link
                                            key={b.booking_code}
                                            href={route('bookings.show', b.booking_code)}
                                            className="flex items-center justify-between py-3.5 hover:bg-neutral-50 px-2 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                                                    <img
                                                        src={b.venue_cover_image || b.venue_image || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=400&q=80'}
                                                        alt=""
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-neutral-900">
                                                        {b.venue_name || 'Padel Court'}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">
                                                        {b.date_formatted || b.date} · {b.start_time?.slice(0, 5)} · {b.court_name}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right flex items-center gap-3">
                                                <div>
                                                    <p className="text-sm font-bold text-primary">{formatCurrency(b.total)}</p>
                                                    <div className="mt-0.5">
                                                        <StatusBadge status={b.status} size="sm" />
                                                    </div>
                                                </div>
                                                <ChevronRight size={16} className="text-neutral-400" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-neutral-400 text-center py-6">
                                    Belum ada transaksi riwayat booking.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Quick Actions & Highlights */}
                    <div className="space-y-5">
                        {/* Quick Action Navigation */}
                        <div className="card p-5 border border-neutral-200/80">
                            <h3 className="font-bold text-neutral-900 text-sm mb-3">Akses Cepat</h3>
                            <div className="space-y-2">
                                <Link
                                    href={route('courts.index')}
                                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-primary hover:bg-primary-50 transition-all text-neutral-800 hover:text-primary group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                            <Search size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Cari & Booking Lapangan</p>
                                            <p className="text-[11px] text-neutral-400">Pilih court indoor & outdoor</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={15} className="text-neutral-400 group-hover:text-primary" />
                                </Link>

                                <Link
                                    href={route('promos.index')}
                                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-primary hover:bg-primary-50 transition-all text-neutral-800 hover:text-primary group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent-dark group-hover:bg-accent group-hover:text-white transition-colors">
                                            <Sparkles size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Promo & Voucher Aktif</p>
                                            <p className="text-[11px] text-neutral-400">Hemat hingga ratusan ribu</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={15} className="text-neutral-400 group-hover:text-primary" />
                                </Link>

                                <Link
                                    href={route('venues.index')}
                                    className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-primary hover:bg-primary-50 transition-all text-neutral-800 hover:text-primary group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                            <Heart size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Jelajahi Venue Padel</p>
                                            <p className="text-[11px] text-neutral-400">Lihat lokasi & fasilitas lengkap</p>
                                        </div>
                                    </div>
                                    <ChevronRight size={15} className="text-neutral-400 group-hover:text-primary" />
                                </Link>
                            </div>
                        </div>

                        {/* Banner Promo / Tip */}
                        <div className="rounded-2xl p-5 bg-gradient-to-br from-primary to-primary-900 text-white shadow-md">
                            <div className="flex items-center gap-2 text-accent text-xs font-bold mb-2">
                                <Sparkles size={14} /> TIPS BERMAIN
                            </div>
                            <h4 className="font-bold text-sm mb-1.5">Booking Lebih Awal untuk Slot Favorit</h4>
                            <p className="text-xs text-white/80 leading-relaxed mb-4">
                                Slot jam 17:00 - 21:00 cepat penuh! Pesan 2-3 hari sebelumnya dan gunakan kode voucher untuk harga hemat.
                            </p>
                            <Link
                                href={route('promos.index')}
                                className="inline-block bg-white text-primary text-xs font-bold px-3.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                            >
                                Lihat Semua Voucher →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
