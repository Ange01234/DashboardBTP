'use client';

import { useParams } from 'next/navigation';
import {
    ArrowLeft,
    MapPin,
    User,
    Calendar,
    Wallet,
    TrendingUp,
    AlertCircle,
    FileText,
    CreditCard,
    Receipt,
    Download,
    CheckCircle2
} from 'lucide-react';
import {
    MOCK_CHANTIERS,
    MOCK_DEVIS,
    MOCK_PAYMENTS,
    MOCK_EXPENSES
} from '@/lib/mockData';
import { formatCurrency, formatDate, calculateDevisTotals, cn } from '@/lib/utils';
import Link from 'next/link';

export default function ChantierDetailPage() {
    const { id } = useParams();
    const chantier = MOCK_CHANTIERS.find(c => c.id === id);

    if (!chantier) {
        return <div className="p-20 text-center">Chantier non trouvé.</div>;
    }

    // Filter linked data
    const chantierDevis = MOCK_DEVIS.filter(d => d.chantierId === id);
    const chantierPayments = MOCK_PAYMENTS.filter(p => p.chantierId === id);
    const chantierExpenses = MOCK_EXPENSES.filter(e => e.chantierId === id);

    // Calculations
    const totalDevisTTC = chantierDevis.reduce((acc, d) => acc + calculateDevisTotals(d.lineItems, d.tvaRate).totalTTC, 0);
    const totalPaid = chantierPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = chantierExpenses.reduce((acc, e) => acc + e.amount, 0);
    const remainingToPay = Math.max(0, totalDevisTTC - totalPaid);
    const netProfit = totalPaid - totalExpenses;
    const marginPercentage = totalPaid > 0 ? (netProfit / totalPaid) * 100 : 0;

    return (
        <div className="space-y-8 pb-20">
            {/* breadcrumbs & Actions */}
            <div className="flex items-center justify-between">
                <Link href="/chantiers" className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux chantiers</span>
                </Link>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-white transition-all flex items-center space-x-2">
                        <Download size={18} />
                        <span>Synthèse PDF</span>
                    </button>
                    <button className="btn-primary">Modifier</button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="glass p-8 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                            chantier.status === 'En cours' ? "bg-blue-100 text-blue-700" :
                                chantier.status === 'Terminé' ? "bg-emerald-100 text-emerald-700" :
                                    "bg-amber-100 text-amber-700"
                        )}>
                            {chantier.status}
                        </span>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{chantier.name}</h1>
                        <div className="flex flex-wrap gap-4 text-slate-500 mt-2">
                            <div className="flex items-center space-x-1">
                                <User size={16} />
                                <span>{chantier.client}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <MapPin size={16} />
                                <span>{chantier.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Calendar size={16} />
                                <span>Début: {formatDate(chantier.startDate)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm text-right">
                        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Budget Prévu</div>
                        <div className="text-3xl font-black text-slate-900">{formatCurrency(chantier.budget)}</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
            </div>

            {/* Financial Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-6 rounded-2xl border-l-4 border-l-blue-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Total Devis</p>
                        <FileText size={20} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{formatCurrency(totalDevisTTC)}</p>
                    <p className="text-xs text-slate-400 mt-1">Montant total des devis acceptés</p>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-l-emerald-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Encaissé</p>
                        <TrendingUp size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{formatCurrency(totalPaid)}</p>
                    <p className="text-xs text-slate-400 mt-1">{((totalPaid / totalDevisTTC) * 100).toFixed(0)}% du total devisé</p>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-l-rose-500">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Dépenses</p>
                        <AlertCircle size={20} className="text-rose-500" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{formatCurrency(totalExpenses)}</p>
                    <p className="text-xs text-slate-400 mt-1">Coûts engagés à ce jour</p>
                </div>

                <div className="glass p-6 rounded-2xl border-l-4 border-l-indigo-500 shadow-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Bénéfice Net</p>
                        <CheckCircle2 size={20} className="text-indigo-500" />
                    </div>
                    <p className={cn(
                        "text-2xl font-black",
                        netProfit >= 0 ? "text-slate-900" : "text-rose-600"
                    )}>
                        {formatCurrency(netProfit)}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">Rentabilité : {marginPercentage.toFixed(1)}%</p>
                </div>
            </div>

            {/* rentability & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Rentability & Synthesis */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Rentability Meter */}
                    <div className="glass p-8 rounded-3xl space-y-6 overflow-hidden">
                        <h3 className="text-xl font-bold text-slate-900">Analyse de Rentabilité</h3>
                        <div className="space-y-4">
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase">Marge brute estimée</p>
                                    <p className="text-3xl font-black text-slate-900">{marginPercentage.toFixed(1)}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-slate-400 uppercase">Reste à payer client</p>
                                    <p className="text-xl font-bold text-amber-600">{formatCurrency(remainingToPay)}</p>
                                </div>
                            </div>

                            <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={cn(
                                        "absolute top-0 left-0 h-full transition-all duration-1000",
                                        marginPercentage > 20 ? "bg-emerald-500" : marginPercentage > 5 ? "bg-blue-500" : "bg-rose-500"
                                    )}
                                    style={{ width: `${Math.min(100, Math.max(0, marginPercentage))}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>0%</span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Tabs (Mockup) */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">Historique Financier</h3>
                        <div className="glass rounded-3xl overflow-hidden">
                            <div className="flex border-b border-slate-100">
                                <button className="px-6 py-4 text-sm font-bold text-primary-600 border-b-2 border-primary-600">Encaissements</button>
                                <button className="px-6 py-4 text-sm font-bold text-slate-400 hover:text-slate-600">Dépenses</button>
                                <button className="px-6 py-4 text-sm font-bold text-slate-400 hover:text-slate-600">Devis</button>
                            </div>
                            <div className="p-6 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="pb-4">Date</th>
                                            <th className="pb-4">Méthode / Type</th>
                                            <th className="pb-4 text-right">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {chantierPayments.map(p => (
                                            <tr key={p.id}>
                                                <td className="py-4 text-sm text-slate-500">{formatDate(p.date)}</td>
                                                <td className="py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <CreditCard size={14} className="text-slate-400" />
                                                        <span className="text-sm font-semibold text-slate-700">{p.method}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Contacts / Quick Actions */}
                <div className="space-y-6">
                    <div className="glass p-6 rounded-3xl space-y-4">
                        <h3 className="font-bold text-slate-900">Contacts Clés</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">JD</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{chantier.client}</p>
                                    <p className="text-xs text-slate-500">Client Principal</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 p-3 rounded-2xl border border-slate-100 italic text-slate-400 text-xs">
                                Aucun autre contact enregistré.
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/20">
                        <h3 className="font-bold mb-4">Actions Rapides</h3>
                        <div className="space-y-2">
                            <Link href="/paiements" className="flex items-center space-x-3 w-full p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                                <TrendingUp size={18} />
                                <span className="text-sm font-semibold">Ajouter une avance</span>
                            </Link>
                            <Link href="/depenses" className="flex items-center space-x-3 w-full p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                                <Receipt size={18} />
                                <span className="text-sm font-semibold">Saisir une dépense</span>
                            </Link>
                            <Link href="/devis/nouveau" className="flex items-center space-x-3 w-full p-2.5 rounded-xl hover:bg-white/10 transition-colors">
                                <FileText size={18} />
                                <span className="text-sm font-semibold">Faire un nouveau devis</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
