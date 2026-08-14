import React from 'react';

interface StatusBadgeProps {
    status: string;
    size?: 'sm' | 'md';
}

const statusMap: Record<string, { label: string; className: string }> = {
    // Booking statuses
    pending: { label: 'Menunggu Pembayaran', className: 'bg-amber-50 text-amber-700 border border-amber-200' },
    confirmed: { label: 'Dikonfirmasi', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    completed: { label: 'Selesai', className: 'bg-blue-50 text-blue-700 border border-blue-200' },
    cancelled: { label: 'Dibatalkan', className: 'bg-red-50 text-red-700 border border-red-200' },
    // Payment statuses
    paid: { label: 'Lunas', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    failed: { label: 'Gagal', className: 'bg-red-50 text-red-700 border border-red-200' },
    refunded: { label: 'Dikembalikan', className: 'bg-purple-50 text-purple-700 border border-purple-200' },
    // Court statuses
    available: { label: 'Tersedia', className: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    maintenance: { label: 'Maintenance', className: 'bg-orange-50 text-orange-700 border border-orange-200' },
    inactive: { label: 'Nonaktif', className: 'bg-neutral-100 text-neutral-600 border border-neutral-200' },
};

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusMap[status] ?? { label: status, className: 'bg-neutral-100 text-neutral-600' };
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

    return (
        <span className={`inline-flex items-center font-medium rounded-full ${sizeClass} ${config.className}`}>
            {config.label}
        </span>
    );
}
