import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDate(date: string) {
  return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
}

export function calculateDevisTotals(lineItems: { quantity: number, unitPrice: number }[], tvaRate: number) {
  const totalHT = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const tva = totalHT * tvaRate;
  const totalTTC = totalHT + tva;
  return { totalHT, tva, totalTTC };
}
