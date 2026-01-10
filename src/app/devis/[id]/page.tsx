'use client';

import { useParams } from 'next/navigation';
import {
    ChevronLeft,
    Download,
    Edit3,
    FileText,
    MapPin,
    User,
    Calendar,
    HardHat,
    Printer
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, formatDate, calculateDevisTotals, cn } from '@/lib/utils';
import Link from 'next/link';
import LoadingState from '@/components/ui/LoadingState';

export default function ViewDevisPage() {
    const { id } = useParams();
    const { devis: allDevis, chantiers, loading } = useData();

    const devis = allDevis.find(d => d.id === id);
    const chantierId = devis?.chantierId;
    const resolvedChantierId = typeof chantierId === 'object' ? (chantierId as any)._id || chantierId.id : chantierId;
    const chantier = devis ? chantiers.find(c => c.id === resolvedChantierId) : null;

    if (loading) {
        return <LoadingState />;
    }

    if (!devis || !chantier) {
        return <div className="p-20 text-center">Devis non trouvé.</div>;
    }

    const { totalHT, tva, totalTTC } = calculateDevisTotals(devis.lineItems, devis.tvaRate);

    // Helper to safely check status type if it doesn't match strict enum
    const status = devis.status as string;

    return (
        <div className="space-y-8 pb-20">
            {/* Actions */}
            <div className="flex items-center justify-between">
                <Link href="/devis" className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors group">
                    <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux devis</span>
                </Link>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-white transition-all flex items-center space-x-2">
                        <Download size={18} />
                        <span>PDF</span>
                    </button>
                    <Link href={`/devis/${id}/modifier`} className="btn-primary flex items-center space-x-2">
                        <Edit3 size={18} />
                        <span>Modifier</span>
                    </Link>
                </div>
            </div>

            {/* Quote Document */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                {/* Header Info */}
                <div className="p-12 border-b-8 border-primary-600 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20">
                                <HardHat size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">DEVIS PRO</h1>
                                <p className="text-slate-500 font-bold">Réf: #{devis.id.toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            <span className={cn(
                                "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest",
                                status === 'Accepté' ? "bg-emerald-100 text-emerald-700" :
                                    status === 'Brouillon' ? "bg-slate-200 text-slate-600" :
                                        status === 'Envoyé' ? "bg-blue-100 text-blue-700" :
                                            "bg-rose-100 text-rose-700"
                            )}>
                                {devis.status}
                            </span>
                            <p className="text-sm text-slate-400 font-medium">Date d'émission : {formatDate(devis.date)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Client</p>
                            <div>
                                <p className="text-xl font-black text-slate-900">{chantier.client}</p>
                                <div className="flex items-center text-slate-500 mt-2">
                                    <MapPin size={16} className="mr-2" />
                                    <span>{chantier.location}</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Destiné au Chantier</p>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                <p className="font-bold text-slate-900">{chantier.name}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Line Items */}
                <div className="p-12">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="pb-6">Désignation des travaux</th>
                                <th className="pb-6 w-24 text-center">Qté</th>
                                <th className="pb-6 w-32 text-right">Prix Unitaire HT</th>
                                <th className="pb-6 w-40 text-right">Montant HT</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {devis.lineItems.map((item) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-6 font-bold text-slate-900">{item.designation}</td>
                                    <td className="py-6 text-center text-slate-600">{item.quantity}</td>
                                    <td className="py-6 text-right text-slate-600 font-medium">{formatCurrency(item.unitPrice)}</td>
                                    <td className="py-6 text-right font-black text-slate-900">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Section */}
                <div className="p-12 bg-slate-50 border-t border-slate-100">
                    <div className="flex justify-end">
                        <div className="w-80 space-y-4">
                            <div className="flex justify-between text-slate-500 font-bold">
                                <span className="text-sm">TOTAL HT</span>
                                <span className="text-lg">{formatCurrency(totalHT)}</span>
                            </div>
                            <div className="flex justify-between text-slate-500 font-bold pb-4 border-b border-slate-200">
                                <span className="text-sm">TVA ({(devis.tvaRate * 100).toFixed(0)}%)</span>
                                <span className="text-lg">{formatCurrency(tva)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-2">
                                <span className="text-lg font-black text-slate-900">NET À PAYER TTC</span>
                                <span className="text-xl font-black text-primary-600">{formatCurrency(totalTTC)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
