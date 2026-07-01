// Quotation API calls
export const quotationAPI = {
  async getAll() {
    const response = await fetch('/api/quotations');
    if (!response.ok) throw new Error('Failed to fetch quotations');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`/api/quotations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch quotation');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch('/api/quotations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create quotation');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`/api/quotations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update quotation');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`/api/quotations/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete quotation');
    return response.json();
  },
};

// Client API calls
export const clientAPI = {
  async getAll() {
    const response = await fetch('/api/clients');
    if (!response.ok) throw new Error('Failed to fetch clients');
    return response.json();
  },

  async getById(id: string) {
    const response = await fetch(`/api/clients/${id}`);
    if (!response.ok) throw new Error('Failed to fetch client');
    return response.json();
  },

  async create(data: any) {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create client');
    return response.json();
  },

  async update(id: string, data: any) {
    const response = await fetch(`/api/clients/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update client');
    return response.json();
  },

  async delete(id: string) {
    const response = await fetch(`/api/clients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete client');
    return response.json();
  },
};
