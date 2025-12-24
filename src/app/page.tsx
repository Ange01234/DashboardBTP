import {
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { MOCK_CHANTIERS, MOCK_EXPENSES, MOCK_PAYMENTS } from '@/lib/mockData';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';

export default function Dashboard() {
  // Aggregate data for stats
  const totalBudget = MOCK_CHANTIERS.reduce((acc, c) => acc + c.budget, 0);
  const totalPaid = MOCK_PAYMENTS.reduce((acc, p) => acc + p.amount, 0);
  const totalExpenses = MOCK_EXPENSES.reduce((acc, e) => acc + e.amount, 0);
  const activeProjects = MOCK_CHANTIERS.filter(c => c.status === 'En cours').length;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">Bienvenue sur votre espace de gestion BTP.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Budget Total"
          value={formatCurrency(totalBudget)}
          icon={Wallet}
          trend={{ value: 12, isPositive: true }}
          description="Basé sur 3 chantiers actifs"
        />
        <StatCard
          title="Total Encaissé"
          value={formatCurrency(totalPaid)}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
          description={`${((totalPaid / totalBudget) * 100).toFixed(1)}% du budget total`}
        />
        <StatCard
          title="Dépenses Cumulées"
          value={formatCurrency(totalExpenses)}
          icon={AlertCircle}
          className="hover:border-rose-200"
          description="Matériaux, transport, MO"
        />
        <StatCard
          title="Chantiers Actifs"
          value={activeProjects}
          icon={Clock}
          description="Chantiers en cours d'exécution"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Chantiers */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Chantiers Récents</h2>
            <Link href="/chantiers" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              Voir tout
            </Link>
          </div>

          <div className="glass rounded-2xl overflow-hidden over-y-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Chantier</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Budget</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_CHANTIERS.slice(0, 5).map((chantier) => (
                  <tr key={chantier.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {chantier.name}
                      </div>
                      <div className="text-xs text-slate-400">{chantier.location}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{chantier.client}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {formatCurrency(chantier.budget)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        chantier.status === 'En cours' ? "bg-blue-50 text-blue-700" :
                          chantier.status === 'Terminé' ? "bg-emerald-50 text-emerald-700" :
                            "bg-amber-50 text-amber-700"
                      )}>
                        {chantier.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Tips */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Actions Rapides</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link href="/chantiers/nouveau" className="btn-primary flex items-center justify-center space-x-2 w-full">
              <span>+ Nouveau Chantier</span>
            </Link>
            <Link href="/devis/nouveau" className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-medium transition-all text-center flex items-center justify-center space-x-2">
              <span>Créer un Devis</span>
            </Link>
          </div>

          <div className="p-6 bg-primary-600 rounded-2xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Conseil Rentabilité</h3>
              <p className="text-sm text-primary-100">
                Pensez à enregistrer vos dépenses dès réception des factures pour un suivi en temps réel.
              </p>
            </div>
            <CheckCircle2 className="absolute -bottom-4 -right-4 w-20 h-20 text-primary-500/30 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
