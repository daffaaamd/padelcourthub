import React, { PropsWithChildren } from 'react';
import { Link } from '@inertiajs/react';

interface GuestLayoutProps extends PropsWithChildren {
    title?: string;
    subtitle?: string;
}

export default function GuestLayout({ children, title, subtitle }: GuestLayoutProps) {
    return (
        <div className="min-h-screen bg-surface-alt flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                {/* Brand Logo */}
                <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <rect x="2" y="8" width="20" height="8" rx="1" stroke="white" strokeWidth="2" />
                            <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="2" />
                            <circle cx="12" cy="4" r="2.5" fill="white" />
                            <path d="M7 16v3M17 16v3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </div>
                    <span className="font-extrabold text-2xl tracking-tight text-neutral-900">
                        PadelCourt
                    </span>
                </Link>

                {title && (
                    <h2 className="text-xl font-bold text-neutral-900">
                        {title}
                    </h2>
                )}
                {subtitle && (
                    <p className="mt-1 text-sm text-neutral-500">
                        {subtitle}
                    </p>
                )}
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-6 shadow-panel rounded-2xl sm:px-10 border border-neutral-200/80">
                    {children}
                </div>
            </div>
        </div>
    );
}
