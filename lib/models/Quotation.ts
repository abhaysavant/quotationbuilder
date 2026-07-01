import mongoose, { Schema, Document } from 'mongoose';

// Sub-schemas based on frontend types
const TaxItemSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  amount: { type: Number },
});

const PaymentMilestoneSchema = new Schema({
  id: { type: String, required: true },
  phase: { type: String, required: true },
  dueDate: { type: String, required: true },
  percentage: { type: Number, required: true },
  amount: { type: Number },
});

const TimelineItemSchema = new Schema({
  id: { type: String, required: true },
  phase: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  duration: { type: Number },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed'],
    required: true
  },
});

const LineItemSchema = new Schema({
  id: { type: String, required: true },
  moduleId: { type: String, required: true },
  moduleName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  notes: { type: String },
});

// Since client can be nested or referenced, the frontend stores the full client object.
// We'll store it directly as a subdocument to match frontend structure exactly.
const ClientSubSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  address: { type: String },
});

export interface IQuotation extends Document {
  referenceNumber: string;
  client: any;
  lineItems: any[];
  subtotal: number;
  discountAmount: number;
  discountPercentage: number;
  taxItems: any[];
  totalTax: number;
  grandTotal: number;
  paymentSchedule: any[];
  timeline: any[];
  notes: string;
  terms: string;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  template?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuotationSchema = new Schema<IQuotation>(
  {
    referenceNumber: {
      type: String,
      required: [true, 'Reference number is required'],
      unique: true,
    },
    client: {
      type: ClientSubSchema,
      required: true,
    },
    lineItems: [LineItemSchema],
    subtotal: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    taxItems: [TaxItemSchema],
    totalTax: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    paymentSchedule: [PaymentMilestoneSchema],
    timeline: [TimelineItemSchema],
    notes: {
      type: String,
      default: '',
    },
    terms: {
      type: String,
      default: '',
    },
    validUntil: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected'],
      default: 'draft',
    },
    template: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        
        // Also ensure date fields match frontend (which expects string ISO)
        if (ret.createdAt) ret.createdAt = new Date(ret.createdAt).toISOString();
        if (ret.updatedAt) ret.updatedAt = new Date(ret.updatedAt).toISOString();
      }
    }
  }
);

export default mongoose.models.Quotation ||
  mongoose.model<IQuotation>('Quotation', QuotationSchema);
