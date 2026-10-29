import { Chantier, Devis, Payment, Expense, UserSummary } from '@/types';

export const MOCK_USERS: UserSummary[] = [
  { id: 'user-2', name: 'Sophie Martin', email: 'sophie.martin@btp.com', company: 'Cabinet Archi Sud' },
  { id: 'user-3', name: 'Marc Lefebvre', email: 'marc@btp.com', company: 'BTP Expertise' },
  { id: 'user-4', name: 'Amadou Koné', email: 'amadou.kone@batisseurs.ci', company: 'Génie Civil Afrique' },
  { id: 'user-5', name: 'Claire Dubois', email: 'claire.dubois@structure.fr', company: 'Bureau d\'études BTP' },
];

export const MOCK_CHANTIERS: Chantier[] = [
  {
    id: '1',
    name: 'Rénovation Appartement Paris',
    client: 'Jean Dupont',
    location: 'Paris XV',
    startDate: '2025-01-15',
    budget: 45000000,
    status: 'En cours',
    userId: 'demo-user',
    owner: { id: 'demo-user', name: 'Utilisateur Démo', email: 'demo@btpdash.com' },
    spectators: [
      { userId: 'user-2', email: 'sophie.martin@btp.com', name: 'Sophie Martin', company: 'Cabinet Archi Sud' },
    ],
  },
  {
    id: '2',
    name: 'Construction Villa Cap d\'Antibes',
    client: 'Famille Morel',
    location: 'Antibes',
    startDate: '2024-11-01',
    endDate: '2025-06-30',
    budget: 150000000,
    status: 'En cours',
    userId: 'demo-user',
    owner: { id: 'demo-user', name: 'Utilisateur Démo', email: 'demo@btpdash.com' },
    spectators: [],
  },
  {
    id: '3',
    name: 'Réfection Toiture École',
    client: 'Mairie de Lyon',
    location: 'Lyon 03',
    startDate: '2025-02-10',
    budget: 8500000,
    status: 'Suspendu',
    userId: 'user-3',
    owner: { id: 'user-3', name: 'Marc Lefebvre', email: 'marc@btp.com', company: 'BTP Expertise' },
    spectators: [
      { userId: 'demo-user', email: 'demo@btpdash.com', name: 'Utilisateur Démo' },
    ],
  },
];

export const MOCK_DEVIS: Devis[] = [
  {
    id: 'd1',
    chantierId: '1',
    name: 'Devis Travaux 2025',
    date: '2025-01-10',
    status: 'Accepté',
    tvaRate: 0.18,
    lineItems: [
      { id: 'l1', designation: 'Peinture murs et plafonds', quantity: 120, unitPrice: 25 },
      { id: 'l2', designation: 'Pose parquet chêne', quantity: 45, unitPrice: 85 },
      { id: 'l3', designation: 'Installation prises électriques', quantity: 12, unitPrice: 45 },
    ],
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  { id: 'p1', chantierId: '1', amount: 5000, date: '2025-01-12', method: 'Virement' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'e1', chantierId: '1', type: 'matériaux', description: 'Ciment (50 sacs)', amount: 250000, provider: 'Sococim', date: '2025-01-20' },
  { id: 'e2', chantierId: '1', type: 'main-d’œuvre', description: 'Main d\'oeuvre maçonnerie', amount: 450000, provider: 'Equipe Alpha', date: '2025-01-25' },
];
