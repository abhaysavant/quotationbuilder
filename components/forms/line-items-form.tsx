'use client';

import React, { useState } from 'react';
import { LineItem, Module } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Package } from 'lucide-react';
import { generateId, formatCurrency } from '@/lib/quotation-utils';

interface LineItemsFormProps {
  items: LineItem[];
  modules: Module[];
  onItemsChange: (items: LineItem[]) => void;
}

export function LineItemsForm({ items, modules, onItemsChange }: LineItemsFormProps) {
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<number | string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customName, setCustomName] = useState<string>('');
  const [customBasePrice, setCustomBasePrice] = useState<number | string>('');

  const handleAddItem = () => {
    if (isCustom) {
      if (!customName) return;

      const newItem: LineItem = {
        id: generateId(),
        moduleId: `custom-${generateId()}`,
        moduleName: customName,
        quantity: quantity,
        unitPrice: customBasePrice ? Number(customBasePrice) : 0,
        notes: '',
      };

      onItemsChange([...items, newItem]);
      setIsCustom(false);
      setCustomName('');
      setCustomBasePrice('');
      setQuantity(1);
      setCustomPrice('');
      return;
    }

    if (!selectedModule) return;

    const module = modules.find((m) => m.id === selectedModule);
    if (!module) return;

    const newItem: LineItem = {
      id: generateId(),
      moduleId: selectedModule,
      moduleName: module.name,
      quantity: quantity,
      unitPrice: customPrice ? Number(customPrice) : module.basePrice,
      notes: '',
    };

    onItemsChange([...items, newItem]);
    setSelectedModule('');
    setQuantity(1);
    setCustomPrice('');
  };

  const handleUpdateItem = (id: string, field: string, value: any) => {
    onItemsChange(
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const groupedModules = modules.reduce(
    (acc, module) => {
      if (!acc[module.category]) {
        acc[module.category] = [];
      }
      acc[module.category].push(module);
      return acc;
    },
    {} as Record<string, Module[]>
  );

  const categoryLabels: Record<string, string> = {
    design: 'Design',
    development: 'Development',
    marketing: 'Marketing',
    support: 'Support',
    custom: 'Custom',
  };

  const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Services & Modules</h3>

        {/* Module Selection */}
        <div className="bg-secondary rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                <Package className="w-4 h-4 inline mr-2" />
                Select Module
              </label>
              <div className="flex items-center gap-3 mb-2">
                <label className="inline-flex items-center text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={isCustom}
                    onChange={(e) => setIsCustom(e.target.checked)}
                    className="mr-2"
                  />
                  Custom service
                </label>
              </div>

              {!isCustom ? (
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a module...</option>
                  {Object.entries(groupedModules).map(([category, categoryModules]) => (
                    <optgroup key={category} label={categoryLabels[category]}>
                      {categoryModules.map((module) => (
                        <option key={module.id} value={module.id}>
                          {module.name} - {formatCurrency(module.basePrice)}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Custom service name"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                  />
                  <input
                    type="number"
                    value={customBasePrice}
                    onChange={(e) => setCustomBasePrice(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Base price"
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Custom Price (Optional)
              </label>
              <input
                type="number"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder="Leave empty for default"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <button
            onClick={handleAddItem}
            disabled={isCustom ? !customName : !selectedModule}
            className="mt-4 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {/* Line Items List */}
        <div className="space-y-3">
          <AnimatePresence>
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-muted-foreground"
              >
                <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>No services added yet</p>
              </motion.div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Service</label>
                      <p className="font-medium text-foreground">{item.moduleName}</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Qty</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))
                        }
                        className="w-full px-2 py-1 bg-input border border-border rounded text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Unit Price</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) =>
                          handleUpdateItem(item.id, 'unitPrice', Math.max(0, Number(e.target.value)))
                        }
                        className="w-full px-2 py-1 bg-input border border-border rounded text-foreground text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Subtotal</label>
                      <p className="font-semibold text-foreground">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <input
                      type="text"
                      value={item.notes || ''}
                      onChange={(e) => handleUpdateItem(item.id, 'notes', e.target.value)}
                      placeholder="Add notes for this service..."
                      className="w-full px-2 py-1 bg-input border border-border rounded text-sm text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {items.length > 0 && (
          <div className="mt-6 p-4 bg-secondary rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Subtotal:</span>
              <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
