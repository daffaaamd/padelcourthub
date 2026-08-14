import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatusBadge from '@/Components/StatusBadge';
import { TrendingUp, CalendarCheck, Users, TableProperties, DollarSign, ArrowRight } from 'lucide-react';

interface Props {
    stats: {
        total_revenue: number;
        bookings_today: number;
        total_bookings: number;
        active_customers: number;
        active_courts: number;
        this_month_revenue: number;
        last_month_revenue: number;
    };
    booking_chart: Array<{ date: string; label: string; bookings: number; revenue: number }>;
    recent_bookings: Array<{
        booking_code: string;
        user_name: string;
        venue_name: string;
        court_name: string;
        date: string;
        total: number;
        status: string;
        payment_status: string;
        created_at: string;
    }>;
    popular_venues: Array<{
        name: string;
        city: string;
        bookings_count: number;
        cover_image_url: string;
    }>;
}

export default function AdminDashboard({
    stats = {
        total_revenue: 0,
        bookings_today: 0,
        total_bookings: 0,
        active_customers: 0,
        active_courts: 0,
        this_month_revenue: 0,
        last_month_revenue: 0,
    },
    booking_chart = [],
    recent_bookings = [],
    popular_venues = [],
}: Props) {
    const fmt = (v?: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v || 0);
    const maxBookings = Math.max(...(booking_chart.length > 0 ? booking_chart.map(d => d.bookings) : [0]), 1);
    const maxRevenue = Math.max(...(booking_chart.length > 0 ? booking_chart.map(d => d.revenue) : [0]), 1);

    const revenueGrowth = (stats?.last_month_revenue ?? 0) > 0
        ? (((stats?.this_month_revenue ?? 0) - (stats?.last_month_revenue ?? 0)) / (stats?.last_month_revenue || 1) * 100).toFixed(1)
        : null;

    const statCards = [
        { label: 'Total Pendapatan', value: fmt(stats?.total_revenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', sub: revenueGrowth ? `${revenueGrowth}% vs bulan lalu` : null },
        { label: 'Booking Hari Ini', value: stats?.bookings_today ?? 0, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50', sub: `Total: ${stats?.total_bookings ?? 0}` },
        { label: 'Pelanggan Aktif', value: stats?.active_customers ?? 0, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50', sub: null },
        { label: 'Court Aktif', value: stats?.active_courts ?? 0, icon: TableProperties, color: 'text-amber-600', bg: 'bg-amber-50', sub: null },
    ];

    return (
        <AdminLayout title="Dashboard">
            <Head title="Admin Dashboard" />

            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statCards.map(card => {
                    const Icon = card.icon;
                    return (
                        <div key={card.label} className="card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-medium text-neutral-500">{card.label}</p>
                                <div className={`w-8 h-8 ${card.bg} rounded-lg flex items-center justify-center`}>
                                    <Icon size={16} className={card.color} />
                                </div>
                            </div>
                            <p className={`text-xl md:text-2xl font-bold ${card.color}`}>{card.value}</p>
                            {card.sub && <p className="text-xs text-neutral-400 mt-1">{card.sub}</p>}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
                {/* Booking chart */}
                <div className="card p-5 lg:col-span-2">
                    <h2 className="font-semibold text-neutral-900 mb-5">Booking & Pendapatan (7 Hari Terakhir)</h2>
                    <div className="flex items-end justify-between gap-2 h-36">
                        {booking_chart.map(day => (
                            <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex gap-0.5 items-end" style={{ height: '100px' }}>
                                    <div
                                        className="flex-1 bg-primary rounded-t transition-all"
                                        style={{ height: `${(day.bookings / maxBookings) * 100}%`, minHeight: '4px' }}
                                        title={`${day.bookings} booking`}
                                    />
                                    <div
                                        className="flex-1 bg-accent/60 rounded-t transition-all"
                                        style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                                        title={fmt(day.revenue)}
                                    />
                                </div>
                                <span className="text-[10px] text-neutral-400">{day.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <span className="w-3 h-3 rounded bg-primary inline-block" /> Booking
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                            <span className="w-3 h-3 rounded bg-accent/60 inline-block" /> Pendapatan
                        </div>
                    </div>
                </div>

                {/* Popular venues */}
                <div className="card p-5">
                    <h2 className="font-semibold text-neutral-900 mb-4">Venue Terpopuler</h2>
                    <div className="space-y-3">
                        {popular_venues.map((venue, idx) => (
                            <div key={venue.name} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-neutral-400 w-4">{idx + 1}</span>
                                <img src={venue.cover_image_url} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-neutral-900 truncate">{venue.name}</p>
                                    <p className="text-xs text-neutral-500">{venue.city}</p>
                                </div>
                                <span className="text-xs font-semibold text-primary flex-shrink-0">{venue.bookings_count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent bookings */}
            <div className="card">
                <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
                    <h2 className="font-semibold text-neutral-900">Booking Terbaru</h2>
                    <Link href={route('admin.bookings.index')} className="text-sm text-primary hover:underline flex items-center gap-1">
                        Lihat Semua <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50">
                                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500">Kode</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500">Pelanggan</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500">Venue · Court</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500">Tanggal</th>
                                <th className="px-5 py-3 text-right text-xs font-medium text-neutral-500">Total</th>
                                <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {recent_bookings.map(b => (
                                <tr key={b.booking_code} className="hover:bg-neutral-50 transition-colors">
                                    <td className="px-5 py-3.5 font-mono text-xs text-primary font-medium">{b.booking_code}</td>
                                    <td className="px-5 py-3.5 text-neutral-900 font-medium">{b.user_name}</td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-neutral-900">{b.venue_name}</p>
                                        <p className="text-xs text-neutral-400">{b.court_name}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-neutral-600">{b.date}</td>
                                    <td className="px-5 py-3.5 text-right font-semibold text-neutral-900">{fmt(b.total)}</td>
                                    <td className="px-5 py-3.5"><StatusBadge status={b.status} size="sm" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
