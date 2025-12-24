export type ChantierStatus = "En cours" | "Terminé" | "Suspendu";
export type DevisStatus = "Brouillon" | "Envoyé" | "Accepté" | "Refusé";
export type ExpenseType = "matériaux" | "main-d’œuvre" | "transport" | "autre";
export type PaymentMethod = "Virement" | "Chèque" | "Espèces" | "CB";

export interface LineItem {
  id: string;
  designation: string;
  quantity: number;
  unitPrice: number;
}

export interface Devis {
  id: string;
  chantierId: string;
  date: string;
  status: DevisStatus;
  lineItems: LineItem[];
  tvaRate: number; // e.g., 0.20
}

export interface Payment {
  id: string;
  chantierId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}

export interface Expense {
  id: string;
  chantierId: string;
  type: ExpenseType;
  amount: number;
  provider: string;
  date: string;
  proofUrl?: string;
}

export interface Chantier {
  id: string;
  name: string;
  client: string;
  location: string;
  startDate: string;
  endDate?: string;
  budget: number;
  status: ChantierStatus;
}

export interface ProjectSynthesis {
  totalBudget: number;
  totalDevis: number;
  totalPaid: number;
  totalExpenses: number;
  profitability: number;
  remainingToPay: number;
}
