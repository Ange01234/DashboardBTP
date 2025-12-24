'use client';

import { useState } from 'react';
import {
    Plus,
    Trash2,
    ChevronLeft,
    Save,
    HardHat,
    Calculator
} from 'lucide-react';
import { MOCK_CHANTIERS } from '@/lib/mockData';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { LineItem } from '@/types';
import { useRouter } from 'next/navigation';

export default function NewDevisPage() {
    const router = useRouter();
    const [chantierId, setChantierId] = useState('');
    const [lineItems, setLineItems] = useState<Omit<LineItem, 'id'>[]>([{
        designation: '',
        quantity: 1,
        unitPrice: 0
    }]);

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

    const totalHT = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const tva = totalHT * 0.20;
    const totalTTC = totalHT + tva;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/devis" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Nouveau Devis</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Remplissez les informations ci-dessous.</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/devis')}
                    className="btn-primary flex items-center space-x-2"
                >
                    <Save size={20} />
                    <span>Enregistrer le Devis</span>
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Selection Chantier */}
                <section className="glass p-8 rounded-2xl space-y-6">
                    <div className="flex items-center space-x-2 text-primary-600 font-bold">
                        <HardHat size={20} />
                        <h2>Lien au Chantier</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Sélectionner le chantier</label>
                            <select
                                className="w-full p-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                value={chantierId}
                                onChange={(e) => setChantierId(e.target.value)}
                            >
                                <option value="">Sélectionner un chantier...</option>
                                {MOCK_CHANTIERS.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} ({c.client})</option>
                                ))}
                            </select>
                        </div>
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
                                        placeholder="ex: Pose de carrelage"
                                        className="w-full p-2.5 rounded-lg border-slate-200 outline-none focus:ring-2 focus:ring-primary-600"
                                        value={item.designation}
                                        onChange={(e) => updateLine(index, 'designation', e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-24 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qté</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full p-2.5 rounded-lg border-slate-200 outline-none focus:ring-2 focus:ring-primary-600"
                                        value={item.quantity}
                                        onChange={(e) => updateLine(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    />
                                </div>
                                <div className="w-full md:w-40 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prix Unit. HT</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="w-full pl-8 pr-3 py-2.5 rounded-lg border-slate-200 outline-none focus:ring-2 focus:ring-primary-600"
                                            value={item.unitPrice}
                                            onChange={(e) => updateLine(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
                                    </div>
                                </div>
                                <div className="w-full md:w-32 space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total HT</label>
                                    <div className="p-2.5 text-right font-bold text-slate-900 bg-white border border-slate-100 rounded-lg">
                                        {formatCurrency(item.quantity * item.unitPrice)}
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeLine(index)}
                                    className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors md:mb-0 mb-4"
                                    title="Supprimer la ligne"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Résumé Financier */}
                <section className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 bg-white p-8 rounded-2xl border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                            <Calculator size={18} />
                            <span>Notes Additionnelles</span>
                        </h3>
                        <textarea
                            className="w-full h-32 p-4 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 resize-none text-sm"
                            placeholder="Conditions particulières, délais de livraison, validité de l'offre..."
                        />
                    </div>

                    <div className="w-full md:w-96 glass p-8 rounded-2xl space-y-4">
                        <div className="flex justify-between text-slate-500 font-medium">
                            <span>Total HT</span>
                            <span>{formatCurrency(totalHT)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 font-medium pb-4 border-b border-slate-100">
                            <span>TVA (20%)</span>
                            <span>{formatCurrency(tva)}</span>
                        </div>
                        <div className="flex justify-between items-end pt-2">
                            <span className="text-lg font-bold text-slate-900">Total TTC</span>
                            <span className="text-3xl font-extrabold text-primary-600">{formatCurrency(totalTTC)}</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
