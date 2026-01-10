'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Trash2,
    ChevronLeft,
    Save,
    HardHat,
    Calculator
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, calculateDevisTotals, cn, formatDateForInput } from '@/lib/utils';
import Link from 'next/link';
import { LineItem } from '@/types';
import { useRouter, useParams } from 'next/navigation';
import LoadingState from '@/components/ui/LoadingState';

export default function EditDevisPage() {
    const router = useRouter();
    const { id } = useParams();
    const { devis: allDevis, chantiers, updateDevis, loading } = useData();
    const [isSaving, setIsSaving] = useState(false);
    const [chantierId, setChantierId] = useState('');
    const [lineItems, setLineItems] = useState<Omit<LineItem, 'id'>[]>([]);
    const [tvaRate, setTvaRate] = useState(0.18);
    const [status, setStatus] = useState<any>('Brouillon');
    const [date, setDate] = useState('');

    useEffect(() => {
        const devis = allDevis.find(d => d.id === id);
        if (devis) {
            const cId = devis.chantierId;
            setChantierId(typeof cId === 'object' ? (cId as any)._id || cId.id : cId);
            setLineItems(devis.lineItems.map(({ id, ...rest }) => rest));
            setTvaRate(devis.tvaRate);
            setStatus(devis.status);
            setDate(formatDateForInput(devis.date));
        }
    }, [allDevis, id]);

    const addLine = () => {
        setLineItems([...lineItems, { designation: '', quantity: 1, unitPrice: 0 }]);
    };

    const removeLine = (index: number) => {
        setLineItems(lineItems.filter((_, i) => i !== index));
    };

    const updateLine = (index: number, field: keyof Omit<LineItem, 'id'>, value: string | number) => {
        const newLines = [...lineItems];
        (newLines[index] as any)[field] = value;
        setLineItems(newLines);
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            await updateDevis(id as string, {
                chantierId,
                lineItems: lineItems.map((item, idx) => ({ ...item, id: idx.toString() })),
                tvaRate,
                status,
                date
            });
            router.push(`/devis/${id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const totals = calculateDevisTotals(lineItems, tvaRate);

    if (loading && !chantierId) {
        return <LoadingState />;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href={`/devis/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Modifier le Devis </h1>
                        <p className="text-sm text-slate-500 mt-0.5">Mettez à jour les lignes de votre devis.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Settings */}
                <section className="glass p-8 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Chantier</label>
                        <select
                            className="w-full p-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                            value={chantierId}
                            onChange={(e) => setChantierId(e.target.value)}
                        >
                            {chantiers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Statut</label>
                        <select
                            className="w-full p-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Brouillon">Brouillon</option>
                            <option value="Envoyé">Envoyé</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Taux TVA (%)</label>
                        <input
                            type="number"
                            className="w-full p-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                            value={tvaRate * 100}
                            onChange={(e) => setTvaRate(parseFloat(e.target.value) / 100 || 0)}
                        />
                    </div>
                </section>

                {/* Lignes de Devis */}
                <section className="glass p-8 rounded-2xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-primary-600 font-bold">
                            <Plus size={20} />
                            <h2>Lignes du Devis</h2>
                        </div>
                        <button
                            onClick={addLine}
                            className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-4 py-2 rounded-xl transition-all"
                        >
                            + Ajouter une ligne
                        </button>
                    </div>

                    <div className="space-y-4">
                        {lineItems.map((item, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 items-start md:items-end group p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
                                <div className="flex-1 space-y-2 w-full">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Désignation</label>
                                    <input
                                        type="text"
                                        className="w-full p-2.5 rounded-lg border-slate-200 outline-none focus:ring-2 focus:ring-primary-600"
                                        value={item.designation}
                                        onChange={(e) => updateLine(index, 'designation', e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-24 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qté</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 rounded-lg border-slate-200 outline-none focus:ring-2 focus:ring-primary-600"
                                        value={item.quantity}
                                        onChange={(e) => updateLine(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="w-full md:w-36 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">P.U. HT</label>
                                    <input
                                        type="number"
                                        className="w-full p-2.5 rounded-lg border-slate-200 outline-none focus:ring-2 focus:ring-primary-600"
                                        value={item.unitPrice}
                                        onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="w-full md:w-32 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total HT</label>
                                    <div className="p-2.5 text-right font-bold text-slate-900 bg-white border border-slate-100 rounded-lg">
                                        {formatCurrency(item.quantity * item.unitPrice)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeLine(index)}
                                    className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Totals Summary */}
                <section className="flex justify-end pt-4">
                    <div className="w-full md:w-96 glass p-8 rounded-2xl space-y-4 shadow-lg">
                        <div className="flex justify-between text-slate-500 font-medium">
                            <span>Total HT</span>
                            <span>{formatCurrency(totals.totalHT)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-medium pb-4 border-b border-slate-100">
                            <span>TVA ({(tvaRate * 100).toFixed(0)}%)</span>
                            <span>{formatCurrency(totals.tva)}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-lg font-bold text-slate-900">Total TTC</span>
                            <span className="text-3xl font-extrabold text-primary-600">{formatCurrency(totals.totalTTC)}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
