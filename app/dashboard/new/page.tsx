'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuotation } from '@/context/providers';
import { ClientForm } from '@/components/forms/client-form';
import { LineItemsForm } from '@/components/forms/line-items-form';
import { DiscountTaxesForm } from '@/components/forms/discount-taxes-form';
import { Quotation } from '@/types';
import { createEmptyQuotation, updateQuotationTotals, formatCurrency } from '@/lib/quotation-utils';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

export default function NewQuotationPage() {
  const router = useRouter();
  const { saveQuotation, predefinedModules, savedClients } = useQuotation();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [activeTab, setActiveTab] = useState<'client' | 'services' | 'discount' | 'details'>(
    'client'
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setQuotation(createEmptyQuotation());
  }, []);

  if (!quotation) return null;

  const handleSave = async () => {
    if (!quotation.client.name || !quotation.client.email || quotation.lineItems.length === 0) {
      alert('Please fill in client details and add at least one service');
      return;
    }

    setIsSaving(true);
    const updated = updateQuotationTotals(quotation);
    saveQuotation(updated);
    setIsSaving(false);

    alert('Quotation saved successfully!');
    router.push(`/dashboard/quotations/${updated.id}`);
  };

  const handlePreview = () => {
    const updated = updateQuotationTotals(quotation);
    router.push(`/dashboard/quotations/${updated.id}?preview=true`);
  };

  const tabs = [
    { id: 'client', label: 'Client' },
    { id: 'services', label: 'Services' },
    { id: 'discount', label: 'Discount & Tax' },
    { id: 'details', label: 'Details' },
  ];

  const updated = updateQuotationTotals(quotation);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/quotations"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quotations
        </Link>
        <h2 className="text-3xl font-bold text-foreground mb-2">Create New Quotation</h2>
        <p className="text-muted-foreground">Build a professional quotation for your client</p>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Reference</p>
            <p className="font-semibold text-foreground">{quotation.referenceNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Services</p>
            <p className="font-semibold text-foreground">{quotation.lineItems.length}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Subtotal</p>
            <p className="font-semibold text-foreground">{formatCurrency(updated.subtotal)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Grand Total</p>
            <p className="font-bold text-primary text-lg">{formatCurrency(updated.grandTotal)}</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        {activeTab === 'client' && (
          <ClientForm
            client={quotation.client}
            onChange={(client) => setQuotation({ ...quotation, client })}
            savedClients={savedClients}
          />
        )}

        {activeTab === 'services' && (
          <LineItemsForm
            items={quotation.lineItems}
            modules={predefinedModules}
            onItemsChange={(items) => setQuotation({ ...quotation, lineItems: items })}
          />
        )}

        {activeTab === 'discount' && (
          <DiscountTaxesForm
            discountAmount={quotation.discountAmount}
            discountPercentage={quotation.discountPercentage}
            taxItems={quotation.taxItems}
            subtotal={updated.subtotal}
            onDiscountChange={(amount, percentage) =>
              setQuotation({ ...quotation, discountAmount: amount, discountPercentage: percentage })
            }
            onTaxItemsChange={(taxItems) => setQuotation({ ...quotation, taxItems })}
          />
        )}

        {activeTab === 'details' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">Quote Details</h3>

              <div className="space-y-4">
                {/* Valid Until */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    value={new Date(quotation.validUntil).toISOString().split('T')[0]}
                    onChange={(e) => {
                      const date = new Date(e.target.value);
                      setQuotation({
                        ...quotation,
                        validUntil: date.toISOString(),
                      });
                    }}
                    className="w-full md:w-1/2 px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Terms */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Payment Terms
                  </label>
                  <textarea
                    value={quotation.terms}
                    onChange={(e) => setQuotation({ ...quotation, terms: e.target.value })}
                    placeholder="e.g., Payment terms: 50% upfront, 50% upon completion"
                    rows={4}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Notes</label>
                  <textarea
                    value={quotation.notes}
                    onChange={(e) => setQuotation({ ...quotation, notes: e.target.value })}
                    placeholder="Additional notes for the client..."
                    rows={4}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Summary */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-medium text-foreground">{formatCurrency(updated.subtotal)}</span>
          </div>
          {updated.discountAmount > 0 && (
            <div className="flex justify-between text-red-600">
              <span className="text-muted-foreground">Discount:</span>
              <span className="font-medium">-{formatCurrency(updated.discountAmount)}</span>
            </div>
          )}
          {updated.totalTax > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Tax:</span>
              <span className="font-medium text-foreground">{formatCurrency(updated.totalTax)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="font-semibold text-foreground">Grand Total:</span>
            <span className="text-xl font-bold text-primary">{formatCurrency(updated.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handlePreview}
          className="flex-1 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Eye className="w-5 h-5" />
          Preview
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Saving...' : 'Save Quotation'}
        </button>
      </div>
    </div>
  );
}
