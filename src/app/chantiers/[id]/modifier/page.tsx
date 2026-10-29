'use client';

import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Save,
    HardHat,
    User,
    MapPin,
    Calendar,
    Wallet,
    ShieldAlert,
    Eye
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useData } from '@/hooks/useData';
import { useAuth } from '@/context/AuthContext';
import { formatDateForInput } from '@/lib/utils';
import LoadingState from '@/components/ui/LoadingState';
import UserSelector from '@/components/chantiers/UserSelector';

export default function EditChantierPage() {
    const router = useRouter();
    const { id } = useParams();
    const { chantiers, updateChantier, loading } = useData();
    const { user: currentUser, isDemoMode } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [selectedSpectatorIds, setSelectedSpectatorIds] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        client: '',
        location: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'En cours'
    });

    const chantier = chantiers.find(c => c.id === id);

    useEffect(() => {
        if (chantier) {
            setFormData({
                name: chantier.name,
                client: chantier.client,
                location: chantier.location,
                startDate: formatDateForInput(chantier.startDate),
                endDate: formatDateForInput(chantier.endDate),
                budget: chantier.budget.toString(),
                status: chantier.status
            });
            setSelectedSpectatorIds((chantier.spectators || []).map(s => s.userId));
        }
    }, [chantier]);

    if (loading && !formData.name) {
        return <LoadingState />;
    }

    if (!chantier) {
        return (
            <div className="p-20 text-center text-slate-500">
                <p>Chantier introuvable.</p>
                <Link href="/chantiers" className="btn-primary mt-4 inline-block">Retour aux chantiers</Link>
            </div>
        );
    }

    // Role check
    const isOwner = isDemoMode
        ? (chantier.userId === 'demo-user' || !chantier.userId)
        : (!chantier.userId || chantier.userId === currentUser?.id || (chantier.owner && chantier.owner.id === currentUser?.id));

    if (!isOwner) {
        return (
            <div className="max-w-xl mx-auto py-16 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                    <ShieldAlert size={32} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">Accès non autorisé</h1>
                    <p className="text-sm text-slate-500">
                        Vous disposez d'un rôle de <strong>Spectateur (Lecture seule)</strong> sur ce chantier. Seul le propriétaire peut modifier les informations du projet.
                    </p>
                </div>
                <div>
                    <Link href={`/chantiers/${id}`} className="btn-primary inline-flex items-center space-x-2">
                        <ChevronLeft size={16} />
                        <span>Retour au chantier</span>
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateChantier(id as string, {
                ...formData,
                budget: parseFloat(formData.budget) || 0,
                status: formData.status as any,
                spectatorIds: selectedSpectatorIds,
            });
            router.push(`/chantiers/${id}`);
        } catch (err) {
            console.error('Failed to update chantier:', err);
            alert('Erreur lors de la mise à jour du chantier');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href={`/chantiers/${id}`} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500">
                        <ChevronLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Modifier le Chantier</h1>
                        <p className="text-sm text-slate-500 mt-0.5">Mettez à jour les informations du projet et la liste des spectateurs.</p>
                    </div>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                    <Save size={20} />
                    <span>{isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Infos Générales */}
                <section className="glass p-8 rounded-2xl space-y-6">
                    <div className="flex items-center space-x-2 text-primary-600 font-bold">
                        <HardHat size={20} />
                        <h2>Informations Générales</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Nom du Chantier</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: Rénovation Maison Martin"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                                <HardHat className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Client</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nom du client"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                        value={formData.client}
                                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                                    />
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Localisation</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Ville ou adresse"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Planification & Budget */}
                <section className="glass p-8 rounded-2xl space-y-6">
                    <div className="flex items-center space-x-2 text-primary-600 font-bold">
                        <Calendar size={20} />
                        <h2>Planification & Budget</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Date de début</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Date de fin (est.)</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                />
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Budget prévu (HT)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                />
                                <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">€</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Statut</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border-slate-200 outline-none focus:ring-2 focus:ring-primary-600 transition-all bg-white"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="En cours">En cours</option>
                                <option value="Terminé">Terminé</option>
                                <option value="Suspendu">Suspendu</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Collaboration & Spectateurs */}
                <section className="glass p-8 rounded-2xl space-y-6">
                    <UserSelector
                        selectedUserIds={selectedSpectatorIds}
                        onChange={setSelectedSpectatorIds}
                        title="Gestion des Spectateurs"
                        description="Modifiez les utilisateurs ayant un accès en lecture seule à ce projet."
                    />
                </section>
            </form>
        </div>
    );
}
