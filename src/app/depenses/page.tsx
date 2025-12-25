'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    Receipt,
    Tag,
    ArrowRight,
    ExternalLink,
    ShoppingBag
} from 'lucide-react';
import { MOCK_EXPENSES, MOCK_CHANTIERS } from '@/lib/mockData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

export default function DepensesPage() {
    const [search, setSearch] = useState('');

    const filteredExpenses = MOCK_EXPENSES.filter(e => {
        const chantier = MOCK_CHANTIERS.find(c => c.id === e.chantierId);
        return chantier?.name.toLowerCase().includes(search.toLowerCase()) ||
            e.provider.toLowerCase().includes(search.toLowerCase()) ||
            e.type.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dépenses</h1>
                    <p className="text-slate-500 mt-1">Suivez les coûts de matériaux, main d'œuvre et transport.</p>
                </div>
                <Link href="/depenses/nouveau" className="btn-primary flex items-center justify-center space-x-2 bg-slate-900 shadow-slate-900/10">
                    <Plus size={20} />
                    <span>Nouvelle Dépense</span>
                </Link>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Chantier</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fournisseur</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Montant</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredExpenses.map((expense) => {
                            const chantier = MOCK_CHANTIERS.find(c => c.id === expense.chantierId);
                            return (
                                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-tighter shadow-sm mb-1",
                                            expense.type === 'matériaux' ? "bg-amber-50 text-amber-700" :
                                                expense.type === 'main-d’œuvre' ? "bg-purple-50 text-purple-700" :
                                                    "bg-blue-50 text-blue-700"
                                        )}>
                                            {expense.type}
                                        </span>
                                        <div className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                                            {expense.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/chantiers/${chantier?.id}`} className="text-slate-900 font-semibold hover:text-primary-600 flex items-center space-x-1">
                                            <span>{chantier?.name}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                                            <ShoppingBag size={14} className="text-slate-400" />
                                            <span>{expense.provider}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {formatDate(expense.date)}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-rose-600">
                                        {formatCurrency(expense.amount)}
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
