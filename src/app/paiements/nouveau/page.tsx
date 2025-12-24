'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    Save,
    CreditCard,
    Calendar,
    Wallet,
    HardHat
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MOCK_CHANTIERS } from '@/lib/mockData';

export default function NewPaymentPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        chantierId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        method: 'Virement'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/paiements');
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/paiements" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Nouvel Encaissement</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Enregistrer un acompte ou un paiement client.</p>
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
                        <CreditCard size={20} />
                        <h2>Détails du Paiement</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Chantier</label>
                            <div className="relative mt-2">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Montant (TTC)</label>
                                <div className="relative mt-2">
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
                                <label className="text-sm font-semibold text-slate-700">Date de paiement</label>
                                <div className="relative mt-2">
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
                            <label className="text-sm font-semibold text-slate-700">Mode de règlement</label>
                            <div className="flex flex-wrap gap-3 mt-2">
                                {['Virement', 'Chèque', 'Espèces'].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        className={cn(
                                            "px-6 py-2 rounded-full border text-sm font-bold transition-all",
                                            formData.method === m
                                                ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-primary-200"
                                        )}
                                        onClick={() => setFormData({ ...formData, method: m })}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </form>
        </div>
    );
}

// Minimal helper since utils.ts is already defined
function cn(...inputs: any) {
    return inputs.filter(Boolean).join(' ');
}
