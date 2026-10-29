'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    ArrowLeft,
    MapPin,
    User as UserIcon,
    Calendar,
    Wallet,
    TrendingUp,
    AlertCircle,
    FileText,
    CreditCard,
    Receipt,
    Download,
    CheckCircle2,
    Edit3,
    Users,
    Eye,
    UserPlus,
    Trash2,
    Crown,
    Building2,
    Shield
} from 'lucide-react';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency, formatDate, calculateDevisTotals, cn } from '@/lib/utils';
import Link from 'next/link';
import { generateChantierPDF } from '@/lib/pdfGenerator';
import LoadingState from '@/components/ui/LoadingState';
import AddSpectatorModal from '@/components/chantiers/AddSpectatorModal';
import ConfirmModal from '@/components/ui/ConfirmModal';

export default function ChantierDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user: currentUser, isDemoMode } = useAuth();
    const { chantiers, devis, payments, expenses, loading, addSpectator, removeSpectator } = useData();
    
    // State for tabs
    const [activeTab, setActiveTab] = useState<'encaissements' | 'depenses'>('encaissements');
    const [isAddSpectatorOpen, setIsAddSpectatorOpen] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [spectatorToRemove, setSpectatorToRemove] = useState<{ id: string; name: string } | null>(null);
    const [removeError, setRemoveError] = useState<string | null>(null);

    const chantier = chantiers.find(c => c.id === id);

    if (loading) {
        return <LoadingState />;
    }

    if (!chantier) {
        return <div className="p-20 text-center text-slate-500">Chantier non trouvé.</div>;
    }

    // Role check
    const isOwner = isDemoMode
        ? (chantier.userId === 'demo-user' || !chantier.userId)
        : (!chantier.userId || chantier.userId === currentUser?.id || (chantier.owner && chantier.owner.id === currentUser?.id));
    const isSpectator = !isOwner;

    const chantierDevis = devis.filter(d => {
        const dId = typeof d.chantierId === 'object' ? (d.chantierId as any)._id || (d.chantierId as any).id : d.chantierId;
        return String(dId) === String(id) && d.status === 'Accepté';
    });
    const chantierPayments = payments.filter(p => {
        const pId = typeof p.chantierId === 'object' ? (p.chantierId as any)._id || (p.chantierId as any).id : p.chantierId;
        return String(pId) === String(id);
    });
    const chantierExpenses = expenses.filter(e => {
        const eId = typeof e.chantierId === 'object' ? (e.chantierId as any)._id || (e.chantierId as any).id : e.chantierId;
        return String(eId) === String(id);
    });

    // Calculations
    const totalDevisTTC = chantierDevis.reduce((acc, d) => acc + calculateDevisTotals(d.lineItems, d.tvaRate).totalTTC, 0);
    const totalPaid = chantierPayments.reduce((acc, p) => acc + p.amount, 0);
    const totalExpenses = chantierExpenses.reduce((acc, e) => acc + e.amount, 0);
    const remainingToPay = Math.max(0, totalDevisTTC - totalPaid);
    const netProfit = totalPaid - totalExpenses;

    const handleDownloadPDF = () => {
        generateChantierPDF(
            chantier,
            totalDevisTTC,
            totalPaid,
            totalExpenses,
            netProfit,
            chantierPayments,
            chantierExpenses
        );
    };

    const handleAddSpectators = async (userIds: string[]) => {
        setActionLoading(true);
        try {
            for (const uId of userIds) {
                await addSpectator(chantier.id, uId);
            }
        } catch (error) {
            console.error('Failed to add spectators:', error);
            alert("Erreur lors de l'ajout des spectateurs");
        } finally {
            setActionLoading(false);
        }
    };

    const handleOpenRemoveSpectatorModal = (spectatorUserId: string, name?: string) => {
        setRemoveError(null);
        setSpectatorToRemove({ id: spectatorUserId, name: name || 'cet utilisateur' });
    };

    const handleConfirmRemoveSpectator = async () => {
        if (!spectatorToRemove) return;
        setActionLoading(true);
        setRemoveError(null);
        try {
            await removeSpectator(chantier.id, spectatorToRemove.id);
            setSpectatorToRemove(null);
        } catch (error: any) {
            console.error('Failed to remove spectator:', error);
            setRemoveError(error?.message || "Erreur lors de la suppression du spectateur");
        } finally {
            setActionLoading(false);
        }
    };

    const existingSpectatorIds = (chantier.spectators || []).map(s => s.userId);

    return (
        <div className="space-y-8 pb-20">
            {/* breadcrumbs & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Link href="/chantiers" className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors group">
                    <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span>Retour aux chantiers</span>
                </Link>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-white transition-all flex items-center space-x-2 text-sm shadow-sm"
                    >
                        <Download size={16} />
                        <span>Synthèse PDF</span>
                    </button>

                    {isOwner ? (
                        <>
                            <button
                                onClick={() => setIsAddSpectatorOpen(true)}
                                className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center space-x-2 text-sm shadow-sm"
                            >
                                <UserPlus size={16} />
                                <span>Ajouter Spectateur</span>
                            </button>
                            <Link
                                href={`/chantiers/${id}/modifier`}
                                className="btn-primary flex items-center space-x-2 text-sm"
                            >
                                <Edit3 size={16} />
                                <span>Modifier</span>
                            </Link>
                        </>
                    ) : (
                        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
                            <Eye size={14} />
                            <span>Accès Spectateur (Lecture seule)</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Read-only banner for spectators */}
            {isSpectator && (
                <div className="flex items-center space-x-3 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-sm shadow-sm">
                    <Eye size={20} className="shrink-0 text-indigo-600" />
                    <div className="flex-1">
                        <span className="font-bold">Mode Spectateur : </span>
                        <span>
                            Vous consultez ce chantier en lecture seule. Vous avez accès à la synthèse financière, aux dépenses, encaissements et au téléchargement PDF, mais vous ne pouvez pas modifier les informations ni ajouter de nouvelles données.
                        </span>
                    </div>
                </div>
            )}

            {/* Hero Section */}
            <div className="glass p-6 rounded-3xl relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                            <span className={cn(
                                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                                chantier.status === 'En cours' ? "bg-blue-100 text-blue-700" :
                                    chantier.status === 'Terminé' ? "bg-emerald-100 text-emerald-700" :
                                        "bg-amber-100 text-amber-700"
                            )}>
                                {chantier.status}
                            </span>
                            {!isOwner ? (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
                                    <Eye size={12} className="mr-1" />
                                    Spectateur
                                </span>
                            ) : (
                                <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                    <Crown size={12} className="mr-1" />
                                    Propriétaire
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">{chantier.name}</h1>
                        <div className="flex flex-wrap gap-4 text-slate-500 mt-2 text-sm">
                            <div className="flex items-center space-x-1.5">
                                <UserIcon size={16} />
                                <span>{chantier.client}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <MapPin size={16} />
                                <span>{chantier.location}</span>
                            </div>
                            <div className="flex items-center space-x-1.5">
                                <Calendar size={16} />
                                <span>Début: {formatDate(chantier.startDate)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Budget Prévu</div>
                        <div className="text-2xl font-black text-slate-900">{formatCurrency(chantier.budget)}</div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none" />
            </div>

            {/* Financial Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Devis</p>
                        <FileText size={20} className="text-blue-500" />
                    </div>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalDevisTTC)}</p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Encaissé</p>
                        <TrendingUp size={20} className="text-emerald-500" />
                    </div>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalPaid)}</p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dépenses</p>
                        <AlertCircle size={20} className="text-rose-500" />
                    </div>
                    <p className="text-xl font-black text-slate-900">{formatCurrency(totalExpenses)}</p>
                </div>

                <div className="glass p-5 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Solde Net</p>
                        <CheckCircle2 size={20} className="text-indigo-500" />
                    </div>
                    <p className={cn(
                        "text-xl font-black",
                        netProfit >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                        {netProfit >= 0 ? "+" : "-"}
                        {formatCurrency(Math.abs(netProfit))}
                    </p>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Financial Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">Historique Financier</h3>
                        <div className="glass rounded-3xl overflow-hidden">
                            <div className="flex border-b border-slate-100">
                                <button
                                    onClick={() => setActiveTab('encaissements')}
                                    className={cn(
                                        "px-6 py-4 text-sm font-bold transition-all cursor-pointer",
                                        activeTab === 'encaissements'
                                            ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    Encaissements ({chantierPayments.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab('depenses')}
                                    className={cn(
                                        "px-6 py-4 text-sm font-bold transition-all cursor-pointer",
                                        activeTab === 'depenses'
                                            ? "text-primary-600 border-b-2 border-primary-600 bg-primary-50/50"
                                            : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    Dépenses ({chantierExpenses.length})
                                </button>
                            </div>
                            <div className="p-6 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                            <th className="pb-4">Date</th>
                                            <th className="pb-4">
                                                {activeTab === 'encaissements' ? 'Méthode' : 'Description / Fournisseur'}
                                            </th>
                                            <th className="pb-4 text-right">Montant</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {activeTab === 'encaissements' ? (
                                            chantierPayments.length > 0 ? (
                                                chantierPayments.map(p => (
                                                    <tr key={p.id}>
                                                        <td className="py-4 text-sm text-slate-500">{formatDate(p.date)}</td>
                                                        <td className="py-4">
                                                            <div className="flex items-center space-x-2">
                                                                <CreditCard size={14} className="text-slate-400" />
                                                                <span className="text-sm font-semibold text-slate-700">{p.method}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-right font-bold text-emerald-600">{formatCurrency(p.amount)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="py-8 text-center text-slate-400 text-sm">Aucun encaissement enregistré</td>
                                                </tr>
                                            )
                                        ) : (
                                            chantierExpenses.length > 0 ? (
                                                chantierExpenses.map(e => (
                                                    <tr key={e.id}>
                                                        <td className="py-4 text-sm text-slate-500">{formatDate(e.date)}</td>
                                                        <td className="py-4">
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-semibold text-slate-900">{e.description}</span>
                                                                <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                                    <span className={cn(
                                                                        "w-2 h-2 rounded-full",
                                                                        e.type === 'matériaux' ? "bg-amber-400" :
                                                                            e.type === 'main-d’œuvre' ? "bg-purple-400" :
                                                                                "bg-blue-400"
                                                                    )} />
                                                                    {e.provider}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 text-right font-bold text-rose-600">{formatCurrency(e.amount)}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={3} className="py-8 text-center text-slate-400 text-sm">Aucune dépense enregistrée</td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Équipe, Propriétaire & Spectateurs */}
                <div className="space-y-6">
                    {/* Contacts & Rôles */}
                    <div className="glass p-5 rounded-3xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                                <Users size={18} className="text-primary-600" />
                                <span>Équipe & Rôles</span>
                            </h3>
                            {isOwner && (
                                <button
                                    onClick={() => setIsAddSpectatorOpen(true)}
                                    className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors text-xs font-bold flex items-center space-x-1"
                                    title="Inviter un spectateur"
                                >
                                    <UserPlus size={16} />
                                    <span>Inviter</span>
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            {/* Client */}
                            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                                    {chantier.client.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-bold text-slate-900 truncate">{chantier.client}</p>
                                    <p className="text-xs text-slate-500">Client Principal</p>
                                </div>
                            </div>

                            {/* Propriétaire */}
                            <div className="flex items-center space-x-3 p-3 rounded-2xl bg-amber-50/60 border border-amber-100">
                                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                                    <Crown size={18} />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center space-x-1.5">
                                        <p className="text-sm font-bold text-slate-900 truncate">
                                            {chantier.owner?.name || (isOwner ? currentUser?.name : 'Créateur du projet')}
                                        </p>
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                            Propriétaire
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate">
                                        {chantier.owner?.email || (isOwner ? currentUser?.email : '')}
                                    </p>
                                </div>
                            </div>

                            {/* Spectateurs Section */}
                            <div className="pt-2">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                                        <Eye size={12} className="mr-1" />
                                        <span>Spectateurs (Lecture seule)</span>
                                    </p>
                                    <span className="text-xs font-semibold text-slate-400">
                                        {chantier.spectators?.length || 0}
                                    </span>
                                </div>

                                {chantier.spectators && chantier.spectators.length > 0 ? (
                                    <div className="space-y-2">
                                        {chantier.spectators.map(s => (
                                            <div
                                                key={s.userId}
                                                className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-100 shadow-sm"
                                            >
                                                <div className="flex items-center space-x-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                                                        {(s.name || s.email).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-slate-900 truncate">
                                                            {s.name || s.email}
                                                        </p>
                                                        <p className="text-[11px] text-slate-400 truncate">
                                                            {s.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                {isOwner && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenRemoveSpectatorModal(s.userId, s.name || s.email)}
                                                        disabled={actionLoading}
                                                        className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                                                        title="Retirer ce spectateur"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-200">
                                        <Eye size={20} className="mx-auto text-slate-300 mb-1" />
                                        <p className="text-xs text-slate-500 font-medium">Aucun spectateur invité</p>
                                        {isOwner && (
                                            <button
                                                onClick={() => setIsAddSpectatorOpen(true)}
                                                className="mt-2 text-xs font-bold text-primary-600 hover:underline"
                                            >
                                                + Ajouter un spectateur
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal to add spectators */}
            <AddSpectatorModal
                isOpen={isAddSpectatorOpen}
                onClose={() => setIsAddSpectatorOpen(false)}
                onAdd={handleAddSpectators}
                existingSpectatorIds={existingSpectatorIds}
            />

            {/* Modal to confirm spectator removal */}
            <ConfirmModal
                isOpen={!!spectatorToRemove}
                onClose={() => {
                    if (!actionLoading) {
                        setSpectatorToRemove(null);
                        setRemoveError(null);
                    }
                }}
                onConfirm={handleConfirmRemoveSpectator}
                title="Retirer le spectateur"
                message={
                    <div className="space-y-2">
                        <p>
                            Êtes-vous sûr de vouloir retirer <strong className="text-slate-900 font-semibold">{spectatorToRemove?.name}</strong> des spectateurs de ce chantier ?
                        </p>
                        <p className="text-xs text-slate-500">
                            Cet utilisateur n'aura plus accès en consultation aux indicateurs, dépenses, encaissements et devis de ce projet.
                        </p>
                    </div>
                }
                confirmText="Retirer le spectateur"
                cancelText="Annuler"
                variant="danger"
                isLoading={actionLoading}
                error={removeError}
            />
        </div>
    );
}
