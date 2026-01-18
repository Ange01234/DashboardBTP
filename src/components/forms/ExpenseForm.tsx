'use client';

import { useState } from 'react';
import {
    Save,
    Receipt,
    Calendar,
    Wallet,
    HardHat,
    ShoppingBag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExpenseType, Chantier, Expense } from '@/types';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface ExpenseFormProps {
    initialData?: Partial<Expense>;
    chantiers: Chantier[];
    onSubmit: (data: any) => Promise<void>;
    isSubmitting: boolean;
    title: string;
    subtitle: string;
    submitLabel: string;
}

export default function ExpenseForm({
    initialData,
    chantiers,
    onSubmit,
    isSubmitting,
    title,
    subtitle,
    submitLabel
}: ExpenseFormProps) {
    const [formData, setFormData] = useState({
        chantierId: initialData?.chantierId || '',
        type: initialData?.type || 'matériaux' as ExpenseType,
        description: initialData?.description || '',
        amount: initialData?.amount || '',
        provider: initialData?.provider || '',
        date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            amount: parseFloat(formData.amount.toString()),
        });
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/depenses" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                        <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    className="btn-primary flex items-center space-x-2"
                    disabled={isSubmitting}
                >
                    <Save size={20} />
                    <span>{isSubmitting ? 'Enregistrement...' : submitLabel}</span>
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
                                    {chantiers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                                <HardHat className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Type de dépense</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
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
                                        onClick={() => setFormData({ ...formData, type: t as ExpenseType })}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Désignation</label>
                            <input
                                type="text"
                                required
                                placeholder={
                                    formData.type === 'matériaux' ? "ex: Gravier 1 tonne, Ciment 50 sacs..." :
                                        formData.type === 'main-d’œuvre' ? "ex: Plombier, Électricien, Maçon..." :
                                            formData.type === 'transport' ? "ex: Livraison sable, Camion benne..." :
                                                "ex: Description de la dépense..."
                                }
                                className="w-full px-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
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
                                        placeholder="0"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">CFA</span>
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
                    </div>
                </section>
            </form>
        </div>
    );
}
