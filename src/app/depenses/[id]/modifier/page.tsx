'use client';

import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Save,
    Receipt,
    Calendar,
    Wallet,
    HardHat,
    ShoppingBag,
    Tag
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/hooks/useData';
import { ExpenseType } from '@/types';
import { cn, formatDateForInput } from '@/lib/utils';

export default function EditExpensePage() {
    const router = useRouter();
    const { id } = useParams();
    const { expenses, chantiers, updateExpense, loading } = useData();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        chantierId: '',
        type: 'matériaux' as ExpenseType,
        description: '',
        amount: '',
        provider: '',
        date: ''
    });

    useEffect(() => {
        const expense = expenses.find(e => e.id === id);
        if (expense) {
            setFormData({
                chantierId: expense.chantierId,
                type: expense.type,
                description: expense.description,
                amount: expense.amount.toString(),
                provider: expense.provider,
                date: formatDateForInput(expense.date)
            });
        }
    }, [expenses, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateExpense(id as string, {
                chantierId: formData.chantierId,
                type: formData.type,
                description: formData.description,
                amount: parseFloat(formData.amount) || 0,
                provider: formData.provider,
                date: formData.date
            });
            router.push(`/depenses/${id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !formData.chantierId) {
        return <div className="p-20 text-center text-slate-500">Chargement...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href={`/depenses/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Modifier la Dépense</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Mettez à jour les détails de ce coût.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="glass p-8 rounded-2xl space-y-6">
                    <div className="flex items-center space-x-2 text-primary-600 font-bold">
                        <Receipt size={20} />
                        <h2>Détails de la Dépense</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Chantier Concerné</label>
                            <div className="relative">
                                <select
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.chantierId}
                                    onChange={(e) => setFormData({ ...formData, chantierId: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner un chantier...</option>
                                    {chantiers.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} ({c.client})</option>
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
                                        onClick={() => setFormData({ ...formData, type: t as ExpenseType })}
                                        className={cn(
                                            "flex items-center justify-center p-2 rounded-xl border text-xs font-bold transition-all",
                                            formData.type === t
                                                ? "bg-primary-50 border-primary-200 text-primary-600"
                                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Description / Désignation</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: Achat de 50 sacs de ciment"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Fournisseur</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="Nom du fournisseur"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.provider}
                                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                                />
                                <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Montant (CFA)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    />
                                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Date</label>
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
