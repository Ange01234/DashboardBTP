'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
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
import { useData } from '@/hooks/useData';
import { formatCurrency, formatDate, calculateDevisTotals, cn } from '@/lib/utils';
import Link from 'next/link';
import { generateChantierPDF } from '@/lib/pdfGenerator';

import LoadingState from '@/components/ui/LoadingState';

export default function ChantierDetailPage() {
    const { id } = useParams();
    const { chantiers, devis, payments, expenses, loading } = useData();
    // State for tabs
    const [activeTab, setActiveTab] = useState<'encaissements' | 'depenses'>('encaissements');

    const chantier = chantiers.find(c => c.id === id);

    if (loading) {
        return <LoadingState />;
    }

    if (!chantier) {
        return <div className="p-20 text-center">Chantier non trouvé.</div>;
    }


    const chantierDevis = devis.filter(d => {
        const dId = typeof d.chantierId === 'object' ? (d.chantierId as any)._id || (d.chantierId as any).id : d.chantierId;
        return String(dId) === String(id) && d.status === 'Accepté';
    });
    const chantierPayments = payments.filter(p => {
        const pId = typeof p.chantierId === 'object' ? (p.chantierId as any)._id || (p.chantierId as any).id : p.chantierId;
        return String(pId) === String(id);
    });
    const chantierExpenses = expenses.filter(e => {
        const eId = typeof e.chantierId === 'object' ? (e.chantierId as any)._id || (e.chantierId as any).id : e.chantierId;
        return String(eId) === String(id);
    });

    // Calculations
    const totalDevisTTC = chantierDevis.reduce((acc, d) => acc + calculateDevisTotals(d.lineItems, d.tvaRate).totalTTC, 0);
    const totalPaid = chantierPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = chantierExpenses.reduce((acc, e) => acc + e.amount, 0);
    const remainingToPay = Math.max(0, totalDevisTTC - totalPaid);
    const netProfit = totalPaid - totalExpenses;
    const marginPercentage = totalPaid > 0 ? (netProfit / totalPaid) * 100 : 0;

    const handleDownloadPDF = () => {
        generateChantierPDF(
            chantier,
            totalDevisTTC,
            totalPaid,
            totalExpenses,
            netProfit,
            chantierPayments,
            chantierExpenses
        );
    };

    return (
        <div className="space-y-8 pb-20">
            {/* breadcrumbs & Actions */}
            <div className="flex items-center justify-between">
                <Link href="/chantiers" className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux chantiers</span>
                </Link>
                <div className="flex space-x-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-white transition-all flex items-center space-x-2"
                    >
                        <Download size={18} />
                        <span>Synthèse PDF</span>
                    </button>
                    <button className="btn-primary">Modifier</button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="glass p-5 rounded-3xl relative overflow-hidden">
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
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">{chantier.name}</h1>
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

                    <div className="text-right">
                        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Budget Prévu</div>
                        <div className="text-xl font-black text-slate-900">{formatCurrency(chantier.budget)}</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
            </div>

            {/* Financial Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Total Devis</p>
                        <FileText size={20} className="text-blue-500" />
                    </div>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalDevisTTC)}</p>
                </div>

                <div className="glass p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Encaissé</p>
                        <TrendingUp size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalPaid)}</p>
                </div>

                <div className="glass p-4 rounded-2xl ">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Dépenses</p>
                        <AlertCircle size={20} className="text-rose-500" />
                    </div>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalExpenses)}</p>
                </div>

                <div className="glass p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-bold text-slate-400 uppercase">Bénéfice Net</p>
                        <CheckCircle2 size={20} className="text-indigo-500" />
                    </div>
                    <p className={cn(
                        "text-xl font-black",
                        netProfit >= 0 ? "text-slate-900" : "text-rose-600"
                    )}>
                        {netProfit >= 0 ? "+" : "-"}
                        {formatCurrency(netProfit)}
                    </p>
                </div>
            </div>

            {/* rentability & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Rentability & Synthesis */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Activity Tabs */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">Historique Financier</h3>
                        <div className="glass rounded-3xl overflow-hidden">
                            <div className="flex border-b border-slate-100">
                                <button
                                    onClick={() => setActiveTab('encaissements')}
                                    className={cn(
                                        "px-6 py-4 text-sm font-bold transition-all",
                                        activeTab === 'encaissements'
                                            ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    Encaissements
                                </button>
                                <button
                                    onClick={() => setActiveTab('depenses')}
                                    className={cn(
                                        "px-6 py-4 text-sm font-bold transition-all",
                                        activeTab === 'depenses'
                                            ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    Dépenses
                                </button>
                            </div>
                            <div className="p-6 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="pb-4">Date</th>
                                            <th className="pb-4">
                                                {activeTab === 'encaissements' ? 'Méthode' : 'Description / Fournisseur'}
                                            </th>
                                            <th className="pb-4 text-right">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {activeTab === 'encaissements' ? (
                                            chantierPayments.length > 0 ? (
                                                chantierPayments.map(p => (
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
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="py-8 text-center text-slate-400 text-sm">Aucun encaissement</td>
                                                </tr>
                                            )
                                        ) : (
                                            chantierExpenses.length > 0 ? (
                                                chantierExpenses.map(e => (
                                                    <tr key={e.id}>
                                                        <td className="py-4 text-sm text-slate-500">{formatDate(e.date)}</td>
                                                        <td className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-slate-900">{e.description}</span>
                                                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                    <span className={cn(
                                                                        "w-2 h-2 rounded-full",
                                                                        e.type === 'matériaux' ? "bg-amber-400" :
                                                                            e.type === 'main-d’œuvre' ? "bg-purple-400" :
                                                                                "bg-blue-400"
                                                                    )} />
                                                                    {e.provider}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-right font-bold text-rose-600">{formatCurrency(e.amount)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="py-8 text-center text-slate-400 text-sm">Aucune dépense</td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Key Contacts / Quick Actions */}
                <div className="space-y-6">
                    <div className="glass p-3 rounded-3xl space-y-4">
                        <h3 className="font-bold text-slate-900">Contacts Clés</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">{chantier.client.charAt(0).toUpperCase()}</div>
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{chantier.client}</p>
                                    <p className="text-xs text-slate-500">Client Principal</p>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
