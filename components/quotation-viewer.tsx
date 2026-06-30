'use client';

import React from 'react';
import { Quotation } from '@/types';
import { formatCurrency, formatDate } from '@/lib/quotation-utils';
import { motion } from 'framer-motion';

interface QuotationViewerProps {
  quotation: Quotation;
  companyInfo?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  showPrintButton?: boolean;
}

export function QuotationViewer({
  quotation,
  companyInfo,
  showPrintButton = false,
}: QuotationViewerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-foreground text-black dark:text-white p-8 rounded-lg"
      style={{ width: '8.5in', minHeight: '11in' }}
    >
      {/* Header */}
      <div className="mb-8 border-b border-gray-300 pb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            {companyInfo && (
              <>
                <h1 className="text-3xl font-bold mb-2">{companyInfo.name}</h1>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{companyInfo.address}</p>
                  <p>Email: {companyInfo.email}</p>
                  <p>Phone: {companyInfo.phone}</p>
                </div>
              </>
            )}
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-blue-600">QUOTATION</h2>
            <p className="text-sm text-gray-600 mt-2">{quotation.referenceNumber}</p>
          </div>
        </div>
      </div>

      {/* Quote and Client Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-bold text-gray-700 mb-2">BILL TO</h3>
          <div className="text-sm space-y-1">
            <p className="font-semibold">{quotation.client.name}</p>
            {quotation.client.company && <p>{quotation.client.company}</p>}
            {quotation.client.address && <p>{quotation.client.address}</p>}
            <p>{quotation.client.email}</p>
            {quotation.client.phone && <p>{quotation.client.phone}</p>}
          </div>
        </div>

        <div className="text-right">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Quote Date:</span>
              <span className="font-semibold">{formatDate(quotation.createdAt)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Valid Until:</span>
              <span className="font-semibold">{formatDate(quotation.validUntil)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-600">Status:</span>
              <span className="font-semibold capitalize text-blue-600">
                {quotation.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 bg-gray-50 dark:bg-gray-800">
              <th className="text-left py-3 px-2 font-bold">Description</th>
              <th className="text-right py-3 px-2 font-bold w-20">Qty</th>
              <th className="text-right py-3 px-2 font-bold w-24">Unit Price</th>
              <th className="text-right py-3 px-2 font-bold w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {quotation.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-2">
                  <div>
                    <p className="font-semibold">{item.moduleName}</p>
                    {item.notes && <p className="text-gray-600 text-xs">{item.notes}</p>}
                  </div>
                </td>
                <td className="text-right py-3 px-2">{item.quantity}</td>
                <td className="text-right py-3 px-2">{formatCurrency(item.unitPrice)}</td>
                <td className="text-right py-3 px-2 font-semibold">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80 space-y-2">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span>Subtotal:</span>
            <span className="font-semibold">{formatCurrency(quotation.subtotal)}</span>
          </div>

          {quotation.discountAmount > 0 && (
            <div className="flex justify-between border-b border-gray-200 pb-2 text-red-600">
              <span>Discount:</span>
              <span className="font-semibold">-{formatCurrency(quotation.discountAmount)}</span>
            </div>
          )}

          {quotation.taxItems.map((tax) => (
            <div key={tax.id} className="flex justify-between border-b border-gray-200 pb-2">
              <span>{tax.name}:</span>
              <span className="font-semibold">{formatCurrency(tax.amount || 0)}</span>
            </div>
          ))}

          <div className="flex justify-between text-lg font-bold pt-2 border-t-2 border-gray-300">
            <span>TOTAL:</span>
            <span className="text-blue-600">{formatCurrency(quotation.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      {quotation.paymentSchedule.length > 0 && (
        <div className="mb-8 border-t border-gray-300 pt-6">
          <h3 className="font-bold text-gray-700 mb-3">PAYMENT SCHEDULE</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="text-left py-2 px-2 font-bold">Phase</th>
                <th className="text-right py-2 px-2 font-bold">Percentage</th>
                <th className="text-right py-2 px-2 font-bold">Amount</th>
                <th className="text-right py-2 px-2 font-bold">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {quotation.paymentSchedule.map((milestone) => (
                <tr key={milestone.id} className="border-b border-gray-200">
                  <td className="py-2 px-2">{milestone.phase}</td>
                  <td className="text-right py-2 px-2">{milestone.percentage}%</td>
                  <td className="text-right py-2 px-2 font-semibold">
                    {formatCurrency(milestone.amount || 0)}
                  </td>
                  <td className="text-right py-2 px-2">{formatDate(milestone.dueDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Terms and Notes */}
      <div className="space-y-4 border-t border-gray-300 pt-6 text-sm">
        {quotation.terms && (
          <div>
            <h3 className="font-bold text-gray-700 mb-2">TERMS</h3>
            <p className="whitespace-pre-wrap text-gray-700">{quotation.terms}</p>
          </div>
        )}

        {quotation.notes && (
          <div>
            <h3 className="font-bold text-gray-700 mb-2">NOTES</h3>
            <p className="whitespace-pre-wrap text-gray-700">{quotation.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
