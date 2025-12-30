'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    FileText,
    Download,
    Filter,
    ArrowRight,
    Eye,
    Edit3
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, calculateDevisTotals, cn } from '@/lib/utils';
import Link from 'next/link';

export default function DevisPage() {
    const { devis, chantiers } = useData();
    const [search, setSearch] = useState('');

    const filteredDevis = devis.filter(d => {
        const chantier = chantiers.find(c => c.id === d.chantierId);
        return chantier?.name.toLowerCase().includes(search.toLowerCase()) ||
            d.id.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Devis</h1>
                    <p className="text-slate-500 mt-1">Créez et gérez les devis de vos chantiers.</p>
                </div>
                <Link href="/devis/nouveau" className="btn-primary flex items-center justify-center space-x-2">
                    <Plus size={20} />
                    <span>Nouveau Devis</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Rechercher par chantier ou numéro de devis..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border-slate-200 focus:ring-2 focus:ring-primary-600 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                    <Filter size={18} />
                    <span>Filtres</span>
                </button>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Référence</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Chantier</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Montant TTC</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredDevis.map((devis) => {
                            const chantier = chantiers.find(c => c.id === devis.chantierId);
                            const { totalTTC } = calculateDevisTotals(devis.lineItems, devis.tvaRate);

                            return (
                                <tr key={devis.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
                                                <FileText size={16} />
                                            </div>
                                            <span className="font-bold text-slate-900 uppercase">#{devis.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/chantiers/${chantier?.id}`} className="text-slate-600 hover:text-primary-600 font-medium flex items-center space-x-1">
                                            <span>{chantier?.name}</span>
                                            <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">
                                        {formatCurrency(totalTTC)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            devis.status === 'Accepté' ? "bg-emerald-50 text-emerald-700" :
                                                devis.status === 'Brouillon' ? "bg-slate-50 text-slate-600" :
                                                    devis.status === 'Envoyé' ? "bg-blue-50 text-blue-700" :
                                                        "bg-rose-50 text-rose-700"
                                        )}>
                                            {devis.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Link href={`/devis/${devis.id}`} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Voir">
                                                <Eye size={18} />
                                            </Link>
                                            <Link href={`/devis/${devis.id}/modifier`} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Modifier">
                                                <Edit3 size={18} />
                                            </Link>
                                            <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Télécharger PDF">
                                                <Download size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredDevis.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <FileText size={48} className="mx-auto text-slate-200 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900">Aucun devis trouvé</h3>
                    <p className="text-slate-500 mt-1">Commencez par créer un nouveau devis pour l'un de vos chantiers.</p>
                </div>
            )}
        </div>
    );
}
