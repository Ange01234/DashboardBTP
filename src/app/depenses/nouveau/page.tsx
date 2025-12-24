'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    Save,
    Receipt,
    Calendar,
    Wallet,
    HardHat,
    ShoppingBag,
    Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_CHANTIERS } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function NewExpensePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        chantierId: '',
        type: 'matériaux',
        amount: '',
        provider: '',
        date: new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/depenses');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/depenses" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Nouvelle Dépense</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Enregistrer un achat ou un coût de chantier.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Save size={20} />
                    <span>Enregistrer</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="glass p-8 rounded-2xl space-y-6">
                    <div className="flex items-center space-x-2 text-primary-600 font-bold">
                        <Receipt size={20} />
                        <h2>Détails de la Charge</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Chantier Concerné</label>
                            <div className="relative">
                                <select
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.chantierId}
                                    onChange={(e) => setFormData({ ...formData, chantierId: e.target.value })}
                                >
                                    <option value="">Sélectionner un chantier...</option>
                                    {MOCK_CHANTIERS.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <HardHat className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Type de dépense</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['matériaux', 'main-d’œuvre', 'transport', 'autre'].map((t) => (
                                    <button
                                        key={t}
                                        type="button"
                                        className={cn(
                                            "px-4 py-2.5 rounded-xl border text-xs font-black uppercase tracking-tighter transition-all",
                                            formData.type === t
                                                ? "bg-slate-900 border-slate-900 text-white shadow-lg"
                                                : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                                        )}
                                        onClick={() => setFormData({ ...formData, type: t as any })}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Fournisseur / Prestataire</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: Leroy Merlin, Point P..."
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.provider}
                                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                />
                                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Montant HT</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Date de facture</label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Justificatif (Optionnel)</label>
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 transition-all hover:bg-slate-50 hover:border-primary-300 group cursor-pointer text-center">
                                <Camera className="mx-auto text-slate-300 group-hover:text-primary-400 mb-2" size={32} />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cliquez pour ajouter une photo ou un PDF</p>
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}
