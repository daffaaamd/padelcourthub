import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Skeleton components for loading states

export function VenueCardSkeleton() {
    return (
        <div className="card overflow-hidden">
            <div className="skeleton h-48 w-full" />
            <div className="p-4 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded" />
                <div className="skeleton h-3.5 w-1/2 rounded" />
                <div className="flex gap-2">
                    <div className="skeleton h-5 w-16 rounded-full" />
                    <div className="skeleton h-5 w-16 rounded-full" />
                    <div className="skeleton h-5 w-16 rounded-full" />
                </div>
                <div className="flex justify-between items-center pt-1">
                    <div className="skeleton h-5 w-24 rounded" />
                    <div className="skeleton h-8 w-24 rounded" />
                </div>
            </div>
        </div>
    );
}

export function BookingCardSkeleton() {
    return (
        <div className="card p-4 space-y-3">
            <div className="flex gap-4">
                <div className="skeleton w-20 h-20 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-2/3 rounded" />
                    <div className="skeleton h-3.5 w-1/2 rounded" />
                    <div className="skeleton h-3.5 w-1/3 rounded" />
                </div>
            </div>
        </div>
    );
}

export function StatsCardSkeleton() {
    return (
        <div className="card p-5 space-y-2">
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-8 w-2/3 rounded" />
        </div>
    );
}

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="text-center py-16 px-4">
            {icon && (
                <div className="flex justify-center mb-4 text-neutral-300">
                    {icon}
                </div>
            )}
            <h3 className="text-base font-semibold text-neutral-700 mb-1">{title}</h3>
            {description && <p className="text-sm text-neutral-500 mb-5 max-w-sm mx-auto">{description}</p>}
            {action}
        </div>
    );
}

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, confirmLabel = 'Konfirmasi', cancelLabel = 'Batal', danger = false, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-sm w-full animate-slide-up">
                <h3 className="text-base font-semibold text-neutral-900 mb-2">{title}</h3>
                <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button onClick={onCancel} className="btn-outline">
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={danger ? 'btn-danger' : 'btn-primary'}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links?: PaginationLink[];
    className?: string;
}

export function Pagination({ links, className = '' }: PaginationProps) {
    if (!links || links.length <= 3) return null;

    const formatLabel = (raw: string) => {
        const text = raw.replace('&laquo;', '').replace('&raquo;', '').replace('&amp;', '&').trim();
        if (
            text.toLowerCase().includes('previous') ||
            text.toLowerCase().includes('sebelumnya') ||
            text.includes('pagination.previous') ||
            raw.includes('&laquo;')
        ) {
            return (
                <span className="inline-flex items-center gap-1">
                    <ChevronLeft size={15} />
                    <span className="hidden sm:inline">Sebelumnya</span>
                </span>
            );
        }
        if (
            text.toLowerCase().includes('next') ||
            text.toLowerCase().includes('selanjutnya') ||
            text.includes('pagination.next') ||
            raw.includes('&raquo;')
        ) {
            return (
                <span className="inline-flex items-center gap-1">
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight size={15} />
                </span>
            );
        }
        return text;
    };

    return (
        <nav className={`flex items-center justify-center gap-1.5 flex-wrap ${className}`} aria-label="Navigasi Halaman">
            {links.map((link, idx) => {
                const isNavButton =
                    link.label.toLowerCase().includes('previous') ||
                    link.label.toLowerCase().includes('next') ||
                    link.label.includes('pagination.') ||
                    link.label.includes('&laquo;') ||
                    link.label.includes('&raquo;');

                if (!link.url) {
                    return (
                        <span
                            key={idx}
                            className={`h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm text-neutral-400 bg-neutral-100 cursor-not-allowed select-none ${
                                isNavButton ? 'px-3' : 'min-w-[36px] px-2.5'
                            }`}
                        >
                            {formatLabel(link.label)}
                        </span>
                    );
                }

                return (
                    <Link
                        key={idx}
                        href={link.url}
                        className={`h-9 flex items-center justify-center rounded-lg text-xs sm:text-sm font-medium transition-all ${
                            link.active
                                ? 'bg-primary text-white font-bold shadow-xs min-w-[36px] px-3'
                                : 'bg-white border border-neutral-300 text-neutral-700 hover:border-primary hover:text-primary min-w-[36px] px-3 shadow-2xs'
                        }`}
                    >
                        {formatLabel(link.label)}
                    </Link>
                );
            })}
        </nav>
    );
}
