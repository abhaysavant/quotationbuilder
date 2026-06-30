// Module types for quotation modules
export interface Module {
  id: string;
  name: string;
  category: 'design' | 'development' | 'marketing' | 'support' | 'custom';
  basePrice: number;
  description: string;
  estimatedDays?: number;
}

// Line item in quotation
export interface LineItem {
  id: string;
  moduleId: string;
  moduleName: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

// Tax item
export interface TaxItem {
  id: string;
  name: string;
  percentage: number;
  amount?: number;
}

// Payment schedule milestone
export interface PaymentMilestone {
  id: string;
  phase: string;
  dueDate: string;
  percentage: number;
  amount?: number;
}

// Timeline item
export interface TimelineItem {
  id: string;
  phase: string;
  startDate: string;
  endDate: string;
  duration?: number;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

// Client information
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address?: string;
}

// Company information
export interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  logo?: string;
  taxNumber?: string;
}

// Complete quotation document
export interface Quotation {
  id: string;
  referenceNumber: string;
  client: Client;
  lineItems: LineItem[];
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  taxItems: TaxItem[];
  totalTax: number;
  grandTotal: number;
  paymentSchedule: PaymentMilestone[];
  timeline: TimelineItem[];
  notes: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  template?: string;
}

// Template for reusable quotation structures
export interface QuotationTemplate {
  id: string;
  name: string;
  description: string;
  lineItems: LineItem[];
  paymentSchedule: PaymentMilestone[];
  timeline: TimelineItem[];
  terms: string;
  notes: string;
  createdAt: string;
}
