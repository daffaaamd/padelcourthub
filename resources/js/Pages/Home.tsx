import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import VenueCard from '@/Components/VenueCard';
import RatingStars from '@/Components/RatingStars';
import {
    Search, MapPin, Calendar, Clock, ArrowRight, Shield, Zap,
    Star, ChevronRight, Play, Building2, CreditCard, Sparkles, CheckCircle2, Ticket
} from 'lucide-react';

interface Venue {
    id: number;
    name: string;
    slug: string;
    city: string;
    cover_image_url: string;
    facilities: string[];
    average_rating: number;
    reviews_count: number;
    starting_price: number;
    courts_count: number;
    has_indoor?: boolean;
    has_outdoor?: boolean;
}

interface Stats {
    total_courts: number;
    total_venues: number;
    total_bookings: number;
    average_rating: number;
}

interface Props {
    popularVenues: Venue[];
    stats: Stats;
}

export default function Home({ popularVenues, stats }: Props) {
    const { auth } = usePage<any>().props;
    const user = auth?.user;

    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const [search, setSearch] = useState({
        city: '',
        date: tomorrow,
        time: '07:00',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('courts.index'), {
            city: search.city,
            date: search.date,
            time: search.time,
        });
    };

    const formatCount = (n: number): string =>
        n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K+` : `${n}+`;

    return (
        <AppLayout transparentNavbar>
            <Head title="Temukan Lapangan Padel Favoritmu" />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src="/images/venues/padel_hero_banner.jpg"
                        alt="Lapangan padel profesional"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
                </div>

                <div className="relative container-app py-24 sm:py-32 pt-32 sm:pt-40">
                    <div className="max-w-3xl">
                        {/* Tags & Developer Credit */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-6">
                            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs sm:text-sm px-4 py-1.5 rounded-full font-medium shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                Platform Booking Padel #1
                            </div>
                            <div className="inline-flex items-center gap-2 bg-emerald-500/25 backdrop-blur-md border border-emerald-400/50 text-emerald-100 text-xs px-3.5 py-1.5 rounded-full font-medium shadow-sm">
                                <span>⚡ Karya <strong className="text-white font-bold">Daffa Ahmad Baihaqi</strong></span>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 sm:mb-5">
                            Temukan Lapangan<br />
                            <span className="text-accent">Padel Favoritmu</span>
                        </h1>
                        <p className="text-base sm:text-lg text-white/85 mb-8 sm:mb-10 leading-relaxed max-w-xl">
                            Cari venue terbaik, cek ketersediaan slot real-time, dan pesan lapangan padel dengan mudah dalam hitungan detik.
                        </p>

                        {/* Search Panel */}
                        <div className="bg-white rounded-xl shadow-2xl p-4 md:p-6">
                            <form onSubmit={handleSearch}>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                                    <div>
                                        <label className="form-label text-neutral-700">
                                            <MapPin size={13} className="inline mr-1 text-primary" />
                                            Kota
                                        </label>
                                        <select
                                            value={search.city}
                                            onChange={e => setSearch({ ...search, city: e.target.value })}
                                            className="form-select text-sm"
                                        >
                                            <option value="">Semua Kota</option>
                                            <option value="Jakarta Selatan">Jakarta Selatan</option>
                                            <option value="Jakarta Utara">Jakarta Utara (PIK)</option>
                                            <option value="Jakarta Barat">Jakarta Barat</option>
                                            <option value="Jakarta Pusat">Jakarta Pusat</option>
                                            <option value="Tangerang">Tangerang</option>
                                            <option value="Tangerang Selatan">Tangerang Selatan (BSD)</option>
                                            <option value="Bogor">Bogor (Sentul)</option>
                                            <option value="Bandung">Bandung</option>
                                            <option value="Surabaya">Surabaya</option>
                                            <option value="Denpasar">Bali (Canggu)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="form-label text-neutral-700">
                                            <Calendar size={13} className="inline mr-1 text-primary" />
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={search.date}
                                            min={today}
                                            onChange={e => setSearch({ ...search, date: e.target.value })}
                                            className="form-input text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="form-label text-neutral-700">
                                            <Clock size={13} className="inline mr-1 text-primary" />
                                            Jam Mulai
                                        </label>
                                        <select
                                            value={search.time}
                                            onChange={e => setSearch({ ...search, time: e.target.value })}
                                            className="form-select text-sm"
                                        >
                                            {Array.from({ length: 16 }, (_, i) => i + 7).map(h => (
                                                <option key={h} value={`${String(h).padStart(2, '0')}:00`}>
                                                    {String(h).padStart(2, '0')}:00
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button type="submit" className="w-full btn-primary-lg justify-center text-base">
                                    <Search size={18} />
                                    Cari Lapangan
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white border-b border-neutral-100">
                <div className="container-app py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: `${stats.total_courts}+`, label: 'Lapangan Tersedia', color: 'text-primary' },
                            { value: `${stats.total_venues}+`, label: 'Venue Aktif', color: 'text-primary' },
                            { value: formatCount(stats.total_bookings), label: 'Booking Berhasil', color: 'text-primary' },
                            { value: `${stats.average_rating}/5`, label: 'Rating Pemain', color: 'text-accent-600' },
                        ].map(item => (
                            <div key={item.label} className="text-center">
                                <div className={`text-3xl md:text-4xl font-bold mb-1 ${item.color}`}>{item.value}</div>
                                <div className="text-sm text-neutral-500">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Venues */}
            <section className="section bg-surface-alt">
                <div className="container-app">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="section-title">Venue Paling Banyak Dipilih</h2>
                            <p className="section-subtitle">Temukan lapangan padel terbaik di berbagai kota</p>
                        </div>
                        <Link href={route('venues.index')} className="hidden md:flex items-center gap-1.5 text-primary font-medium text-sm hover:gap-2.5 transition-all">
                            Lihat Semua <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {popularVenues.map(venue => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))}
                    </div>

                    <div className="text-center mt-8 md:hidden">
                        <Link href={route('venues.index')} className="btn-outline-primary">
                            Lihat Semua Venue <ArrowRight size={15} className="inline ml-1" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why PadelCourt */}
            <section className="section bg-white">
                <div className="container-app">
                    <div className="text-center mb-12">
                        <h2 className="section-title">Kenapa Pilih PadelCourt?</h2>
                        <p className="section-subtitle">Ngurus booking lapangan jadi nggak ribet lagi</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Zap size={28} className="text-accent" />,
                                title: 'Booking Instan',
                                desc: 'Langsung pesan dari HP-mu. Nggak perlu telepon atau chat ke venue — klik, bayar, beres.',
                            },
                            {
                                icon: <Shield size={28} className="text-primary" />,
                                title: 'Aman & Terpercaya',
                                desc: 'Venue yang tampil udah dicek langsung sama tim kami. Kalau ada kendala, uangmu dijamin kembali.',
                            },
                            {
                                icon: <Star size={28} className="text-amber-500" />,
                                title: 'Venue Berkualitas',
                                desc: 'Kami cuma tampilkan venue yang lapangannya terawat dan ratingnya beneran bagus dari review pemain asli.',
                            },
                        ].map(item => (
                            <div key={item.title} className="group p-6 rounded-xl border border-neutral-200 hover:border-primary/30 hover:shadow-card hover:-translate-y-1 transition-all duration-200">
                                <div className="mb-4 w-12 h-12 bg-neutral-50 group-hover:bg-primary-50 rounded-xl flex items-center justify-center transition-colors duration-200">
                                    {item.icon}
                                </div>
                                <h3 className="font-semibold text-neutral-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Alur Booking Lapangan — Clean & Professional */}
            <section className="section bg-surface-alt border-y border-neutral-200">
                <div className="container-app">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                            {/* Left: Alur Step Timeline */}
                            <div className="lg:col-span-7">
                                <div className="mb-8">
                                    <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-2">
                                        Alur Booking Lapangan
                                    </h2>
                                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
                                        Pesan jadwal main padel secara online tanpa perlu konfirmasi manual ke venue.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        {
                                            num: '1',
                                            title: 'Cari Venue & Court',
                                            desc: 'Pilih venue terdekat di kotamu, lihat foto fasilitas, serta pilihan lapangan indoor atau outdoor.',
                                        },
                                        {
                                            num: '2',
                                            title: 'Pilih Tanggal & Jam Main',
                                            desc: 'Pilih tanggal bermain dan slot jam yang tersedia secara real-time dengan durasi 1 - 2 jam.',
                                        },
                                        {
                                            num: '3',
                                            title: 'Bayar & Gunakan Voucher',
                                            desc: 'Lakukan pembayaran aman via Virtual Account, E-Wallet, atau QRIS. Masukkan kode promo untuk diskon.',
                                        },
                                        {
                                            num: '4',
                                            title: 'Dapatkan E-Ticket & Main',
                                            desc: 'Tiket booking langsung terbit di akunmu. Tunjukkan kode booking atau QR saat tiba di lokasi venue.',
                                        },
                                    ].map((item, idx) => (
                                        <div key={item.num} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-white font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                                                    {item.num}
                                                </div>
                                                {idx < 3 && (
                                                    <div className="w-0.5 flex-1 bg-neutral-300 my-1.5 min-h-[28px]" />
                                                )}
                                            </div>
                                            <div className="pb-3">
                                                <h3 className="font-bold text-neutral-900 text-sm sm:text-base mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-2">
                                    <Link
                                        href={route('courts.index')}
                                        className="btn-primary inline-flex items-center gap-2 text-sm font-semibold py-2.5 px-5"
                                    >
                                        Cari Lapangan Sekarang <ArrowRight size={16} />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Realistic Padel Pass E-Ticket */}
                            <div className="lg:col-span-5 flex justify-center">
                                <div className="w-full max-w-sm bg-white rounded-3xl border border-neutral-200/90 shadow-xl overflow-hidden relative">
                                    {/* Ticket Top Header */}
                                    <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white p-5 relative overflow-hidden">
                                        <div className="flex items-center justify-between relative z-10 mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center shadow-xs">
                                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                                        <rect x="2" y="8" width="20" height="8" rx="1" stroke="white" strokeWidth="1.8"/>
                                                        <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="1.8"/>
                                                        <circle cx="12" cy="4" r="2" fill="white"/>
                                                        <path d="M7 16v3M17 16v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                                                    </svg>
                                                </div>
                                                <span className="text-xs font-bold tracking-wider text-neutral-300">PADEL PASS</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                LUNAS
                                            </span>
                                        </div>

                                        {/* Venue & Court Info in Header */}
                                        <div className="relative z-10">
                                            <h4 className="text-lg font-extrabold text-white">Kemang Padel Club</h4>
                                            <p className="text-xs text-primary-300 font-medium">Court 1 • Indoor Panoramic Glass</p>
                                        </div>
                                    </div>

                                    {/* Perforation Cutout & Dashed Divider */}
                                    <div className="relative flex items-center bg-white h-6">
                                        <div className="w-3.5 h-7 bg-surface-alt rounded-r-full border-r border-y border-neutral-200/90 -ml-px" />
                                        <div className="flex-1 border-b-2 border-dashed border-neutral-200 mx-2" />
                                        <div className="w-3.5 h-7 bg-surface-alt rounded-l-full border-l border-y border-neutral-200/90 -mr-px" />
                                    </div>

                                    {/* Ticket Body Content */}
                                    <div className="p-5 pt-2 bg-white space-y-3">
                                        {/* Schedule Grid */}
                                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                                            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                                                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Tanggal</p>
                                                <p className="font-bold text-neutral-900 mt-0.5">Sabtu, 24 Agu 2026</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100">
                                                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Jam Main</p>
                                                <p className="font-bold text-neutral-900 mt-0.5">15:00 - 17:00 (2 Jam)</p>
                                            </div>
                                        </div>

                                        {/* Booking Code & Price */}
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
                                            <div>
                                                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Kode Booking</p>
                                                <p className="font-mono font-extrabold text-primary text-sm tracking-wider">PDC-2026-8891</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Total Biaya</p>
                                                <p className="font-bold text-neutral-900 text-sm">Rp 250.000</p>
                                            </div>
                                        </div>

                                        {/* Clean QR Code Section */}
                                        <div className="pt-2 border-t border-neutral-100 text-center">
                                            <div className="w-24 h-24 mx-auto p-2 bg-white rounded-xl border border-neutral-200 shadow-xs flex items-center justify-center mb-2">
                                                <svg viewBox="0 0 24 24" className="w-full h-full text-neutral-900" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="2" y="2" width="7" height="7" rx="1" />
                                                    <rect x="15" y="2" width="7" height="7" rx="1" />
                                                    <rect x="2" y="15" width="7" height="7" rx="1" />
                                                    <rect x="4.5" y="4.5" width="2" height="2" fill="currentColor" />
                                                    <rect x="17.5" y="4.5" width="2" height="2" fill="currentColor" />
                                                    <rect x="4.5" y="17.5" width="2" height="2" fill="currentColor" />
                                                    <path d="M15 15h2v2h-2zM19 15h2v4h-2zM15 19h2v2h-2z" fill="currentColor" />
                                                </svg>
                                            </div>
                                            <p className="text-xs font-semibold text-neutral-800">Scan QR Code di Venue</p>
                                            <p className="text-[11px] text-neutral-400 mt-0.5">Tunjukkan bukti tiket ini ke petugas lapangan</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Banner */}
            <section className="bg-white section">
                <div className="container-app">
                    <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
                        <img
                            src="/images/venues/padel_players_action.jpg"
                            alt="Padel players"
                            className="absolute inset-0 w-full h-full object-cover opacity-30"
                        />
                        <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                    {user
                                        ? `Siap Main Padel Hari Ini, ${user.name.split(' ')[0]}?`
                                        : 'Siap Mulai Bermain Padel?'
                                    }
                                </h2>
                                <p className="text-white/70 text-base">
                                    {user
                                        ? 'Temukan lapangan favoritmu, cek slot yang tersedia, dan pesan langsung tanpa ribet.'
                                        : 'Daftar sekarang dan dapatkan diskon Rp50.000 untuk booking pertama kamu.'
                                    }
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3 flex-shrink-0">
                                {user ? (
                                    <>
                                        <Link href={route('courts.index')} className="btn-accent px-7 py-3.5 text-base font-semibold">
                                            Booking Lapangan
                                        </Link>
                                        <Link href={route('bookings.index')} className="px-7 py-3.5 text-base font-semibold border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors">
                                            Booking Saya
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link href={route('register')} className="btn-accent px-7 py-3.5 text-base font-semibold">
                                            Daftar Gratis
                                        </Link>
                                        <Link href={route('courts.index')} className="px-7 py-3.5 text-base font-semibold border border-white/30 text-white rounded-lg hover:bg-white/10 transition-colors">
                                            Lihat Lapangan
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}
