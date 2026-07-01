'use client';

import React from 'react';
import { TaxItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Percent, IndianRupee } from 'lucide-react';
import { generateId, formatCurrency } from '@/lib/quotation-utils';

interface DiscountTaxesFormProps {
  discountAmount: number;
  discountPercentage: number;
  taxItems: TaxItem[];
  subtotal: number;
  onDiscountChange: (amount: number, percentage: number) => void;
  onTaxItemsChange: (items: TaxItem[]) => void;
}

export function DiscountTaxesForm({
  discountAmount,
  discountPercentage,
  taxItems,
  subtotal,
  onDiscountChange,
  onTaxItemsChange,
}: DiscountTaxesFormProps) {
  const [discountType, setDiscountType] = React.useState<'amount' | 'percentage'>(
    discountPercentage > 0 ? 'percentage' : 'amount'
  );
  const [newTaxName, setNewTaxName] = React.useState('');
  const [newTaxPercentage, setNewTaxPercentage] = React.useState('');

  const handleDiscountChange = (value: number) => {
    if (discountType === 'percentage') {
      const amount = (subtotal * value) / 100;
      onDiscountChange(amount, value);
    } else {
      onDiscountChange(value, 0);
    }
  };

  const handleAddTax = () => {
    if (!newTaxName.trim() || !newTaxPercentage) return;

    const newTax: TaxItem = {
      id: generateId(),
      name: newTaxName,
      percentage: Number(newTaxPercentage),
    };

    onTaxItemsChange([...taxItems, newTax]);
    setNewTaxName('');
    setNewTaxPercentage('');
  };

  const handleRemoveTax = (id: string) => {
    onTaxItemsChange(taxItems.filter((tax) => tax.id !== id));
  };

  const handleUpdateTax = (id: string, field: string, value: any) => {
    onTaxItemsChange(
      taxItems.map((tax) => (tax.id === id ? { ...tax, [field]: value } : tax))
    );
  };

  const totalTax = taxItems.reduce((sum, tax) => {
    return sum + ((subtotal - discountAmount) * tax.percentage) / 100;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Discount Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <IndianRupee className="w-5 h-5" />
          Discount
        </h3>

        <div className="bg-secondary rounded-lg p-4 space-y-4">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={discountType === 'amount'}
                onChange={() => setDiscountType('amount')}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-foreground">Fixed Amount</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={discountType === 'percentage'}
                onChange={() => setDiscountType('percentage')}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-foreground">Percentage</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={discountType === 'percentage' ? discountPercentage : discountAmount}
                onChange={(e) => handleDiscountChange(Math.max(0, Number(e.target.value)))}
                className="flex-1 px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <span className="text-sm font-medium text-muted-foreground w-12">
                {discountType === 'percentage' ? '%' : formatCurrency(discountAmount)}
              </span>
            </div>
          </div>

          {discountAmount > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-700 dark:text-blue-300">
              Discount: -{formatCurrency(discountAmount)}
            </div>
          )}
        </div>
      </div>

      {/* Taxes Section */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Percent className="w-5 h-5" />
          Taxes
        </h3>

        <div className="bg-secondary rounded-lg p-4 space-y-4">
          {/* Add Tax Form */}
          <div className="space-y-3 border-b border-border pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Tax Name
                </label>
                <input
                  type="text"
                  value={newTaxName}
                  onChange={(e) => setNewTaxName(e.target.value)}
                  placeholder="e.g. Sales Tax, VAT"
                  className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Percentage
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newTaxPercentage}
                  onChange={(e) => setNewTaxPercentage(e.target.value)}
                  placeholder="e.g. 10"
                  className="w-full px-3 py-2 bg-input border border-border rounded text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddTax}
                  disabled={!newTaxName.trim() || !newTaxPercentage}
                  className="w-full px-3 py-2 bg-primary text-primary-foreground rounded text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Add Tax
                </button>
              </div>
            </div>
          </div>

          {/* Tax List */}
          <div className="space-y-2">
            <AnimatePresence>
              {taxItems.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground py-4"
                >
                  No taxes added yet
                </motion.p>
              ) : (
                taxItems.map((tax) => {
                  const taxAmount = ((subtotal - discountAmount) * tax.percentage) / 100;
                  return (
                    <motion.div
                      key={tax.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-3 p-3 bg-background rounded border border-border"
                    >
                      <input
                        type="text"
                        value={tax.name}
                        onChange={(e) => handleUpdateTax(tax.id, 'name', e.target.value)}
                        className="flex-1 px-2 py-1 bg-input border border-border rounded text-sm text-foreground"
                      />

                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={tax.percentage}
                          onChange={(e) =>
                            handleUpdateTax(tax.id, 'percentage', Number(e.target.value))
                          }
                          className="w-16 px-2 py-1 bg-input border border-border rounded text-sm text-foreground text-right"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>

                      <span className="px-2 py-1 bg-secondary rounded text-sm font-medium text-foreground min-w-fit">
                        {formatCurrency(taxAmount)}
                      </span>

                      <button
                        onClick={() => handleRemoveTax(tax.id)}
                        className="p-1.5 hover:bg-red-100 rounded transition-colors text-red-600 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </div>

        {taxItems.length > 0 && (
          <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Total Taxes:</span>
              <span className="text-lg font-bold text-accent">{formatCurrency(totalTax)}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
