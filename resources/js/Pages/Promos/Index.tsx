import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { Tag, CheckCircle2, XCircle, Clock, ArrowRight, Copy, Check, Sparkles, Percent, Gift, ChevronRight, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { EmptyState } from '@/Components/UI';

interface Promo {
    id: number;
    code: string;
    name: string;
    description?: string;
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
        current_page?: number;
        last_page?: number;
    } | Promo[];
}

export default function PromosIndex({ promos }: Props) {
    const promoList: Promo[] = Array.isArray(promos) ? promos : (promos?.data || []);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Kode "${code}" berhasil disalin ke clipboard!`);
        setTimeout(() => {
            setCopiedCode(null);
        }, 3000);
    };

    const handleUsePromo = (code: string) => {
        toast.success(`Menggunakan voucher "${code}". Silakan pilih lapangan.`);
        router.visit(route('courts.index', { promo: code }));
    };

    const formatDiscount = (p: Promo) =>
        p.type === 'percentage'
            ? `${p.value}%`
            : 'Rp ' + new Intl.NumberFormat('id-ID').format(p.value);

    const filteredPromos = promoList.filter(p =>
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <AppLayout>
            <Head title="Promo & Voucher Diskon Padel" />

            {/* Hero Header */}
            <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
                    <Tag size={280} />
                </div>
                <div className="container-app py-12 relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-1 rounded-full mb-4">
                        <Sparkles size={14} className="text-accent animate-spin-slow" />
                        Hemat Lebih Banyak Setiap Sesi Main
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        Voucher & Promo PadelCourt
                    </h1>
                    <p className="text-white/80 max-w-xl text-sm md:text-base leading-relaxed">
                        Klaim voucher diskon eksklusif untuk sewa lapangan padel favoritmu. Salin kode atau langsung klik tombol gunakan voucher.
                    </p>

                    {/* Search Voucher */}
                    <div className="mt-6 max-w-md relative">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Cari voucher (misal: PADELNEW, WEEKEND)..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-neutral-900 placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent border-0 shadow-lg"
                        />
                    </div>
                </div>
            </div>

            <div className="container-app py-10">
                {filteredPromos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPromos.map(promo => {
                            const isCopied = copiedCode === promo.code;
                            return (
                                <div
                                    key={promo.id}
                                    className={`bg-white rounded-2xl border shadow-sm transition-all duration-300 flex flex-col overflow-hidden relative group ${
                                        promo.is_valid
                                            ? 'border-neutral-200 hover:border-primary/40 hover:shadow-xl hover:-translate-y-1'
                                            : 'border-neutral-200 opacity-60'
                                    }`}
                                >
                                    {/* Top Voucher Banner */}
                                    <div className={`p-5 text-white relative ${promo.is_valid ? 'bg-gradient-to-r from-primary-700 to-primary-600' : 'bg-neutral-600'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${promo.is_valid ? 'bg-accent text-neutral-950 font-bold' : 'bg-white/20 text-white'}`}>
                                                {promo.is_valid ? '● AKTIF' : 'KEDALUWARSA'}
                                            </span>
                                            <span className="text-white/80 text-xs flex items-center gap-1 font-medium">
                                                <Clock size={12} /> s/d {promo.valid_until}
                                            </span>
                                        </div>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                                {formatDiscount(promo)}
                                            </span>
                                            <span className="text-xs text-white/80 uppercase font-semibold">
                                                {promo.type === 'percentage' ? 'OFF' : 'POTONGAN'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-white/70 mt-1">
                                            Min. transaksi Rp {new Intl.NumberFormat('id-ID').format(promo.min_transaction)}
                                        </p>
                                    </div>

                                    {/* Ticket Perforated Cutout */}
                                    <div className="relative flex items-center justify-between bg-white py-1">
                                        <div className="w-4 h-4 rounded-full bg-surface-alt -ml-2 border-r border-neutral-200" />
                                        <div className="flex-1 border-t-2 border-dashed border-neutral-200 mx-2" />
                                        <div className="w-4 h-4 rounded-full bg-surface-alt -mr-2 border-l border-neutral-200" />
                                    </div>

                                    {/* Voucher Body */}
                                    <div className="p-5 pt-2 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-neutral-900 text-base mb-1 group-hover:text-primary transition-colors">
                                                {promo.name}
                                            </h3>
                                            <p className="text-xs text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                                                {promo.description || `Dapatkan potongan harga ${formatDiscount(promo)} untuk booking lapangan padel di seluruh venue.`}
                                            </p>

                                            {/* Usage progress bar if applicable */}
                                            {promo.max_uses && (
                                                <div className="mb-4 bg-neutral-50 p-2.5 rounded-lg border border-neutral-100">
                                                    <div className="flex justify-between text-xs text-neutral-600 mb-1.5 font-medium">
                                                        <span>Kuota Terpakai</span>
                                                        <span>{promo.used_count} / {promo.max_uses}</span>
                                                    </div>
                                                    <div className="w-full bg-neutral-200 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-accent h-1.5 rounded-full transition-all duration-500"
                                                            style={{ width: `${Math.min(100, (promo.used_count / promo.max_uses) * 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Box */}
                                        <div className="space-y-2.5 pt-2">
                                            {/* Code Display & Copy */}
                                            <div
                                                onClick={() => promo.is_valid && copyCode(promo.code)}
                                                className={`flex items-center justify-between p-2.5 rounded-xl border border-dashed transition-all cursor-pointer ${
                                                    isCopied
                                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                                                        : 'bg-neutral-50 border-neutral-300 hover:border-primary/50 text-neutral-800'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Tag size={15} className="text-primary" />
                                                    <span className="font-mono font-bold text-sm tracking-wider">
                                                        {promo.code}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={!promo.is_valid}
                                                    className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors flex items-center gap-1 ${
                                                        isCopied
                                                            ? 'bg-emerald-600 text-white'
                                                            : 'bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                                                    }`}
                                                >
                                                    {isCopied ? (
                                                        <>
                                                            <Check size={12} /> Tersalin!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy size={12} /> Salin
                                                        </>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Use Promo Direct Button */}
                                            <button
                                                type="button"
                                                disabled={!promo.is_valid}
                                                onClick={() => handleUsePromo(promo.code)}
                                                className="w-full btn-primary py-2.5 text-xs font-semibold justify-center shadow-sm hover:shadow transition-all disabled:opacity-40"
                                            >
                                                Gunakan Voucher <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyState
                        icon={<Tag size={48} />}
                        title="Voucher tidak ditemukan"
                        description={searchQuery ? `Tidak ada voucher yang cocok dengan pencarian "${searchQuery}".` : 'Belum ada promo aktif saat ini.'}
                        action={
                            searchQuery ? (
                                <button onClick={() => setSearchQuery('')} className="btn-outline-primary text-xs">
                                    Reset Pencarian
                                </button>
                            ) : (
                                <Link href={route('courts.index')} className="btn-primary">
                                    Cari Lapangan
                                </Link>
                            )
                        }
                    />
                )}

                {/* How to use vouchers guide */}
                <div className="mt-16 bg-white rounded-2xl border border-neutral-200 p-6 md:p-8">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                        <Gift size={20} className="text-primary" /> Cara Menggunakan Voucher Diskon
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                                1
                            </div>
                            <div>
                                <h4 className="font-semibold text-neutral-900 text-sm mb-1">Pilih Voucher</h4>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    Klik tombol <b>Gunakan Voucher</b> atau salin kode voucher yang ingin kamu gunakan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                                2
                            </div>
                            <div>
                                <h4 className="font-semibold text-neutral-900 text-sm mb-1">Pilih Court & Jadwal</h4>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    Tentukan venue, lapangan padel, tanggal, serta jam mulai bermain yang kamu inginkan.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0">
                                3
                            </div>
                            <div>
                                <h4 className="font-semibold text-neutral-900 text-sm mb-1">Potongan Otomatis</h4>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                    Total pembayaran akan langsung terpotong diskon saat kamu menyelesaikan proses booking.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
