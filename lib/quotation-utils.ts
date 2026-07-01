import { Quotation, LineItem, TaxItem } from '@/types';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function generateReferenceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `QT-${timestamp}-${random}`;
}

export function calculateLineItemsTotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
}

export function calculateTotalTax(taxItems: TaxItem[], subtotal: number): number {
  return taxItems.reduce((sum, tax) => {
    return sum + ((subtotal * tax.percentage) / 100);
  }, 0);
}

export function calculateGrandTotal(
  subtotal: number,
  discount: number,
  totalTax: number
): number {
  return Math.max(0, subtotal - discount + totalTax);
}

export function updateQuotationTotals(quotation: Quotation): Quotation {
  const subtotal = calculateLineItemsTotal(quotation.lineItems);
  
  // Calculate discount amount
  let discountAmount = quotation.discountAmount;
  if (quotation.discountPercentage > 0) {
    discountAmount = (subtotal * quotation.discountPercentage) / 100;
  }

  // Calculate tax
  const totalTax = calculateTotalTax(
    quotation.taxItems,
    subtotal - discountAmount
  );

  // Update tax items with calculated amounts
  const updatedTaxItems = quotation.taxItems.map(tax => ({
    ...tax,
    amount: ((subtotal - discountAmount) * tax.percentage) / 100,
  }));

  // Calculate grand total
  const grandTotal = calculateGrandTotal(subtotal, discountAmount, totalTax);

  // Update payment schedule amounts
  const updatedPaymentSchedule = quotation.paymentSchedule.map(milestone => ({
    ...milestone,
    amount: (grandTotal * milestone.percentage) / 100,
  }));

  return {
    ...quotation,
    subtotal,
    discountAmount,
    taxItems: updatedTaxItems,
    totalTax,
    grandTotal,
    paymentSchedule: updatedPaymentSchedule,
    updatedAt: new Date().toISOString(),
  };
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getDaysUntilExpiry(date: string): number {
  const expiry = new Date(date);
  const today = new Date();
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isQuotationExpired(validUntil: string): boolean {
  return getDaysUntilExpiry(validUntil) < 0;
}

export function calculateTimelineStats(quotation: Quotation) {
  const timeline = quotation.timeline;
  if (!timeline || timeline.length === 0) {
    return { totalDays: 0, completedDays: 0, remainingDays: 0 };
  }

  const firstStart = new Date(timeline[0].startDate).getTime();
  const lastEnd = new Date(timeline[timeline.length - 1].endDate).getTime();
  const totalDays = Math.ceil((lastEnd - firstStart) / (1000 * 60 * 60 * 24));

  const completedDays = timeline
    .filter(item => item.status === 'completed')
    .reduce((sum, item) => {
      const start = new Date(item.startDate).getTime();
      const end = new Date(item.endDate).getTime();
      return sum + Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }, 0);

  return {
    totalDays,
    completedDays,
    remainingDays: totalDays - completedDays,
  };
}

export function createEmptyQuotation(clientId?: string, clientName?: string): Quotation {
  const now = new Date();
  const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    id: generateId(),
    referenceNumber: generateReferenceNumber(),
    client: {
      id: clientId || generateId(),
      name: clientName || '',
      email: '',
      phone: '',
      company: '',
    },
    lineItems: [],
    subtotal: 0,
    discountAmount: 0,
    discountPercentage: 0,
    taxItems: [],
    totalTax: 0,
    grandTotal: 0,
    paymentSchedule: [
      {
        id: generateId(),
        phase: '50% Deposit',
        dueDate: now.toISOString(),
        percentage: 50,
        amount: 0,
      },
      {
        id: generateId(),
        phase: 'Final Payment',
        dueDate: validUntil.toISOString(),
        percentage: 50,
        amount: 0,
      },
    ],
    timeline: [],
    notes: '',
    terms: 'Payment terms: As per agreement',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    validUntil: validUntil.toISOString(),
    status: 'draft',
  };
}

export function duplicateQuotation(quotation: Quotation): Quotation {
  const newQuotation = { ...quotation };
  newQuotation.id = generateId();
  newQuotation.referenceNumber = generateReferenceNumber();
  newQuotation.status = 'draft';
  newQuotation.createdAt = new Date().toISOString();
  newQuotation.updatedAt = new Date().toISOString();
  return newQuotation;
}
