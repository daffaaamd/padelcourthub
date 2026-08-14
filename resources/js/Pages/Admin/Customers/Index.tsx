import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Pagination } from '@/Components/UI';
import { Users, Mail, Phone, Calendar, DollarSign, Search, ShieldCheck } from 'lucide-react';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar_url: string;
    bookings_count: number;
    total_spent: number;
    joined_at: string;
}

interface Props {
    customers: {
        data: Customer[];
        total: number;
        last_page: number;
        links: Array<{ url: string | null; label: string; active: boolean }>;
    };
}

export default function AdminCustomersIndex({ customers }: Props) {
    const [search, setSearch] = useState('');

    const filteredCustomers = customers.data.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            (c.phone && c.phone.includes(search))
    );

    const formatCurrency = (v: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(v);

    return (
        <AdminLayout title="Manajemen Pelanggan">
            <Head title="Admin — Manajemen Pelanggan" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-neutral-900">Daftar Pelanggan</h1>
                    <p className="text-sm text-neutral-500">{customers.total} member padel terdaftar</p>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari nama atau email..."
                        className="form-input pl-9 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-neutral-50 border-b border-neutral-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Pelanggan</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600">Kontak</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Total Booking</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-right">Total Transaksi</th>
                                <th className="px-4 py-3 font-semibold text-neutral-600 text-center">Bergabung</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-neutral-50/80 transition-colors">
                                    <td className="px-4 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={customer.avatar_url}
                                                alt={customer.name}
                                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-neutral-200"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-semibold text-neutral-900 truncate">{customer.name}</p>
                                                <p className="text-xs text-neutral-400">ID: #{customer.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5 space-y-1">
                                        <p className="text-xs text-neutral-700 flex items-center gap-1.5">
                                            <Mail size={12} className="text-neutral-400" />
                                            {customer.email}
                                        </p>
                                        {customer.phone && (
                                            <p className="text-xs text-neutral-500 flex items-center gap-1.5">
                                                <Phone size={12} className="text-neutral-400" />
                                                {customer.phone}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3.5 text-center font-bold text-neutral-800">
                                        {customer.bookings_count} Booking
                                    </td>
                                    <td className="px-4 py-3.5 text-right font-bold text-primary">
                                        {formatCurrency(customer.total_spent)}
                                    </td>
                                    <td className="px-4 py-3.5 text-center text-xs text-neutral-500">
                                        {customer.joined_at}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredCustomers.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            Tidak ada pelanggan ditemukan.
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination */}
            {customers.last_page > 1 && (
                <Pagination links={customers.links} className="mt-4" />
            )}
        </AdminLayout>
    );
}
