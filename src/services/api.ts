import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token from localStorage to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vighnaharta_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AUTH SERVICES
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    return response.data;
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (email: string, resetCode: string, newPassword: string) => {
    const response = await apiClient.post('/auth/reset-password', { email, resetCode, newPassword });
    return response.data;
  },
};

// USER MANAGEMENT SERVICES
export const userAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
  createUser: async (userData: {
    name: string;
    email: string;
    password?: string;
    role: string;
    phone?: string;
    address?: string;
    profilePhoto?: string;
    permissions?: string[];
  }) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },
  updateUser: async (id: string, userData: any) => {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};

// PUBLIC CONTENT SERVICES
export const publicAPI = {
  getSettings: async () => {
    const response = await apiClient.get('/settings');
    return response.data;
  },
  getInstagramFeed: async (handle?: string) => {
    const response = await apiClient.get('/instagram/feed', { params: { handle } });
    return response.data;
  },
  getMembers: async () => {
    const response = await apiClient.get('/members');
    return response.data;
  },
  getEvents: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },
  getAnnouncements: async () => {
    const response = await apiClient.get('/announcements');
    return response.data;
  },
  getGallery: async () => {
    const response = await apiClient.get('/gallery');
    return response.data;
  },
  getHomepageVolunteers: async () => {
    const response = await apiClient.get('/volunteers/public');
    return response.data;
  },
  submitVolunteer: async (volunteerData: any) => {
    const response = await apiClient.post('/volunteers', volunteerData);
    return response.data;
  },
  subscribeNewsletter: async (email: string) => {
    const response = await apiClient.post('/subscribers', { email });
    return response.data;
  },
  createPublicDonation: async (donationData: any) => {
    const response = await apiClient.post('/donations/public', donationData);
    return response.data;
  },
};

// ADMIN MANAGEMENT SERVICES
export const adminAPI = {
  getFinancialSummary: async () => {
    const response = await apiClient.get('/finance/summary');
    return response.data;
  },
  getDonations: async () => {
    const response = await apiClient.get('/donations');
    return response.data;
  },
  createDonation: async (donationData: any) => {
    const response = await apiClient.post('/donations', donationData);
    return response.data;
  },
  updateDonation: async (id: string, donationData: any) => {
    const response = await apiClient.put(`/donations/${id}`, donationData);
    return response.data;
  },
  deleteDonation: async (id: string) => {
    const response = await apiClient.delete(`/donations/${id}`);
    return response.data;
  },
  getExpenses: async () => {
    const response = await apiClient.get('/expenses');
    return response.data;
  },
  createExpense: async (expenseData: any) => {
    const response = await apiClient.post('/expenses', expenseData);
    return response.data;
  },
  updateExpense: async (id: string, expenseData: any) => {
    const response = await apiClient.put(`/expenses/${id}`, expenseData);
    return response.data;
  },
  deleteExpense: async (id: string) => {
    const response = await apiClient.delete(`/expenses/${id}`);
    return response.data;
  },
  getBudget: async () => {
    const response = await apiClient.get('/budget');
    return response.data;
  },
  updateBudget: async (budgetData: any) => {
    const response = await apiClient.put('/budget', budgetData);
    return response.data;
  },
  deleteBudget: async () => {
    const response = await apiClient.delete('/budget');
    return response.data;
  },
  deleteBudgetCategory: async (categoryId: string) => {
    const response = await apiClient.delete(`/budget/categories/${categoryId}`);
    return response.data;
  },

  updateSettings: async (settingsData: any) => {
    const response = await apiClient.put('/settings', settingsData);
    return response.data;
  },
  resetSettings: async () => {
    const response = await apiClient.delete('/settings');
    return response.data;
  },

  // Announcements CRUD
  createAnnouncement: async (announcementData: any) => {
    const response = await apiClient.post('/announcements', announcementData);
    return response.data;
  },
  updateAnnouncement: async (id: string, announcementData: any) => {
    const response = await apiClient.put(`/announcements/${id}`, announcementData);
    return response.data;
  },
  deleteAnnouncement: async (id: string) => {
    const response = await apiClient.delete(`/announcements/${id}`);
    return response.data;
  },

  // Events CRUD
  createEvent: async (eventData: any) => {
    const response = await apiClient.post('/events', eventData);
    return response.data;
  },
  updateEvent: async (id: string, eventData: any) => {
    const response = await apiClient.put(`/events/${id}`, eventData);
    return response.data;
  },
  deleteEvent: async (id: string) => {
    const response = await apiClient.delete(`/events/${id}`);
    return response.data;
  },

  // Members / Donor Profiles CRUD
  getMembers: async () => {
    const response = await apiClient.get('/members');
    return response.data;
  },
  createMember: async (memberData: any) => {
    const response = await apiClient.post('/members', memberData);
    return response.data;
  },
  updateMember: async (id: string, memberData: any) => {
    const response = await apiClient.put(`/members/${id}`, memberData);
    return response.data;
  },
  deleteMember: async (id: string) => {
    const response = await apiClient.delete(`/members/${id}`);
    return response.data;
  },

  // Gallery CRUD
  createGalleryItem: async (itemData: any) => {
    const response = await apiClient.post('/gallery', itemData);
    return response.data;
  },
  updateGalleryItem: async (id: string, itemData: any) => {
    const response = await apiClient.put(`/gallery/${id}`, itemData);
    return response.data;
  },
  deleteGalleryItem: async (id: string) => {
    const response = await apiClient.delete(`/gallery/${id}`);
    return response.data;
  },

  // Volunteers Management
  getVolunteers: async () => {
    const response = await apiClient.get('/volunteers');
    return response.data;
  },
  createVolunteer: async (volunteerData: any) => {
    const response = await apiClient.post('/volunteers', volunteerData);
    return response.data;
  },
  updateVolunteer: async (id: string, volunteerData: any) => {
    const response = await apiClient.put(`/volunteers/${id}`, volunteerData);
    return response.data;
  },
  deleteVolunteer: async (id: string) => {
    const response = await apiClient.delete(`/volunteers/${id}`);
    return response.data;
  },

  // Newsletter Subscribers Management
  getSubscribers: async () => {
    const response = await apiClient.get('/subscribers');
    return response.data;
  },
  deleteSubscriber: async (id: string) => {
    const response = await apiClient.delete(`/subscribers/${id}`);
    return response.data;
  },

  getAuditLogs: async () => {
    const response = await apiClient.get('/audit-logs');
    return response.data;
  },

  // Users Management
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Reports Exports
  exportFinancialPDF: async (params?: { startDate?: string; endDate?: string; month?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const response = await apiClient.get(`/exports/financial-pdf${query}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Financial_Report_Ganesh_Utsav_2026.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportDonorPDF: async (donorName: string) => {
    const response = await apiClient.get(`/exports/donor-pdf?donorName=${encodeURIComponent(donorName)}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    const safeName = donorName.replace(/[^a-zA-Z0-9]/g, '_');
    link.setAttribute('download', `Donor_Statement_${safeName}_2026.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportDonationsExcel: async (params?: Record<string, any>) => {
    const response = await apiClient.get('/exports/donations-excel', {
      params,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Donations_Report_2026.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportExpensesPDF: async (params?: { category?: string; month?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const response = await apiClient.get(`/exports/expenses-pdf${query}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Expenses_Report_Ganesh_Utsav_2026.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportExpensesExcel: async (params?: { category?: string; month?: string }) => {
    const query = params ? '?' + new URLSearchParams(params as any).toString() : '';
    const response = await apiClient.get(`/exports/expenses-excel${query}`, {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Expenses_Report_2026.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportBudgetPDF: async () => {
    const response = await apiClient.get('/exports/budget-pdf', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Budget_vs_Actual_Variance_2026.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  exportBudgetExcel: async () => {
    const response = await apiClient.get('/exports/budget-excel', {
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    );
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Budget_vs_Actual_Variance_2026.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};
