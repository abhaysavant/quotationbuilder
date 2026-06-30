'use client';

import React, { useState } from 'react';
import { useQuotation } from '@/context/providers';
import { useRouter } from 'next/navigation';
import { QuotationTemplate } from '@/types';
import { generateId, createEmptyQuotation } from '@/lib/quotation-utils';
import { Trash2, Copy, Plus, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, addTemplate, deleteTemplate, setCurrentQuotation } = useQuotation();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleCreateTemplate = () => {
    if (!formData.name.trim()) {
      alert('Please enter a template name');
      return;
    }

    const newTemplate: QuotationTemplate = {
      id: generateId(),
      name: formData.name,
      description: formData.description,
      lineItems: [],
      paymentSchedule: [],
      timeline: [],
      terms: 'Payment terms: As per agreement',
      notes: '',
      createdAt: new Date().toISOString(),
    };

    addTemplate(newTemplate);
    setFormData({ name: '', description: '' });
    setIsCreating(false);
  };

  const handleUseTemplate = (template: QuotationTemplate) => {
    const quotation = createEmptyQuotation();
    quotation.lineItems = template.lineItems;
    quotation.paymentSchedule = template.paymentSchedule;
    quotation.timeline = template.timeline;
    quotation.terms = template.terms;
    quotation.notes = template.notes;
    quotation.template = template.id;

    setCurrentQuotation(quotation);
    router.push('/dashboard/new');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Templates</h2>
        <p className="text-muted-foreground">
          Save and reuse quotation templates to speed up your workflow
        </p>
      </div>

      {/* Create Template Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-lg border border-border p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Template</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="space-y-4 mb-4">
              <input
                type="text"
                placeholder="Template Name (e.g., Standard Web Design)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <textarea
                placeholder="Template Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Create Template
              </button>
              <button
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
              💡 Create an empty template now, then customize it while creating a quotation.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Button */}
      {!isCreating && (
        <button
          onClick={() => setIsCreating(true)}
          className="mb-8 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Template
        </button>
      )}

      {/* Templates Grid */}
      {templates.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Copy className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No templates created yet</p>
          <button
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Create First Template
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {templates.map((template) => (
            <motion.div
              key={template.id}
              variants={itemVariants}
              className="bg-card rounded-lg border border-border p-6 hover:border-primary/50 transition-colors"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-1">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>

              <div className="mb-4 space-y-1 text-sm text-muted-foreground">
                <p>Services: {template.lineItems.length}</p>
                <p>Payment Phases: {template.paymentSchedule.length}</p>
                <p>Created: {new Date(template.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Use Template
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this template?')) {
                      deleteTemplate(template.id);
                    }
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 dark:hover:bg-red-900/30"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Info Box */}
      {templates.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg text-sm text-green-700 dark:text-green-300">
          ✓ You have {templates.length} template(s) available. Use them to quickly create new
          quotations.
        </div>
      )}
    </div>
  );
}
