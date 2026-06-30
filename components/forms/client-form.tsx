'use client';

import React from 'react';
import { useQuotation } from '@/context/providers';
import { Client } from '@/types';
import { motion } from 'framer-motion';
import { User, Building2, Mail, Phone, MapPin } from 'lucide-react';

interface ClientFormProps {
  client: Client;
  onChange: (client: Client) => void;
  savedClients?: Client[];
}

export function ClientForm({ client, onChange, savedClients = [] }: ClientFormProps) {
  const handleChange = (field: keyof Client, value: string) => {
    onChange({ ...client, [field]: value });
  };

  const handleSelectSavedClient = (savedClient: Client) => {
    onChange(savedClient);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Client Information</h3>

        {savedClients.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-foreground mb-2">
              Quick Select Saved Clients
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {savedClients.map((savedClient) => (
                <button
                  key={savedClient.id}
                  onClick={() => handleSelectSavedClient(savedClient)}
                  className={`p-3 rounded-lg text-sm text-left transition-colors ${
                    client.id === savedClient.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {savedClient.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Name *
            </label>
            <input
              type="text"
              value={client.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Client name"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              value={client.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="client@example.com"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </label>
            <input
              type="tel"
              value={client.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Company
            </label>
            <input
              type="text"
              value={client.company}
              onChange={(e) => handleChange('company', e.target.value)}
              placeholder="Company name"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Address
            </label>
            <textarea
              value={client.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Street address, city, state"
              rows={3}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
