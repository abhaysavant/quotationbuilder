'use client';

import React, { useState } from 'react';
import { useQuotation } from '@/context/providers';
import { Client } from '@/types';
import { generateId } from '@/lib/quotation-utils';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientsPage() {
  const { savedClients, saveClient, deleteClient } = useQuotation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Client>({
    id: generateId(),
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
  });

  const handleAdd = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in name and email');
      return;
    }

    saveClient(formData);
    setFormData({
      id: generateId(),
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    });
    setIsAdding(false);
  };

  const handleEdit = (client: Client) => {
    setFormData(client);
    setEditingId(client.id);
  };

  const handleSaveEdit = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Please fill in name and email');
      return;
    }

    saveClient(formData);
    setEditingId(null);
    setFormData({
      id: generateId(),
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      id: generateId(),
      name: '',
      email: '',
      phone: '',
      company: '',
      address: '',
    });
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
        <h2 className="text-3xl font-bold text-foreground mb-2">Clients</h2>
        <p className="text-muted-foreground">Manage your client database for quick selection</p>
      </div>

      {/* Add Client Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card rounded-lg border border-border p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingId ? 'Edit Client' : 'Add New Client'}
              </h3>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-secondary rounded transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Client Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="email"
                placeholder="Email *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="tel"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <textarea
                placeholder="Address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                className="md:col-span-2 px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={editingId ? handleSaveEdit : handleAdd}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                {editingId ? 'Save Changes' : 'Add Client'}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button */}
      {!isAdding && !editingId && (
        <button
          onClick={() => setIsAdding(true)}
          className="mb-8 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      )}

      {/* Clients List */}
      {savedClients.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-muted-foreground mb-4">No clients added yet</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Add First Client
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {savedClients.map((client) => (
            <motion.div
              key={client.id}
              variants={itemVariants}
              className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{client.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    {client.company && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Company:</span> {client.company}
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      <span className="font-medium">Email:</span> {client.email}
                    </p>
                    {client.phone && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Phone:</span> {client.phone}
                      </p>
                    )}
                    {client.address && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Address:</span> {client.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this client?')) {
                        deleteClient(client.id);
                      }
                    }}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-muted-foreground hover:text-red-600 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
