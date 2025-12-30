'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    CreditCard,
    ArrowRight,
    History
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function PaiementsPage() {
    const { payments, chantiers } = useData();
    const [search, setSearch] = useState('');

    const filteredPayments = payments.filter(p => {
        const chantier = chantiers.find(c => c.id === p.chantierId);
        return chantier?.name.toLowerCase().includes(search.toLowerCase()) ||
            p.method.toLowerCase().includes(search.toLowerCase());
    });

    const totalEncaissed = payments.reduce((acc, p) => acc + p.amount, 0);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Paiements & Avances</h1>
                    <p className="text-slate-500 mt-1">Suivez les encaissements et les acomptes clients.</p>
                </div>
                <Link href="/paiements/nouveau" className="btn-primary flex items-center justify-center space-x-2">
                    <Plus size={20} />
                    <span>Enregistrer un Paiement</span>
                </Link>
            </div>

            {/* Stats Quick View */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-2xl bg-emerald-50/50 border-emerald-100">
                    <p className="text-sm font-semibold text-emerald-600 mb-1">Total Encaissé</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        {formatCurrency(totalEncaissed)}
                    </h3>
                </div>
                <div className="glass p-6 rounded-2xl bg-blue-50/50 border-blue-100">
                    <p className="text-sm font-semibold text-blue-600 mb-1">Paiement Récent</p>
                    <h3 className="text-2xl font-bold text-slate-900">
                        {formatCurrency(payments[0]?.amount || 0)}
                    </h3>
                </div>
                <div className="glass p-6 rounded-2xl bg-slate-50/50 border-slate-200">
                    <p className="text-sm font-semibold text-slate-500 mb-1">Nombre d'opérations</p>
                    <h3 className="text-2xl font-bold text-slate-900">{payments.length}</h3>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher par chantier ou moyen de paiement..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary-600 outline-none glass"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Chantier</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Méthode</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Montant</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredPayments.map((payment) => {
                            const chantier = chantiers.find(c => c.id === payment.chantierId);
                            return (
                                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {formatDate(payment.date)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/chantiers/${chantier?.id}`} className="text-slate-900 font-semibold hover:text-primary-600 flex items-center space-x-1">
                                            <span>{chantier?.name}</span>
                                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-sm text-slate-600 font-medium">
                                            <CreditCard size={14} className="text-slate-400" />
                                            <span>{payment.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-600">
                                        +{formatCurrency(payment.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                            <History size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
