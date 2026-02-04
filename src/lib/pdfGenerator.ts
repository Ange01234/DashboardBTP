import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chantier, Expense, Payment, Devis } from '@/types';
import { formatCurrency, formatDate, calculateDevisTotals } from './utils';

const COLORS = {
    primary: [15, 23, 42], // Slate 900
    accent: [37, 99, 235], // Primary 600
    gray: [100, 116, 139], // Slate 500
    lightGray: [241, 245, 249], // Slate 100
    white: [255, 255, 255]
};

export const generateChantierPDF = (
    chantier: Chantier,
    totalDevis: number,
    totalPaid: number,
    totalExpenses: number,
    netProfit: number,
    payments: Payment[],
    expenses: Expense[]
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header Background
    doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Title & Branding
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("DASHBOARD BTP", 14, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Rapport de Chantier", pageWidth - 14, 25, { align: 'right' });

    // Project Info Section
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(chantier.name, 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
    
    // Grid layout for details
    const leftColX = 14;
    const rightColX = pageWidth / 2 + 10;
    let y = 62;

    doc.text(`CLIENT`, leftColX, y);
    doc.text(`LIEU`, rightColX, y);
    y += 5;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(chantier.client, leftColX, y);
    doc.text(chantier.location, rightColX, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
    doc.text(`DATE DE DÉBUT`, leftColX, y);
    doc.text(`STATUT`, rightColX, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text(formatDate(chantier.startDate), leftColX, y);
    doc.text(chantier.status, rightColX, y);

    // Financial Summary
    let currentY = 90;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Synthèse Financière", 14, currentY);

    const summaryData = [
        ['Budget Prévu', formatCurrency(chantier.budget)],
        ['Total Devis TTC', formatCurrency(totalDevis)],
        ['Total Encaissé', formatCurrency(totalPaid)],
        ['Total Dépenses', formatCurrency(totalExpenses)],
        ['Solde/Bénéfice Net', formatCurrency(netProfit)],
        ['Marge', `${totalPaid > 0 ? ((netProfit / totalPaid) * 100).toFixed(2) : 0}%`]
    ];

    autoTable(doc, {
        startY: currentY + 5,
        head: [['Indicateur', 'Montant']],
        body: summaryData,
        theme: 'grid',
        headStyles: { 
            fillColor: COLORS.primary as any,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'left'
        },
        columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 'auto' },
            1: { halign: 'right', fontStyle: 'normal' }
        },
        styles: { 
            fontSize: 10,
            cellPadding: 6,
            lineColor: [226, 232, 240] // Slate 200
        },
        alternateRowStyles: {
            fillColor: COLORS.lightGray as any
        }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Payments Table
    doc.setFontSize(14);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("Encaissements Réalisés", 14, currentY);

    const paymentsData = payments.map(p => [
        formatDate(p.date),
        p.method,
        formatCurrency(p.amount)
    ]);

    if (paymentsData.length === 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
        doc.text("Aucun encaissement enregistré.", 14, currentY + 10);
        (doc as any).lastAutoTable = { finalY: currentY + 15 }; 
    } else {
        autoTable(doc, {
            startY: currentY + 5,
            head: [['Date', 'Méthode', 'Montant']],
            body: paymentsData,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] }, // Emerald 500
            columnStyles: {
                2: { halign: 'right', fontStyle: 'bold' }
            },
            styles: { fontSize: 10, cellPadding: 5 },
            alternateRowStyles: { fillColor: [240, 253, 244] }, // Emerald 50
        });
    }

    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Expenses Table
    if (currentY + 30 > pageHeight) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
    doc.text("Détail des Dépenses", 14, currentY);

    const expensesData = expenses.map(e => [
        formatDate(e.date),
        e.type.toUpperCase(),
        e.description,
        e.provider,
        formatCurrency(e.amount)
    ]);

    if (expensesData.length === 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
        doc.text("Aucune dépense enregistrée.", 14, currentY + 10);
        
        const str = 'Page ' + (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(str, pageWidth - 20, pageHeight - 10);
        doc.text(`Généré le ${formatDate(new Date().toISOString())}`, 14, pageHeight - 10);
    } else {
        autoTable(doc, {
            startY: currentY + 5,
            head: [['Date', 'Type', 'Description', 'Fournisseur', 'Montant']],
            body: expensesData,
            theme: 'grid',
            headStyles: { fillColor: [225, 29, 72] }, // Rose 600
            columnStyles: {
                4: { halign: 'right', fontStyle: 'bold' }
            },
            styles: { fontSize: 9, cellPadding: 5 },
            alternateRowStyles: { fillColor: [255, 241, 242] }, // Rose 50
            didDrawPage: (data) => {
                const str = 'Page ' + (doc as any).internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(COLORS.gray[0], COLORS.gray[1], COLORS.gray[2]);
                doc.text(str, pageWidth - 20, pageHeight - 10);
                doc.text(`Généré le ${formatDate(new Date().toISOString())}`, 14, pageHeight - 10);
            }
        });
    }

    doc.save(`Rapport_${chantier.name.replace(/\s+/g, '_')}_${formatDate(new Date().toISOString()).replace(/\//g, '-')}.pdf`);
};

// Local helper to format currency without custom suffixes that might contain unwanted chars
const formatCurrencyPDF = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    useGrouping: false,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateDevisPDF = (devis: Devis, chantier: Chantier) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 14;

    // --- UTILS ---
    const primaryColor = [37, 99, 235] as [number, number, number]; // Primary 600
    const slate900 = [15, 23, 42]; // Slate 900
    const slate600 = [71, 85, 105]; // Slate 600
    const slate500 = [100, 116, 139]; // Slate 500
    const slate400 = [148, 163, 184]; // Slate 400
    const slate100 = [241, 245, 249]; // Slate 100
    const slate50 = [248, 250, 252]; // Slate 50

    // --- HEADER ---
    
    // Top Border Strip
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 4, 'F'); // 8px visual equivalent

    // Background for Header
    doc.setFillColor(248, 250, 252); // bg-slate-50/50 essentially
    doc.rect(0, 4, pageWidth, 75, 'F'); // approx height covering header info

    // Title (no logo box)
    const logoY = 20;
    doc.setFont("helvetica", "bolditalic");
    doc.setTextColor(...(slate900 as [number, number, number]));
    doc.setFontSize(22); // text-3xl approx
    doc.text((devis.name || "DEVIS PRO").toUpperCase(), margin, logoY + 11);
    
    // Date
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...(slate400 as [number, number, number]));
    doc.setFontSize(10);
    doc.text(`Date d'émission : ${formatDate(devis.date)}`, pageWidth - margin, logoY + 16, { align: 'right' });


    // --- INFO GRID ---
    const gridY = 55;
    const colWidth = (pageWidth - (margin * 2)) / 2;

    // Column 1: Client
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...(slate400 as [number, number, number]));
    doc.text("CLIENT", margin, gridY);
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(margin, gridY + 2, margin + 20, gridY + 2); // underline

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); // text-xl
    doc.setTextColor(...(slate900 as [number, number, number]));
    doc.text(chantier.client, margin, gridY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...(slate500 as [number, number, number]));
    doc.text(chantier.location, margin, gridY + 16);

    // Column 2: Chantier
    const rightColX = margin + colWidth + 10; // gap
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...(slate400 as [number, number, number]));
    doc.text("DESTINÉ AU CHANTIER", rightColX, gridY);
    doc.line(rightColX, gridY + 2, rightColX + 35, gridY + 2);

    // Boxed Chantier Name
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.roundedRect(rightColX, gridY + 6, colWidth - 20, 12, 2, 2, 'FD');
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...(slate900 as [number, number, number]));
    doc.text(chantier.name, rightColX + 4, gridY + 13);


    // --- TABLE ---
    const tableY = 85;
    
    const tableData = devis.lineItems.map(item => [
        item.designation,
        item.quantity,
        formatCurrencyPDF(item.unitPrice),
        formatCurrencyPDF(item.quantity * item.unitPrice)
    ]);

    autoTable(doc, {
        startY: tableY,
        head: [['DÉSIGNATION DES TRAVAUX', 'QTÉ', 'PRIX UNITAIRE HT', 'MONTANT HT']],
        body: tableData,
        theme: 'plain', // cleaner look
        headStyles: {
            fillColor: [255, 255, 255] as [number, number, number],
            textColor: slate400 as [number, number, number],
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'left',
            lineWidth: { bottom: 0.1 },
            lineColor: [241, 245, 249] as [number, number, number] // slate-100
        },
        columnStyles: {
            0: { cellWidth: 'auto', fontStyle: 'bold', textColor: slate900 as [number, number, number] },
            1: { halign: 'center', cellWidth: 20, textColor: slate600 as [number, number, number] },
            2: { halign: 'right', cellWidth: 35, textColor: slate600 as [number, number, number], fontStyle: 'normal' },
            3: { halign: 'right', cellWidth: 40, fontStyle: 'bold', textColor: slate900 as [number, number, number] }
        },
        styles: {
            fontSize: 10,
            cellPadding: { top: 5, bottom: 5, left: 2, right: 2 },
            overflow: 'linebreak'
        },
        didDrawPage: (data) => {
             // Optional: subtle borders or just let spacing do the work
        },
    });


    // --- TOTALS ---
    const finalY = (doc as any).lastAutoTable.finalY;
    
    // Draw Totals Background Section (full width bottom area)
    // We can assume it starts a bit after table.
    
    // Calculate space needed
    const totalsHeight = 50; 
    let totalsStartY = finalY;
    
    // If we're near button, maybe force new page for totals, but usually flows ok.
    if (totalsStartY + totalsHeight > pageHeight) {
        doc.addPage();
        totalsStartY = 20;
    } else {
        totalsStartY += 10;
    }

    // Background for totals (slate-50)
    doc.setFillColor(...(slate50 as [number, number, number]));
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.rect(0, totalsStartY, pageWidth, pageHeight - totalsStartY, 'F');
    doc.line(0, totalsStartY, pageWidth, totalsStartY); // top border

    const rightAlign = pageWidth - margin;
    const labelX = rightAlign - 60;
    let currentY = totalsStartY + 15;

    const { totalHT, tva, totalTTC } = calculateDevisTotals(devis.lineItems, devis.tvaRate);

    // Total HT
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...(slate500 as [number, number, number]));
    doc.text("TOTAL HT", labelX, currentY);
    doc.text(formatCurrencyPDF(totalHT), rightAlign, currentY, { align: 'right' });
    currentY += 8;

    // TVA
    doc.setFontSize(10);
    doc.setTextColor(...(slate500 as [number, number, number]));
    doc.text(`TVA ${(devis.tvaRate || 0) * 100}%`, labelX, currentY);
    doc.text(formatCurrencyPDF(tva), rightAlign, currentY, { align: 'right' });
    
    // Divider
    currentY += 5;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(labelX, currentY, rightAlign, currentY);
    currentY += 10;

    // Net TTC
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14); // text-lg
    doc.setTextColor(...(slate900 as [number, number, number]));
    doc.text("TOTAL", labelX, currentY);
    
    doc.setFontSize(16); // text-xl
    doc.setTextColor(...primaryColor);
    doc.text(formatCurrencyPDF(totalTTC), rightAlign, currentY, { align: 'right' });


    // --- FOOTER INFO ---
    // (Generated on...)
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...(slate400 as [number, number, number]));
    doc.text(`Généré le ${formatDate(new Date().toISOString())}`, margin, pageHeight - 10);
    const str = 'Page ' + (doc as any).internal.getNumberOfPages();
    doc.text(str, pageWidth - 20, pageHeight - 10);

    doc.save(`Devis_${(devis.name || devis.id).replace(/\s+/g, '_')}.pdf`);
};
