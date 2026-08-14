import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Menu, X, ChevronDown, Bell, Search, User, LogOut, LayoutDashboard, BookOpen, Heart, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface NavbarProps {
    transparent?: boolean;
}

export default function Navbar({ transparent = false }: NavbarProps) {
    const { auth, flash } = usePage<any>().props;
    const user = auth?.user;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const navLinks = [
        { label: 'Beranda', href: route('home') },
        { label: 'Lapangan', href: route('courts.index') },
        { label: 'Venue', href: route('venues.index') },
        { label: 'Promo', href: route('promos.index') },
    ];

    const isScrolledOrSolid = scrolled || !transparent;

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            isScrolledOrSolid
                ? 'bg-white border-b border-neutral-200 shadow-sm'
                : 'bg-transparent'
        }`}>
            <div className="container-app">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={route('home')} className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="2" y="8" width="20" height="8" rx="1" stroke="white" strokeWidth="1.8"/>
                                <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="1.8"/>
                                <circle cx="12" cy="4" r="2" fill="white"/>
                                <path d="M7 16v3M17 16v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                        </div>
                        <span className={`font-bold text-lg tracking-tight ${isScrolledOrSolid ? 'text-neutral-900' : 'text-white'}`}>
                            PadelCourt
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3.5 py-2 rounded text-sm font-medium transition-colors ${
                                    isScrolledOrSolid
                                        ? 'text-neutral-600 hover:text-primary hover:bg-primary-50'
                                        : 'text-white/90 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="btn-outline text-xs flex items-center gap-1.5"
                                    >
                                        <Settings size={14} />
                                        Admin
                                    </Link>
                                )}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                                    >
                                        <img
                                            src={user.avatar_url}
                                            alt={user.name}
                                            className="w-7 h-7 rounded-full object-cover"
                                        />
                                        <span className="text-sm font-medium text-neutral-700 max-w-[120px] truncate">
                                            {user.name.split(' ')[0]}
                                        </span>
                                        <ChevronDown size={14} className="text-neutral-400" />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-panel border border-neutral-100 py-1 animate-fade-in">
                                            <div className="px-4 py-2.5 border-b border-neutral-100">
                                                <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                                                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                                            </div>
                                            <Link href={route('dashboard')} className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary">
                                                <LayoutDashboard size={15} /> Dashboard
                                            </Link>
                                            <Link href={route('bookings.index')} className="flex items-center gap-2.5 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary">
                                                <BookOpen size={15} /> Booking Saya
                                            </Link>
                                            <div className="border-t border-neutral-100 mt-1">
                                                <Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                                >
                                                    <LogOut size={15} /> Keluar
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                                        isScrolledOrSolid
                                            ? 'text-neutral-700 hover:text-primary hover:bg-neutral-100'
                                            : 'text-white hover:bg-white/10'
                                    }`}
                                >
                                    Masuk
                                </Link>
                                <Link href={route('register')} className="btn-primary text-sm">
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            isScrolledOrSolid ? 'text-neutral-600 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
                        }`}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-neutral-200 shadow-lg animate-slide-up">
                    <div className="container-app py-3 space-y-1">
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="border-t border-neutral-200 pt-3 mt-2">
                            {user ? (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3 px-3 py-2">
                                        <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">{user.name}</p>
                                            <p className="text-xs text-neutral-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href={user.role === 'admin' ? route('admin.dashboard') : route('dashboard')}
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg"
                                    >
                                        Dashboard {user.role === 'admin' ? 'Admin' : ''}
                                    </Link>
                                    <Link href={route('bookings.index')} onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 rounded-lg">Booking Saya</Link>
                                    <Link href={route('logout')} method="post" as="button" className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Keluar</Link>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <Link href={route('login')} className="flex-1 btn-outline text-center text-sm py-2.5">Masuk</Link>
                                    <Link href={route('register')} className="flex-1 btn-primary text-center text-sm py-2.5">Daftar</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay */}
            {(profileOpen || mobileOpen) && (
                <div className="fixed inset-0 z-[-1]" onClick={() => { setProfileOpen(false); setMobileOpen(false); }} />
            )}
        </nav>
    );
}
