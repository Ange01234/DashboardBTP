'use client';

import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Save,
    CreditCard,
    Calendar,
    Wallet,
    HardHat
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { formatCurrency, cn, formatDateForInput } from '@/lib/utils';
import Link from 'next/link';
import { useData } from '@/hooks/useData';
import { PaymentMethod } from '@/types';
import LoadingState from '@/components/ui/LoadingState';

export default function EditPaymentPage() {
    const router = useRouter();
    const { id } = useParams();
    const { payments, chantiers, updatePayment, loading } = useData();
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        chantierId: '',
        amount: '',
        date: '',
        method: 'Virement' as PaymentMethod
    });

    useEffect(() => {
        const payment = payments.find(p => p.id === id);
        if (payment) {
            setFormData({
                chantierId: payment.chantierId,
                amount: payment.amount.toString(),
                date: formatDateForInput(payment.date),
                method: payment.method
            });
        }
    }, [payments, id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updatePayment(id as string, {
                chantierId: formData.chantierId,
                amount: parseFloat(formData.amount) || 0,
                date: formData.date,
                method: formData.method
            });
            router.push(`/paiements/${id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading && !formData.chantierId) {
        return <LoadingState />;
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href={`/paiements/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Modifier le Paiement</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Mettez à jour les informations du règlement.</p>
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
                        <CreditCard size={20} />
                        <h2>Détails du Paiement</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Chantier</label>
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

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Méthode de Paiement</label>
                            <div className="grid grid-cols-2 gap-3">
                                {['Virement', 'Chèque', 'Espèces', 'Mobile Money'].map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, method: m as PaymentMethod })}
                                        className={cn(
                                            "flex items-center justify-center p-3 rounded-xl border font-bold transition-all",
                                            formData.method === m
                                                ? "bg-primary-50 border-primary-200 text-primary-600"
                                                : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                        )}
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
