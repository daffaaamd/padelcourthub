import React, { ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard, Building2, TableProperties, CalendarCheck,
    Tag, Users, ChevronLeft, ChevronRight, LogOut, Home, Menu, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
    { icon: Building2, label: 'Venue', href: '/admin/venues' },
    { icon: TableProperties, label: 'Court', href: '/admin/courts' },
    { icon: CalendarCheck, label: 'Booking', href: '/admin/bookings' },
    { icon: Tag, label: 'Promo', href: '/admin/promos' },
    { icon: Users, label: 'Pelanggan', href: '/admin/customers' },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth, flash } = usePage<any>().props;
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const currentPath = window.location.pathname;

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    const Sidebar = () => (
        <aside className={`h-full bg-neutral-900 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>
            {/* Logo */}
            <div className={`flex items-center gap-2.5 p-4 border-b border-neutral-800 ${collapsed ? 'justify-center' : ''}`}>
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="8" width="20" height="8" rx="1" stroke="white" strokeWidth="1.8"/>
                        <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="1.8"/>
                        <circle cx="12" cy="4" r="2" fill="white"/>
                        <path d="M7 16v3M17 16v3" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                </div>
                {!collapsed && <span className="text-white font-bold text-base">PadelCourt</span>}
            </div>

            {/* Nav items */}
            <nav className="flex-1 p-2 space-y-0.5 mt-2">
                {navItems.map(({ icon: Icon, label, href }) => {
                    const isActive = currentPath === href || (href !== '/admin' && currentPath.startsWith(href));
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                                isActive
                                    ? 'bg-primary text-white font-medium'
                                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                            } ${collapsed ? 'justify-center' : ''}`}
                            title={collapsed ? label : undefined}
                        >
                            <Icon size={17} className="flex-shrink-0" />
                            {!collapsed && <span>{label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-2 border-t border-neutral-800">
                <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors ${collapsed ? 'justify-center' : ''}`}>
                    <Home size={17} />
                    {!collapsed && <span>Ke Website</span>}
                </Link>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-950 hover:text-red-300 transition-colors w-full text-left ${collapsed ? 'justify-center' : ''}`}
                >
                    <LogOut size={17} />
                    {!collapsed && <span>Keluar</span>}
                </Link>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="hidden lg:flex items-center justify-center p-2 border-t border-neutral-800 text-neutral-500 hover:text-white transition-colors"
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </aside>
    );

    return (
        <div className="h-screen flex overflow-hidden bg-neutral-100">
            {/* Desktop sidebar */}
            <div className="hidden lg:block h-full">
                <Sidebar />
            </div>

            {/* Mobile sidebar */}
            {mobileOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
                    <div className="fixed left-0 top-0 h-full z-50 lg:hidden">
                        <Sidebar />
                    </div>
                </>
            )}

            {/* Main */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <button className="lg:hidden p-1.5 rounded text-neutral-500 hover:bg-neutral-100" onClick={() => setMobileOpen(!mobileOpen)}>
                            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                        </button>
                        {title && <h1 className="text-base font-semibold text-neutral-900">{title}</h1>}
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-neutral-600">{auth?.user?.name}</span>
                        <img src={auth?.user?.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
