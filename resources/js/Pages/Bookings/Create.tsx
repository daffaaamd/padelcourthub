import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Calendar, Clock, Timer, Tag, ChevronRight, AlertCircle, CheckCircle2, Loader2, Sparkles, X, Gift } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PricingRule {
    name: string;
    day_type: string;
    start_time: string;
    end_time: string;
    price_per_hour: number;
}

interface Court {
    id: number;
    name: string;
    type: string;
    cover_image_url: string;
    venue: {
        id: number;
        name: string;
        slug: string;
        city: string;
        opening_time: string;
        closing_time: string;
    };
    pricing_rules: PricingRule[];
}

interface Props {
    court: Court;
    preselected?: {
        date?: string;
        start_time?: string;
        promo?: string;
    };
}

interface AvailabilitySlot {
    time: string;
    start?: string;
    end?: string;
    status?: 'available' | 'booked' | 'past';
    available?: boolean;
    price?: number;
}

type DurationOption = 1 | 1.5 | 2 | 3 | 4;

const durations: DurationOption[] = [1, 1.5, 2, 3, 4];

// Recommended popular vouchers for quick-selection
const popularVouchers = [
    { code: 'PADELNEW50', label: 'Diskon Rp50.000', desc: 'Member Baru' },
    { code: 'WEEKEND20', label: 'Diskon 20%', desc: 'Weekend Game' },
    { code: 'SMASH100', label: 'Diskon Rp100.000', desc: 'Min. Rp300rb' },
    { code: 'COMMUNITY15', label: 'Diskon 15%', desc: 'Komunitas Padel' },
];

export default function BookingCreate({ court, preselected }: Props) {
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(preselected?.date || today);
    const [selectedTime, setSelectedTime] = useState(preselected?.start_time || '');
    const [selectedDuration, setSelectedDuration] = useState<DurationOption>(1);
    const [promoCode, setPromoCode] = useState(preselected?.promo || '');
    const [promoResult, setPromoResult] = useState<{
        valid: boolean;
        discount: number;
        message: string;
        promo?: {
            id: number;
            code: string;
            name: string;
            type: 'percentage' | 'fixed';
            value: number;
            min_transaction: number;
        };
    } | null>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const { auth } = usePage<any>().props;

    // Fetch availability
    const fetchSlots = useCallback(async (date: string) => {
        setSlotsLoading(true);
        setSelectedTime('');
        try {
            const res = await axios.get(route('courts.availability', court.id), { params: { date } });
            setSlots(res.data.slots || []);
        } catch {
            setSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    }, [court.id]);

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate, fetchSlots]);

    // Check URL search params for promo code on mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPromo = urlParams.get('promo') || preselected?.promo || '';
        if (urlPromo) {
            setPromoCode(urlPromo.toUpperCase());
            validatePromo(urlPromo.toUpperCase());
        }
    }, []);

    // Calculate pricing
    const getPrice = (): number => {
        if (!selectedTime || !selectedDate) return 0;
        const date = new Date(selectedDate);
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const dayType = isWeekend ? 'weekend' : 'weekday';
        const [h] = selectedTime.split(':').map(Number);

        const matchingRule = court.pricing_rules?.find(rule => {
            if (rule.day_type !== dayType && rule.day_type !== 'all') return false;
            const [sh] = rule.start_time.split(':').map(Number);
            const [eh] = rule.end_time.split(':').map(Number);
            return h >= sh && h < eh;
        }) || court.pricing_rules?.find(r => r.day_type === dayType) || court.pricing_rules?.[0];

        const basePrice = matchingRule ? matchingRule.price_per_hour : 150000;
        return Math.round(basePrice * selectedDuration);
    };

    const subtotal = getPrice();

    // Recalculate discount based on subtotal
    const discount = React.useMemo(() => {
        if (!promoResult?.valid) return 0;
        if (subtotal === 0) return promoResult.discount || 0;

        if (promoResult.promo?.type === 'percentage') {
            return Math.round((subtotal * promoResult.promo.value) / 100);
        }
        if (promoResult.promo?.type === 'fixed') {
            return Math.min(promoResult.promo.value, subtotal);
        }
        return Math.min(promoResult.discount, subtotal);
    }, [promoResult, subtotal]);

    const total = Math.max(0, subtotal - discount);

    const formatCurrency = (v: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v);

    const validatePromo = async (codeToValidate?: string) => {
        const code = (codeToValidate || promoCode).trim().toUpperCase();
        if (!code) {
            toast.error('Masukkan kode promo terlebih dahulu.');
            return;
        }

        setPromoLoading(true);
        try {
            const res = await axios.post(route('promos.validate'), {
                code,
                amount: subtotal || 150000,
            });

            setPromoResult(res.data);
            if (res.data.valid) {
                toast.success(`Promo "${code}" berhasil diterapkan!`);
            } else {
                toast.error(res.data.message || 'Kode promo tidak valid.');
            }
        } catch (err: any) {
            setPromoResult({ valid: false, discount: 0, message: 'Kode promo tidak valid atau koneksi bermasalah.' });
            toast.error('Kode promo tidak valid.');
        } finally {
            setPromoLoading(false);
        }
    };

    const handleApplyVoucher = (code: string) => {
        setPromoCode(code);
        validatePromo(code);
    };

    const handleRemovePromo = () => {
        setPromoCode('');
        setPromoResult(null);
        toast('Voucher dihapus.', { icon: 'ℹ️' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth.user) {
            toast.error('Silakan login untuk melakukan booking.');
            router.visit(route('login'));
            return;
        }
        if (!selectedTime) {
            toast.error('Pilih jam mulai bermain terlebih dahulu.');
            return;
        }

        setSubmitting(true);
        router.post(route('bookings.store'), {
            court_id: court.id,
            date: selectedDate,
            start_time: selectedTime,
            duration_hours: selectedDuration,
            promo_code: (promoResult?.valid && promoCode) ? promoCode : undefined,
        }, {
            onError: (errs) => {
                setErrors(errs);
                setSubmitting(false);
                if (errs.slot) toast.error(errs.slot);
                if (errs.promo_code) toast.error(errs.promo_code);
            },
            onSuccess: () => setSubmitting(false),
        });
    };

    // Dates for next 14 days
    const next14Days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            dateStr: d.toISOString().split('T')[0],
            dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
            dayNum: d.getDate(),
            monthName: d.toLocaleDateString('id-ID', { month: 'short' }),
            isWeekend: d.getDay() === 0 || d.getDay() === 6,
        };
    });

    return (
        <AppLayout>
            <Head title={`Booking — ${court.name}`} />

            <div className="container-app py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
                    <Link href={route('venues.index')} className="hover:text-primary">Venue</Link>
                    <ChevronRight size={14} />
                    <Link href={route('venues.show', court.venue.slug || court.venue.id)} className="hover:text-primary">{court.venue.name}</Link>
                    <ChevronRight size={14} />
                    <span className="text-neutral-900 font-medium">{court.name}</span>
                </nav>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left — Booking Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Court Summary Card */}
                            <div className="card p-5 flex items-center gap-4">
                                <img
                                    src={court.cover_image_url}
                                    alt={court.name}
                                    className="w-24 h-24 rounded-xl object-cover flex-shrink-0 shadow-sm"
                                />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${court.type === 'indoor' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {court.type === 'indoor' ? 'Indoor Court' : 'Outdoor Court'}
                                        </span>
                                        <span className="text-xs text-neutral-400 font-medium">·</span>
                                        <span className="text-xs text-neutral-500">{court.venue.city}</span>
                                    </div>
                                    <h1 className="text-xl font-bold text-neutral-900 mb-1">{court.name}</h1>
                                    <p className="text-sm text-neutral-500 font-medium">{court.venue.name}</p>
                                </div>
                            </div>

                            {/* 1. Date Selector */}
                            <div className="card p-5">
                                <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2 text-base">
                                    <Calendar size={18} className="text-primary" /> 1. Pilih Tanggal Bermain
                                </h2>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {next14Days.map(d => {
                                        const isSelected = selectedDate === d.dateStr;
                                        return (
                                            <button
                                                key={d.dateStr}
                                                type="button"
                                                onClick={() => setSelectedDate(d.dateStr)}
                                                className={`p-3 rounded-xl border text-center transition-all ${
                                                    isSelected
                                                        ? 'bg-primary text-white border-primary shadow-md scale-105'
                                                        : 'border-neutral-200 bg-white hover:border-primary/50 text-neutral-800'
                                                }`}
                                            >
                                                <span className={`text-xs uppercase font-bold block ${isSelected ? 'text-white/80' : d.isWeekend ? 'text-amber-600' : 'text-neutral-400'}`}>
                                                    {d.dayName}
                                                </span>
                                                <span className="text-lg font-extrabold block my-0.5">
                                                    {d.dayNum}
                                                </span>
                                                <span className={`text-[10px] block ${isSelected ? 'text-white/70' : 'text-neutral-400'}`}>
                                                    {d.monthName}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 2. Duration Selector */}
                            <div className="card p-5">
                                <h2 className="font-semibold text-neutral-900 mb-4 flex items-center gap-2 text-base">
                                    <Timer size={18} className="text-primary" /> 2. Pilih Durasi
                                </h2>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    {durations.map(dur => {
                                        const isSelected = selectedDuration === dur;
                                        return (
                                            <button
                                                key={dur}
                                                type="button"
                                                onClick={() => setSelectedDuration(dur)}
                                                className={`p-3 rounded-xl border text-center transition-all ${
                                                    isSelected
                                                        ? 'bg-primary text-white border-primary font-bold shadow-md'
                                                        : 'border-neutral-200 bg-white hover:border-primary/50 text-neutral-800'
                                                }`}
                                            >
                                                <span className="text-base block font-bold">{dur} Jam</span>
                                                <span className={`text-xs block ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                                                    {dur * 60} Menit
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 3. Time Slots */}
                            <div className="card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-semibold text-neutral-900 flex items-center gap-2 text-base">
                                        <Clock size={18} className="text-primary" /> 3. Pilih Jam Mulai
                                    </h2>
                                    <span className="text-xs text-neutral-500">
                                        Jam Operasional: {court.venue.opening_time?.slice(0, 5) || '06:00'} - {court.venue.closing_time?.slice(0, 5) || '22:00'}
                                    </span>
                                </div>

                                {slotsLoading ? (
                                    <div className="py-8 text-center text-neutral-400 flex items-center justify-center gap-2">
                                        <Loader2 size={18} className="animate-spin text-primary" /> Memuat ketersediaan slot...
                                    </div>
                                ) : slots.length > 0 ? (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                                        {slots.map(slot => {
                                            const isAvailable = slot.available !== undefined ? Boolean(slot.available) : slot.status === 'available';
                                            const isSelected = selectedTime === slot.time;
                                            return (
                                                <button
                                                    key={slot.time}
                                                    type="button"
                                                    disabled={!isAvailable}
                                                    onClick={() => setSelectedTime(slot.time)}
                                                    className={`py-3 px-2 rounded-xl text-center text-sm font-semibold transition-all ${
                                                        !isAvailable
                                                            ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed line-through opacity-50'
                                                            : isSelected
                                                            ? 'bg-primary text-white border-primary shadow-md font-bold scale-105 ring-2 ring-primary/20'
                                                            : 'bg-white border border-neutral-200 text-neutral-800 hover:border-primary hover:text-primary cursor-pointer hover:shadow-sm'
                                                    }`}
                                                >
                                                    {slot.time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-neutral-500 py-4 text-center">
                                        Tidak ada slot tersedia untuk tanggal ini.
                                    </p>
                                )}
                            </div>

                            {/* 4. Voucher & Promo Code Section */}
                            <div className="card p-5 border-2 border-primary/20 bg-primary/5">
                                <h2 className="font-semibold text-neutral-900 mb-3 flex items-center justify-between text-base">
                                    <span className="flex items-center gap-2">
                                        <Tag size={18} className="text-primary" /> 4. Kode Promo / Voucher
                                    </span>
                                    <Link href={route('promos.index')} target="_blank" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                                        <Sparkles size={13} className="text-accent" /> Lihat Semua Voucher
                                    </Link>
                                </h2>

                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={e => {
                                            setPromoCode(e.target.value.toUpperCase());
                                            if (promoResult) setPromoResult(null);
                                        }}
                                        placeholder="Ketik kode promo (misal: PADELNEW50)"
                                        className="form-input flex-1 font-mono uppercase tracking-wider font-semibold text-sm bg-white"
                                    />
                                    {promoResult?.valid ? (
                                        <button
                                            type="button"
                                            onClick={handleRemovePromo}
                                            className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors flex items-center gap-1.5"
                                        >
                                            <X size={15} /> Hapus
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => validatePromo()}
                                            disabled={promoLoading || !promoCode.trim()}
                                            className="btn-primary px-5 py-2 text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5"
                                        >
                                            {promoLoading ? <Loader2 size={15} className="animate-spin" /> : 'Terapkan'}
                                        </button>
                                    )}
                                </div>

                                {/* Promo validation status banner */}
                                {promoResult && (
                                    <div className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between mb-3 ${
                                        promoResult.valid
                                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                            : 'bg-red-100 text-red-900 border border-red-300'
                                    }`}>
                                        <div className="flex items-center gap-2">
                                            {promoResult.valid ? <CheckCircle2 size={16} className="text-emerald-700 flex-shrink-0" /> : <AlertCircle size={16} className="text-red-700 flex-shrink-0" />}
                                            <span>{promoResult.message}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Quick-select popular vouchers */}
                                <div className="mt-3">
                                    <p className="text-xs text-neutral-500 font-medium mb-2 flex items-center gap-1">
                                        <Gift size={13} className="text-accent" /> Voucher Populer (Klik untuk Pakai Langsung):
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {popularVouchers.map(v => (
                                            <button
                                                key={v.code}
                                                type="button"
                                                onClick={() => handleApplyVoucher(v.code)}
                                                className={`p-2 rounded-lg text-left border transition-all ${
                                                    promoCode === v.code && promoResult?.valid
                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900'
                                                        : 'bg-white border-neutral-200 hover:border-primary text-neutral-800'
                                                }`}
                                            >
                                                <span className="font-mono font-bold text-xs block text-primary">{v.code}</span>
                                                <span className="text-[11px] text-neutral-600 block">{v.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right — Order Summary */}
                        <div>
                            <div className="card p-6 sticky top-24 shadow-lg border border-neutral-200">
                                <h3 className="font-bold text-neutral-900 text-lg mb-4 pb-3 border-b border-neutral-100">
                                    Ringkasan Pesanan
                                </h3>

                                <div className="space-y-3 text-sm mb-4">
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Court</span>
                                        <span className="font-semibold text-neutral-900">{court.name}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Tanggal</span>
                                        <span className="font-semibold text-neutral-900">
                                            {selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Jam Mulai</span>
                                        <span className="font-semibold text-neutral-900">{selectedTime || 'Belum dipilih'}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Durasi Main</span>
                                        <span className="font-semibold text-neutral-900">{selectedDuration} Jam</span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-neutral-200 my-4" />

                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between text-neutral-600">
                                        <span>Subtotal ({selectedDuration} jam)</span>
                                        <span className="font-semibold text-neutral-900">{subtotal > 0 ? formatCurrency(subtotal) : '—'}</span>
                                    </div>

                                    {discount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-semibold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                                            <span className="flex items-center gap-1">
                                                <Tag size={13} /> Diskon ({promoCode})
                                            </span>
                                            <span>-{formatCurrency(discount)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-baseline font-bold text-lg pt-3 border-t border-neutral-200">
                                        <span className="text-neutral-900">Total Biaya</span>
                                        <span className="text-2xl text-primary font-extrabold">
                                            {total > 0 ? formatCurrency(total) : subtotal > 0 ? formatCurrency(subtotal) : '—'}
                                        </span>
                                    </div>
                                </div>

                                {errors.slot && (
                                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                                        {errors.slot}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting || !selectedTime || subtotal === 0}
                                    className="btn-primary-lg w-full justify-center mt-6 text-base font-bold shadow-md hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" /> Memproses Booking...
                                        </>
                                    ) : (
                                        'Lanjut ke Pembayaran'
                                    )}
                                </button>

                                <div className="mt-4 text-center">
                                    <p className="text-xs text-neutral-400">
                                        🔒 Transaksi aman & booking terverifikasi instan
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
