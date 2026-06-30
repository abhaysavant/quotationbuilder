'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useQuotation } from '@/context/providers';
import { Edit2, Trash2, Eye, Copy, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency, duplicateQuotation, generateId } from '@/lib/quotation-utils';

export default function QuotationsPage() {
  const { savedQuotations, deleteQuotation, saveQuotation } = useQuotation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredQuotations = useMemo(() => {
    return savedQuotations.filter((q) => {
      const matchesSearch =
        q.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.client.company.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !filterStatus || q.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [savedQuotations, searchTerm, filterStatus]);

  const handleDuplicate = (quotation: any) => {
    const newQuotation = duplicateQuotation(quotation);
    newQuotation.id = generateId();
    saveQuotation(newQuotation);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this quotation?')) {
      deleteQuotation(id);
    }
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Quotations</h2>
        <p className="text-muted-foreground">Manage all your quotations and templates</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by reference, client name, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'draft'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Draft
          </button>
          <button
            onClick={() => setFilterStatus('accepted')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'accepted'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilterStatus('sent')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === 'sent'
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground hover:bg-secondary/80'
            }`}
          >
            Sent
          </button>
        </div>

        <Link
          href="/dashboard/new"
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          New Quotation
        </Link>
      </div>

      {/* Quotations List */}
      {filteredQuotations.length === 0 ? (
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <Filter className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No quotations match your search' : 'No quotations yet'}
          </p>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create First Quotation
          </Link>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-2"
        >
          {filteredQuotations.map((quotation) => (
            <motion.div
              key={quotation.id}
              variants={itemVariants}
              className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={`/dashboard/quotations/${quotation.id}`}
                      className="text-lg font-semibold text-primary hover:underline truncate"
                    >
                      {quotation.referenceNumber}
                    </Link>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                        quotation.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          : quotation.status === 'accepted'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}
                    >
                      {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Client</p>
                      <p className="font-medium text-foreground">{quotation.client.name}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Company</p>
                      <p className="font-medium text-foreground">{quotation.client.company}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-medium text-foreground">
                        {formatCurrency(quotation.grandTotal)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium text-foreground">
                        {new Date(quotation.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/dashboard/quotations/${quotation.id}`}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/dashboard/quotations/${quotation.id}/edit`}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDuplicate(quotation)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                    title="Duplicate"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(quotation.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-muted-foreground hover:text-red-600 dark:hover:bg-red-900/30"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Summary */}
      {filteredQuotations.length > 0 && (
        <div className="mt-8 p-4 bg-secondary rounded-lg border border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Total Quotations</p>
              <p className="text-2xl font-bold text-foreground">{filteredQuotations.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  filteredQuotations.reduce((sum, q) => sum + q.grandTotal, 0)
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Average Value</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(
                  filteredQuotations.reduce((sum, q) => sum + q.grandTotal, 0) /
                    filteredQuotations.length
                )}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Acceptance Rate</p>
              <p className="text-2xl font-bold text-foreground">
                {Math.round(
                  (filteredQuotations.filter((q) => q.status === 'accepted').length /
                    filteredQuotations.length) *
                    100
                )}
                %
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
