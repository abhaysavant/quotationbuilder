import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Quotation } from '@/types';
import { formatCurrency, formatDate } from './quotation-utils';

export async function exportQuotationToPDF(
  quotation: Quotation,
  companyInfo: any,
  elementId?: string
) {
  try {
    const element = elementId ? document.getElementById(elementId) : null;

    if (element) {
      // Use html2canvas if element is provided
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${quotation.referenceNumber}.pdf`);
    } else {
      // Generate from data
      generatePDFFromData(quotation, companyInfo);
    }
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
}

function generatePDFFromData(quotation: Quotation, companyInfo: any) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Helper function to add text with wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number) => {
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + lines.length * 5;
  };

  // Header
  pdf.setFontSize(20);
  pdf.setTextColor(37, 99, 235); // Primary blue
  pdf.text('QUOTATION', pageWidth - margin, margin, { align: 'right' });

  // Company Info
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  if (companyInfo) {
    yPosition = margin + 10;
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(companyInfo.name || 'Your Company', margin, yPosition);

    yPosition += 8;
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(companyInfo.address || '', margin, yPosition);
    yPosition += 5;
    pdf.text(`Email: ${companyInfo.email || ''}`, margin, yPosition);
    yPosition += 5;
    pdf.text(`Phone: ${companyInfo.phone || ''}`, margin, yPosition);
  }

  // Quote Details
  yPosition = margin + 10;
  pdf.setFontSize(10);
  pdf.setTextColor(0, 0, 0);
  pdf.text(`Quote #: ${quotation.referenceNumber}`, pageWidth - margin - 50, yPosition);
  yPosition += 7;
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Date: ${formatDate(quotation.createdAt)}`, pageWidth - margin - 50, yPosition);
  yPosition += 5;
  pdf.text(`Valid Until: ${formatDate(quotation.validUntil)}`, pageWidth - margin - 50, yPosition);

  // Client Info
  yPosition += 12;
  pdf.setFontSize(11);
  pdf.setTextColor(0, 0, 0);
  pdf.text('BILL TO:', margin, yPosition);
  yPosition += 7;
  pdf.setFontSize(10);
  pdf.text(quotation.client.name, margin, yPosition);
  yPosition += 5;
  if (quotation.client.company) {
    pdf.text(quotation.client.company, margin, yPosition);
    yPosition += 5;
  }
  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(quotation.client.email, margin, yPosition);
  yPosition += 4;
  if (quotation.client.phone) {
    pdf.text(quotation.client.phone, margin, yPosition);
    yPosition += 4;
  }

  // Line Items Table
  yPosition += 8;
  const tableY = yPosition;
  const columnWidths = [
    contentWidth * 0.4,
    contentWidth * 0.15,
    contentWidth * 0.2,
    contentWidth * 0.25,
  ];

  // Table header
  pdf.setFillColor(240, 240, 240);
  pdf.rect(margin, tableY, contentWidth, 7, 'F');
  pdf.setFontSize(9);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont(undefined, 'bold');

  let xPos = margin;
  pdf.text('Description', xPos + 2, tableY + 5);
  xPos += columnWidths[0];
  pdf.text('Qty', xPos + 2, tableY + 5);
  xPos += columnWidths[1];
  pdf.text('Unit Price', xPos + 2, tableY + 5);
  xPos += columnWidths[2];
  pdf.text('Amount', xPos + 2, tableY + 5);

  // Table rows
  yPosition = tableY + 10;
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(0, 0, 0);

  quotation.lineItems.forEach((item) => {
    const amount = item.quantity * item.unitPrice;

    xPos = margin;
    const descWidth = columnWidths[0] - 4;
    const descLines = pdf.splitTextToSize(item.moduleName, descWidth);

    if (yPosition + descLines.length * 4 + 5 > pageHeight - 20) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.text(descLines, xPos + 2, yPosition);
    xPos += columnWidths[0];

    const lineHeight = descLines.length * 4;
    pdf.text(item.quantity.toString(), xPos + 2, yPosition);
    xPos += columnWidths[1];

    pdf.text(formatCurrency(item.unitPrice), xPos + 2, yPosition, { align: 'right' });
    xPos += columnWidths[2];

    pdf.text(formatCurrency(amount), xPos + 2, yPosition, { align: 'right' });

    yPosition += lineHeight + 5;
  });

  // Totals
  yPosition += 5;
  const totalsX = margin + contentWidth - 80;

  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text('Subtotal:', totalsX, yPosition, { align: 'right' });
  pdf.setTextColor(0, 0, 0);
  pdf.text(formatCurrency(quotation.subtotal), totalsX + 50, yPosition, { align: 'right' });

  yPosition += 7;
  if (quotation.discountAmount > 0) {
    pdf.setTextColor(200, 0, 0);
    pdf.text('Discount:', totalsX, yPosition, { align: 'right' });
    pdf.text(`-${formatCurrency(quotation.discountAmount)}`, totalsX + 50, yPosition, {
      align: 'right',
    });
    yPosition += 7;
  }

  quotation.taxItems.forEach((tax) => {
    pdf.setTextColor(100, 100, 100);
    pdf.text(`${tax.name}:`, totalsX, yPosition, { align: 'right' });
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatCurrency(tax.amount || 0), totalsX + 50, yPosition, { align: 'right' });
    yPosition += 7;
  });

  yPosition += 3;
  pdf.setDrawColor(37, 99, 235);
  pdf.line(totalsX, yPosition, totalsX + 50, yPosition);

  yPosition += 5;
  pdf.setFontSize(11);
  pdf.setTextColor(37, 99, 235);
  pdf.setFont(undefined, 'bold');
  pdf.text('TOTAL:', totalsX, yPosition, { align: 'right' });
  pdf.text(formatCurrency(quotation.grandTotal), totalsX + 50, yPosition, { align: 'right' });

  // Terms and Notes
  if (quotation.terms || quotation.notes) {
    yPosition = pageHeight - 40;

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(0, 0, 0);

    if (quotation.terms) {
      pdf.text('TERMS:', margin, yPosition);
      yPosition += 5;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(8);
      const termsLines = pdf.splitTextToSize(quotation.terms, contentWidth);
      pdf.text(termsLines, margin, yPosition);
      yPosition += termsLines.length * 4 + 3;
    }

    if (quotation.notes) {
      pdf.setFont(undefined, 'bold');
      pdf.setFontSize(9);
      pdf.text('NOTES:', margin, yPosition);
      yPosition += 5;
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(8);
      const notesLines = pdf.splitTextToSize(quotation.notes, contentWidth);
      pdf.text(notesLines, margin, yPosition);
    }
  }

  pdf.save(`${quotation.referenceNumber}.pdf`);
}

// Generate JSON export
export function exportQuotationToJSON(quotation: Quotation) {
  const dataStr = JSON.stringify(quotation, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${quotation.referenceNumber}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
