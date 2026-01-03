'use client';

import { useParams } from 'next/navigation';
import {
    ChevronLeft,
    CreditCard,
    Calendar,
    ArrowLeft,
    Download,
    Edit3,
    HardHat,
    User,
    MapPin
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';

export default function ViewPaymentPage() {
    const { id } = useParams();
    const { payments, chantiers } = useData();
    const payment = payments.find(p => p.id === id);
    const chantier = payment ? chantiers.find(c => c.id === payment.chantierId) : null;

    if (!payment) {
        return <div className="p-20 text-center text-slate-500">Paiement non trouvé.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Navigation & Actions */}
            <div className="flex items-center justify-between">
                <Link href="/paiements" className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors group">
                    <ChevronLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux paiements</span>
                </Link>
                <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-white transition-all flex items-center space-x-2">
                        <Download size={18} />
                        <span>Reçu PDF</span>
                    </button>
                    <Link href={`/paiements/${id}/modifier`} className="btn-primary flex items-center space-x-2">
                        <Edit3 size={18} />
                        <span>Modifier</span>
                    </Link>
                </div>
            </div>

            {/* Content Receipt */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="p-12 border-b-8 border-emerald-600 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-12">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                                <CreditCard size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">REÇU DE PAIEMENT</h1>
                                <p className="text-slate-500 font-bold">Réf: #P-{payment.id.substring(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-400 font-medium tracking-wider uppercase">Date de paiement</p>
                            <p className="text-lg font-black text-slate-900">{formatDate(payment.date)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Client Payeur</p>
                            <div>
                                <p className="text-xl font-black text-slate-900">{chantier?.client || 'Client inconnu'}</p>
                                {chantier && (
                                    <div className="flex items-center text-slate-500 mt-2">
                                        <MapPin size={16} className="mr-2" />
                                        <span>{chantier.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Détails du Projet</p>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                <p className="font-bold text-slate-900">{chantier?.name || 'Projet inconnu'}</p>
                                <p className="text-sm text-slate-500 mt-1">ID Chantier: {payment.chantierId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-12 space-y-8 text-center">
                    <div className="space-y-2">
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Montant Total Reçu</p>
                        <h2 className="text-6xl font-black text-slate-900 tracking-tighter">
                            {formatCurrency(payment.amount)}
                        </h2>
                    </div>

                    <div className="inline-flex items-center bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-sm border border-emerald-100">
                        <CreditCard size={20} className="mr-3" />
                        <span>Payé par {payment.method}</span>
                    </div>
                </div>

                <div className="m-12 p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <div className="flex items-start space-x-4">
                        <HardHat className="text-slate-400 mt-1" size={20} />
                        <div className="text-left text-sm text-slate-500 leading-relaxed">
                            Ce document atteste de la réception du montant spécifié ci-dessus au titre du règlement pour les travaux réalisés sur le chantier mentionné.
                            Veuillez conserver ce document comme preuve de paiement.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
