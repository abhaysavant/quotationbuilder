'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Quotation, QuotationTemplate, Client, CompanyInfo, Module } from '@/types';

interface QuotationContextType {
  currentQuotation: Quotation | null;
  setCurrentQuotation: (quotation: Quotation | null) => void;
  templates: QuotationTemplate[];
  addTemplate: (template: QuotationTemplate) => void;
  deleteTemplate: (id: string) => void;
  savedQuotations: Quotation[];
  saveQuotation: (quotation: Quotation) => void;
  loadQuotation: (id: string) => void;
  deleteQuotation: (id: string) => void;
  companyInfo: CompanyInfo | null;
  setCompanyInfo: (info: CompanyInfo) => void;
  savedClients: Client[];
  saveClient: (client: Client) => void;
  deleteClient: (id: string) => void;
  predefinedModules: Module[];
}

const QuotationContext = createContext<QuotationContextType | undefined>(undefined);

const DEFAULT_MODULES: Module[] = [
  // Design modules
  { id: 'design-1', name: 'UI/UX Design', category: 'design', basePrice: 5000, description: 'Complete interface design and user experience strategy', estimatedDays: 10 },
  { id: 'design-2', name: 'Web Design', category: 'design', basePrice: 3000, description: 'Responsive website design', estimatedDays: 7 },
  { id: 'design-3', name: 'Branding', category: 'design', basePrice: 4000, description: 'Logo and brand identity design', estimatedDays: 8 },
  { id: 'design-4', name: 'Design System', category: 'design', basePrice: 6000, description: 'Complete design system and component library', estimatedDays: 12 },
  
  // Development modules
  { id: 'dev-1', name: 'Frontend Development', category: 'development', basePrice: 8000, description: 'React/Next.js frontend development', estimatedDays: 20 },
  { id: 'dev-2', name: 'Backend Development', category: 'development', basePrice: 10000, description: 'Node.js/Express backend development', estimatedDays: 25 },
  { id: 'dev-3', name: 'Mobile App Development', category: 'development', basePrice: 12000, description: 'React Native or Flutter mobile app', estimatedDays: 30 },
  { id: 'dev-4', name: 'Database Design', category: 'development', basePrice: 3000, description: 'Database architecture and optimization', estimatedDays: 5 },
  { id: 'dev-5', name: 'API Development', category: 'development', basePrice: 5000, description: 'RESTful or GraphQL API development', estimatedDays: 10 },
  { id: 'dev-6', name: 'Integration Services', category: 'development', basePrice: 4000, description: 'Third-party API integrations', estimatedDays: 8 },
  
  // Marketing modules
  { id: 'mkt-1', name: 'SEO Optimization', category: 'marketing', basePrice: 2000, description: 'Search engine optimization strategy', estimatedDays: 5 },
  { id: 'mkt-2', name: 'Content Marketing', category: 'marketing', basePrice: 3000, description: 'Content strategy and creation', estimatedDays: 10 },
  { id: 'mkt-3', name: 'Social Media Strategy', category: 'marketing', basePrice: 2500, description: 'Social media planning and execution', estimatedDays: 7 },
  { id: 'mkt-4', name: 'Email Marketing', category: 'marketing', basePrice: 1500, description: 'Email campaign setup and automation', estimatedDays: 4 },
  
  // Support modules
  { id: 'support-1', name: 'QA Testing', category: 'support', basePrice: 3000, description: 'Quality assurance and testing', estimatedDays: 8 },
  { id: 'support-2', name: 'Deployment', category: 'support', basePrice: 2000, description: 'Application deployment and setup', estimatedDays: 3 },
  { id: 'support-3', name: 'Support & Maintenance', category: 'support', basePrice: 5000, description: 'Post-launch support for 3 months', estimatedDays: 90 },
  { id: 'support-4', name: 'Documentation', category: 'support', basePrice: 1500, description: 'Technical documentation', estimatedDays: 4 },
  { id: 'support-5', name: 'Training', category: 'support', basePrice: 2000, description: 'User and team training sessions', estimatedDays: 5 },
];

const STORAGE_KEYS = {
  quotations: 'quotations',
  templates: 'templates',
  company: 'companyInfo',
  clients: 'savedClients',
  current: 'currentQuotation',
};

export function QuotationProvider({ children }: { children: React.ReactNode }) {
  const [currentQuotation, setCurrentQuotation] = useState<Quotation | null>(null);
  const [templates, setTemplates] = useState<QuotationTemplate[]>([]);
  const [savedQuotations, setSavedQuotations] = useState<Quotation[]>([]);
  const [companyInfo, setCompanyInfoState] = useState<CompanyInfo | null>(null);
  const [savedClients, setSavedClients] = useState<Client[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const quotations = localStorage.getItem(STORAGE_KEYS.quotations);
      const templatesData = localStorage.getItem(STORAGE_KEYS.templates);
      const company = localStorage.getItem(STORAGE_KEYS.company);
      const clients = localStorage.getItem(STORAGE_KEYS.clients);
      
      if (quotations) setSavedQuotations(JSON.parse(quotations));
      if (templatesData) setTemplates(JSON.parse(templatesData));
      if (company) setCompanyInfoState(JSON.parse(company));
      if (clients) setSavedClients(JSON.parse(clients));
      
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      setIsLoaded(true);
    }
  }, []);

  // Save quotations to localStorage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.quotations, JSON.stringify(savedQuotations));
  }, [savedQuotations, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(templates));
  }, [templates, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    if (companyInfo) {
      localStorage.setItem(STORAGE_KEYS.company, JSON.stringify(companyInfo));
    }
  }, [companyInfo, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem(STORAGE_KEYS.clients, JSON.stringify(savedClients));
  }, [savedClients, isLoaded]);

  const saveQuotation = (quotation: Quotation) => {
    setSavedQuotations(prev => {
      const existing = prev.findIndex(q => q.id === quotation.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = quotation;
        return updated;
      }
      return [...prev, quotation];
    });
  };

  const loadQuotation = (id: string) => {
    const quotation = savedQuotations.find(q => q.id === id);
    if (quotation) {
      setCurrentQuotation(quotation);
    }
  };

  const deleteQuotation = (id: string) => {
    setSavedQuotations(prev => prev.filter(q => q.id !== id));
  };

  const addTemplate = (template: QuotationTemplate) => {
    setTemplates(prev => [...prev, template]);
  };

  const deleteTemplate = (id: string) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const saveClient = (client: Client) => {
    setSavedClients(prev => {
      const existing = prev.findIndex(c => c.id === client.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = client;
        return updated;
      }
      return [...prev, client];
    });
  };

  const deleteClient = (id: string) => {
    setSavedClients(prev => prev.filter(c => c.id !== id));
  };

  const setCompanyInfo = (info: CompanyInfo) => {
    setCompanyInfoState(info);
  };

  const value: QuotationContextType = {
    currentQuotation,
    setCurrentQuotation,
    templates,
    addTemplate,
    deleteTemplate,
    savedQuotations,
    saveQuotation,
    loadQuotation,
    deleteQuotation,
    companyInfo,
    setCompanyInfo,
    savedClients,
    saveClient,
    deleteClient,
    predefinedModules: DEFAULT_MODULES,
  };

  return (
    <QuotationContext.Provider value={value}>
      {children}
    </QuotationContext.Provider>
  );
}

export function useQuotation() {
  const context = useContext(QuotationContext);
  if (context === undefined) {
    throw new Error('useQuotation must be used within a QuotationProvider');
  }
  return context;
}
