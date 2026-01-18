import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chantier, Expense, Payment } from '@/types';
import { formatCurrency, formatDate } from './utils';

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
    
    // Colors
    const primaryColor = [15, 23, 42]; // Slate 900
    const accentColor = [37, 99, 235]; // Primary 600 (Blue)
    const grayColor = [100, 116, 139]; // Slate 500
    const lightGray = [241, 245, 249]; // Slate 100

    // Header Background
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
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
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(chantier.name, 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    
    // Grid layout for details
    const leftColX = 14;
    const rightColX = pageWidth / 2 + 10;
    let y = 62;

    doc.text(`CLIENT`, leftColX, y);
    doc.text(`LIEU`, rightColX, y);
    y += 5;
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text(chantier.client, leftColX, y);
    doc.text(chantier.location, rightColX, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    doc.text(`DATE DE DÉBUT`, leftColX, y);
    doc.text(`STATUT`, rightColX, y);
    y += 5;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
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
        ['Bénéfice Net', formatCurrency(netProfit)],
        ['Marge', `${totalPaid > 0 ? ((netProfit / totalPaid) * 100).toFixed(2) : 0}%`]
    ];

    autoTable(doc, {
        startY: currentY + 5,
        head: [['Indicateur', 'Montant']],
        body: summaryData,
        theme: 'grid',
        headStyles: { 
            fillColor: primaryColor as any,
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
            fillColor: lightGray as any
        }
    });

    currentY = (doc as any).lastAutoTable.finalY + 15;

    // Payments Table
    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("Encaissements Réalisés", 14, currentY);

    const paymentsData = payments.map(p => [
        formatDate(p.date),
        p.method,
        formatCurrency(p.amount)
    ]);

    if (paymentsData.length === 0) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text("Aucun encaissement enregistré.", 14, currentY + 10);
        // Advance currentY so next section is pushed down properly
        // Add a dummy table call to correctly update lastAutoTable.finalY if needed for consistency, 
        // or just manually update currentY
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
    // Check if we need a page break
    if (currentY + 30 > pageHeight) {
        doc.addPage();
        currentY = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
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
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text("Aucune dépense enregistrée.", 14, currentY + 10);
        
        // Draw footer manually since didDrawPage won't be called if table isn't drawn
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
                 // Footer with page number
                const str = 'Page ' + (doc as any).internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
                doc.text(str, pageWidth - 20, pageHeight - 10);
                doc.text(`Généré le ${formatDate(new Date().toISOString())}`, 14, pageHeight - 10);
            }
        });
    }

    // Save
    doc.save(`Rapport_${chantier.name.replace(/\s+/g, '_')}_${formatDate(new Date().toISOString()).replace(/\//g, '-')}.pdf`);
};
