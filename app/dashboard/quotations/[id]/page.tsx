'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuotation } from '@/context/providers';
import { QuotationViewer } from '@/components/quotation-viewer';
import { exportQuotationToPDF, exportQuotationToJSON } from '@/lib/pdf-export';
import { Quotation } from '@/types';
import { ArrowLeft, Download, FileJson, Printer, Edit2, Send } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { savedQuotations, saveQuotation, companyInfo } = useQuotation();
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const found = savedQuotations.find((q) => q.id === params.id);
    if (found) {
      setQuotation(found);
    }
  }, [params.id, savedQuotations]);

  if (!quotation) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Quotation not found</p>
          <Link
            href="/dashboard/quotations"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quotations
          </Link>
        </div>
      </div>
    );
  }

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      await exportQuotationToPDF(quotation, companyInfo, 'quotation-viewer');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    exportQuotationToJSON(quotation);
  };

  const handleStatusChange = (newStatus: 'draft' | 'sent' | 'accepted' | 'rejected') => {
    const updated = { ...quotation, status: newStatus, updatedAt: new Date().toISOString() };
    saveQuotation(updated);
    setQuotation(updated);
  };

  const handlePrint = () => {
    window.print();
  };

  const isPreview = searchParams.get('preview') === 'true';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="p-6 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/dashboard/quotations"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {quotation.referenceNumber}
              </h1>
              <p className="text-muted-foreground">
                {quotation.client.name} • {quotation.client.company}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap justify-end">
              <Link
                href={`/dashboard/quotations/${quotation.id}/edit`}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Link>

              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 disabled:opacity-50 transition-colors font-medium flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isExporting ? 'Exporting...' : 'PDF'}
              </button>

              <button
                onClick={handleExportJSON}
                className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors font-medium flex items-center gap-2"
              >
                <FileJson className="w-4 h-4" />
                JSON
              </button>

              {quotation.status === 'draft' && (
                <button
                  onClick={() => handleStatusChange('sent')}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              )}
            </div>
          </div>

          {/* Status Actions */}
          {quotation.status !== 'accepted' && quotation.status !== 'rejected' && (
            <div className="flex gap-2 text-sm">
              {quotation.status === 'sent' && (
                <>
                  <button
                    onClick={() => handleStatusChange('accepted')}
                    className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    Mark as Accepted
                  </button>
                  <button
                    onClick={() => handleStatusChange('rejected')}
                    className="px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    Mark as Rejected
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <div id="quotation-viewer" className="w-full">
            <QuotationViewer
              quotation={quotation}
              companyInfo={companyInfo || undefined}
              showPrintButton={!isPreview}
            />
          </div>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          div:not(#quotation-viewer):not(#quotation-viewer *) {
            display: none !important;
          }
          
          #quotation-viewer {
            margin: 0;
            padding: 0;
            max-width: 100%;
            box-shadow: none;
          }
        }
      `}</style>
    </div>
  );
}
