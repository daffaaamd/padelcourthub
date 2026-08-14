import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { MapPin, Phone, Mail, ExternalLink, Share2, MessageCircle } from 'lucide-react';

export default function Footer() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;

    const accountLinks = user
        ? [
            { label: 'Dashboard', href: user.role === 'admin' ? route('admin.dashboard') : route('dashboard') },
            { label: 'Booking Saya', href: route('bookings.index') },
            { label: 'Profil Saya', href: route('profile.edit') },
        ]
        : [
            { label: 'Daftar Akun', href: route('register') },
            { label: 'Masuk', href: route('login') },
            { label: 'Booking Saya', href: route('bookings.index') },
        ];

    return (
        <footer className="bg-neutral-900 text-neutral-400">
            <div className="container-app py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand & Developer Highlight */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <rect x="2" y="8" width="20" height="8" rx="1" stroke="white" strokeWidth="1.8"/>
                                    <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="1.8"/>
                                    <circle cx="12" cy="4" r="2" fill="white"/>
                                    <path d="M7 16v3M17 16v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <span className="text-white font-bold text-lg tracking-tight">PadelCourt</span>
                        </div>
                        <p className="text-sm leading-relaxed mb-4 text-neutral-400">
                            Platform digital pencarian dan pemesanan lapangan padel modern di Indonesia.
                        </p>

                        {/* Prominent Developer Card */}
                        <div className="mb-5 p-3.5 rounded-xl bg-neutral-800/90 border border-neutral-700/80 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-300 font-bold text-xs flex-shrink-0">
                                    DA
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-neutral-400 font-medium leading-none">Designed & Developed by</p>
                                    <p className="text-sm font-bold text-white tracking-wide mt-1 truncate">Daffa Ahmad Baihaqi</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {[ExternalLink, Share2, MessageCircle].map((Icon, i) => (
                                <a key={i} href="#" className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Platform</h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                { label: 'Cari Lapangan', href: route('courts.index') },
                                { label: 'Daftar Venue', href: route('venues.index') },
                                { label: 'Promo & Diskon', href: route('promos.index') },
                            ].map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Akun</h4>
                        <ul className="space-y-2.5 text-sm">
                            {accountLinks.map(item => (
                                <li key={item.label}>
                                    <Link href={item.href} className="hover:text-white transition-colors">{item.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4">Kontak</h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-2.5">
                                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-primary-400" />
                                <span>Jakarta Selatan, Indonesia</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Phone size={14} className="flex-shrink-0 text-primary-400" />
                                <span>+62 812-3456-7890</span>
                            </li>
                            <li className="flex items-center gap-2.5">
                                <Mail size={14} className="flex-shrink-0 text-primary-400" />
                                <span>hello@padelcourt.id</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-400 text-center sm:text-left">
                    <p>© {new Date().getFullYear()} PadelCourt. Karya inovasi resmi oleh <span className="text-white font-semibold">Daffa Ahmad Baihaqi</span>.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-white transition-colors">Kebijakan Privasi</a>
                        <a href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
