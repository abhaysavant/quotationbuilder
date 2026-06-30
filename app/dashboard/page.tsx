'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useQuotation } from '@/context/providers';
import { TrendingUp, FileText, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/quotation-utils';

export default function DashboardPage() {
  const { savedQuotations } = useQuotation();

  const stats = useMemo(() => {
    const total = savedQuotations.length;
    const totalValue = savedQuotations.reduce((sum, q) => sum + q.grandTotal, 0);
    const pending = savedQuotations.filter(q => q.status === 'draft').length;
    const accepted = savedQuotations.filter(q => q.status === 'accepted').length;

    return {
      total,
      totalValue,
      pending,
      accepted,
    };
  }, [savedQuotations]);

  const recentQuotations = useMemo(() => {
    return savedQuotations
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  }, [savedQuotations]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to your quotation management hub</p>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {/* Total Quotations */}
        <motion.div variants={itemVariants} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Quotations</p>
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Total Value */}
        <motion.div variants={itemVariants} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
            <div className="p-3 bg-accent/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>

        {/* Pending */}
        <motion.div variants={itemVariants} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
              <p className="text-xs text-muted-foreground mt-1">Draft quotations</p>
            </div>
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>

        {/* Accepted */}
        <motion.div variants={itemVariants} className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Accepted</p>
              <p className="text-3xl font-bold text-foreground">{stats.accepted}</p>
              <p className="text-xs text-muted-foreground mt-1">By clients</p>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Quotations */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="bg-card rounded-lg border border-border overflow-hidden"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Quotations</h3>
          <Link
            href="/dashboard/quotations"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentQuotations.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No quotations yet</p>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create First Quotation
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Reference</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Client</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left font-semibold text-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentQuotations.map((quotation) => (
                  <tr
                    key={quotation.id}
                    className="border-t border-border hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/quotations/${quotation.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {quotation.referenceNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{quotation.client.name}</td>
                    <td className="px-6 py-4 font-medium">
                      {formatCurrency(quotation.grandTotal)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          quotation.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                            : quotation.status === 'accepted'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }`}
                      >
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(quotation.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Link
            href="/dashboard/new"
            className="block p-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <h3 className="font-semibold mb-2">Create New Quotation</h3>
            <p className="text-sm opacity-90">Start building your next professional quote</p>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" animate="visible">
          <Link
            href="/dashboard/templates"
            className="block p-6 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors border border-border"
          >
            <h3 className="font-semibold mb-2">View Templates</h3>
            <p className="text-sm text-muted-foreground">Use pre-built templates to save time</p>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
