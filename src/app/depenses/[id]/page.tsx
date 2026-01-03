'use client';

import { useParams } from 'next/navigation';
import {
    ChevronLeft,
    Receipt,
    Calendar,
    ArrowLeft,
    Download,
    Edit3,
    Tag,
    ShoppingBag,
    MapPin,
    ExternalLink
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

export default function ViewExpensePage() {
    const { id } = useParams();
    const { expenses, chantiers } = useData();
    const expense = expenses.find(e => e.id === id);
    const chantier = expense ? chantiers.find(c => c.id === expense.chantierId) : null;

    if (!expense) {
        return <div className="p-20 text-center text-slate-500">Dépense non trouvée.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Navigation & Actions */}
            <div className="flex items-center justify-between">
                <Link href="/depenses" className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors group">
                    <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux dépenses</span>
                </Link>
                <div className="flex space-x-3">
                    {expense.proofUrl && (
                        <a
                            href={expense.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-white transition-all flex items-center space-x-2"
                        >
                            <ExternalLink size={18} />
                            <span>Voir Facture</span>
                        </a>
                    )}
                    <Link href={`/depenses/${id}/modifier`} className="btn-primary flex items-center space-x-2 bg-slate-900">
                        <Edit3 size={18} />
                        <span>Modifier</span>
                    </Link>
                </div>
            </div>

            {/* Content Voucher */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-12 border-b-8 border-rose-600 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
                                <Receipt size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">JUSTIFICATIF DE DÉPENSE</h1>
                                <p className="text-slate-500 font-bold">Réf: #E-{expense.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={cn(
                                "inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4",
                                expense.type === 'matériaux' ? "bg-amber-100 text-amber-700" :
                                    expense.type === 'main-d’œuvre' ? "bg-purple-100 text-purple-700" :
                                        "bg-blue-100 text-blue-700"
                            )}>
                                {expense.type}
                            </span>
                            <p className="text-sm text-slate-400 font-medium uppercase tracking-wider">Date d'opération</p>
                            <p className="text-lg font-black text-slate-900">{formatDate(expense.date)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Fournisseur / Prestataire</p>
                            <div>
                                <p className="text-xl font-black text-slate-900">{expense.provider}</p>
                                <div className="flex items-center text-slate-500 mt-2">
                                    <ShoppingBag size={16} className="mr-2" />
                                    <span className="capitalize">{expense.type}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Affectation Chantier</p>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                <p className="font-bold text-slate-900">{chantier?.name || 'Projet inconnu'}</p>
                                <div className="flex items-center text-slate-500 text-xs mt-1">
                                    <MapPin size={12} className="mr-1" />
                                    <span>{chantier?.location}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-12 space-y-8">
                    <div className="space-y-4">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-4">Description de la dépense</p>
                        <p className="text-xl text-slate-700 font-medium leading-relaxed">
                            {expense.description}
                        </p>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex justify-between items-end">
                        <div className="space-y-1">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Montant total engagé</p>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                                {formatCurrency(expense.amount)}
                            </h2>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center bg-rose-50 text-rose-700 px-4 py-2 rounded-xl font-bold text-sm border border-rose-100">
                                <Tag size={16} className="mr-2" />
                                <span>Payé à {expense.provider}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
