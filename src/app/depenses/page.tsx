'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    Receipt,
    Tag,
    ArrowRight,
    ExternalLink,
    ShoppingBag,
    Eye,
    Pencil,
    Trash2
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import Link from 'next/link';
import Swal from 'sweetalert2';
import LoadingState from '@/components/ui/LoadingState';

export default function DepensesPage() {
    const { expenses, chantiers, loading, deleteExpense } = useData();
    const [search, setSearch] = useState('');
    const [selectedChantier, setSelectedChantier] = useState<string>('');

    if (loading) {
        return <LoadingState />;
    }

    // Extract unique chantier names for the filter dropdown
    const chantierNames = Array.from(new Set(expenses.map(e => {
        const val = e.chantierId as any;
        const chantierId = typeof val === 'object' ? val._id || val.id : val;
        const chantier = chantiers.find(c => c.id === chantierId);
        return chantier?.name;
    }))).filter(Boolean).sort();


    const filteredExpenses = expenses.filter(e => {
        const val = e.chantierId as any;
        // Handle both string ID and populated object
        const chantierId = typeof val === 'object' ? val._id || val.id : val;

        const chantier = chantiers.find(c => c.id === chantierId);
        const chantierName = chantier?.name || '';

        // Log details for debugging
        if (selectedChantier) {
            console.log(`Checking Expense ID: ${e.id}`);
            console.log(`  - Raw chantierId in expense:`, val);
            console.log(`  - Resolved chantierId: ${chantierId}`);
            console.log(`  - Found Chantier Object:`, chantier);
            console.log(`  - Resolved Chantier Name: "${chantierName}"`);
            console.log(`  - Match?: ${chantierName === selectedChantier}`);
        }

        const matchesSearch = chantierName.toLowerCase().includes(search.toLowerCase()) ||
            e.provider.toLowerCase().includes(search.toLowerCase()) ||
            e.type.toLowerCase().includes(search.toLowerCase());

        const matchesChantier = selectedChantier ? chantierName === selectedChantier : true;

        return matchesSearch && matchesChantier;
    });

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Cette action est irréversible !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await deleteExpense(id);
                Swal.fire(
                    'Supprimé !',
                    'La dépense a été supprimée.',
                    'success'
                );
            } catch (error) {
                console.error('Failed to delete expense:', error);
                Swal.fire(
                    'Erreur',
                    'Une erreur est survenue lors de la suppression.',
                    'error'
                );
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dépenses</h1>
                    <p className="text-slate-500 mt-1">Suivez les coûts de matériaux, main d'œuvre et transport.</p>
                </div>
                <div className="flex gap-4">
                    {/* Chantier Filter */}
                    <select
                        className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 outline-none focus:ring-2 focus:ring-primary-600 transition-all font-medium"
                        value={selectedChantier}
                        onChange={(e) => setSelectedChantier(e.target.value)}
                    >
                        <option value="">Tous les chantiers</option>
                        {chantierNames.map(name => (
                            <option key={name as string} value={name as string}>{name as string}</option>
                        ))}
                    </select>

                    <Link href="/depenses/nouveau" className="btn-primary flex items-center justify-center space-x-2 bg-slate-900 shadow-slate-900/10">
                        <Plus size={20} />
                        <span>Nouvelle Dépense</span>
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Chantier</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fournisseur</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Montant</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredExpenses.map((expense) => {
                            const val = expense.chantierId as any;
                            const chantierId = typeof val === 'object' ? val._id || val.id : val;
                            const chantier = chantiers.find(c => c.id === chantierId);
                            return (
                                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            "inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-tighter shadow-sm mb-1",
                                            expense.type === 'matériaux' ? "bg-amber-50 text-amber-700" :
                                                expense.type === 'main-d’œuvre' ? "bg-purple-50 text-purple-700" :
                                                    "bg-blue-50 text-blue-700"
                                        )}>
                                            {expense.type}
                                        </span>
                                        <div className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                                            {expense.description}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Link href={`/chantiers/${chantier?.id}`} className="text-slate-900 font-semibold hover:text-primary-600 flex items-center space-x-1">
                                            <span>{chantier?.name}</span>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                                            <ShoppingBag size={14} className="text-slate-400" />
                                            <span>{expense.provider}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {formatDate(expense.date)}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-rose-600">
                                        {formatCurrency(expense.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-1">
                                            <Link
                                                href={`/depenses/${expense.id}/edit`}
                                                className="p-2 text-slate-400 hover:text-primary-600 transition-colors rounded-lg hover:bg-slate-100"
                                                title="Modifier"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredExpenses.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        Aucune dépense trouvée pour les critères sélectionnés.
                    </div>
                )}
            </div>
        </div>
    );
}
