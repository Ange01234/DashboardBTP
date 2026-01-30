export type ChantierStatus = "En cours" | "Terminé" | "Suspendu";
export type DevisStatus = "Brouillon" | "Envoyé" | "Accepté" | "Refusé";
export type ExpenseType = "matériaux" | "main-d’œuvre" | "transport" | "autre";
export type PaymentMethod = "Virement" | "Chèque" | "Espèces" | "Mobile Money";

export interface LineItem {
  id: string;
  designation: string;
  quantity: number;
  unitPrice: number;
}

export interface Devis {
  id: string;
  chantierId: string | Chantier;
  name?: string;
  date: string;
  status: DevisStatus;
  lineItems: LineItem[];
  tvaRate?: number; // e.g., 0.20
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
  description: string;
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

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}
