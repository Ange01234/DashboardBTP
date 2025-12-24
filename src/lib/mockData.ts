import { Chantier, Devis, Payment, Expense } from '@/types';

export const MOCK_CHANTIERS: Chantier[] = [
  {
    id: '1',
    name: 'Rénovation Appartement Paris',
    client: 'Jean Dupont',
    location: 'Paris XV',
    startDate: '2025-01-15',
    budget: 45000000,
    status: 'En cours',
  },
  {
    id: '2',
    name: 'Construction Villa Cap d\'Antibes',
    client: 'Famille Morel',
    location: 'Antibes',
    startDate: '2024-11-01',
    endDate: '2025-06-30',
    budget: 250000,
    status: 'En cours',
  },
  {
    id: '3',
    name: 'Réfection Toiture École',
    client: 'Mairie de Lyon',
    location: 'Lyon 03',
    startDate: '2025-02-10',
    budget: 12000,
    status: 'Suspendu',
  },
];

export const MOCK_DEVIS: Devis[] = [
  {
    id: 'd1',
    chantierId: '1',
    date: '2025-01-10',
    status: 'Accepté',
    tvaRate: 0.20,
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
  { id: 'e1', chantierId: '1', type: 'matériaux', amount: 1250, provider: 'Leroy Merlin', date: '2025-01-20' },
  { id: 'e2', chantierId: '1', type: 'main-d’œuvre', amount: 2400, provider: 'Intérim Pro', date: '2025-01-25' },
];
