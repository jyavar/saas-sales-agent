/**
 * API client with multi-tenant support
 */

interface ApiClientOptions {
  baseUrl?: string;
  tenantSlug?: string;
  accessToken?: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId: string;
}

export class ApiClient {
  private baseUrl: string;
  private tenantSlug?: string;
  private accessToken?: string;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    this.tenantSlug = options.tenantSlug;
    this.accessToken = options.accessToken;
  }

  /**
   * Set tenant context
   */
  setTenant(tenantSlug: string) {
    this.tenantSlug = tenantSlug;
  }

  /**
   * Set access token
   */
  setAccessToken(token: string) {
    this.accessToken = token;
  }

  /**
   * Get default headers
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    if (this.tenantSlug) {
      headers['X-Tenant-ID'] = this.tenantSlug;
    }

    return headers;
  }

  /**
   * Make API request
   */
  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(endpoint, this.baseUrl);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request(url.pathname + url.search);
  }

  /**
   * POST request
   */
  async post<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // AUTH ENDPOINTS
  // ============================================================================

  async login(email: string, password: string) {
    return this.post('/api/auth/login', { email, password });
  }

  async register(data: {
    email: string;
    password: string;
    name: string;
    tenantName: string;
  }) {
    return this.post('/api/auth/register', data);
  }

  async logout() {
    return this.post('/api/auth/logout');
  }

  async getProfile() {
    return this.get('/api/auth/profile');
  }

  async updateProfile(data: { name?: string; email?: string }) {
    return this.put('/api/auth/profile', data);
  }

  // ============================================================================
  // TENANT ENDPOINTS
  // ============================================================================

  async getTenantContext() {
    return this.get('/api/tenant');
  }

  async updateTenant(data: any) {
    return this.put('/api/tenant', data);
  }

  async getTenantMembers() {
    return this.get('/api/tenant/members');
  }

  async inviteMember(data: { email: string; role: string; message?: string }) {
    return this.post('/api/tenant/members', data);
  }

  async updateMember(userId: string, data: { role: string; isActive?: boolean }) {
    return this.put(`/api/tenant/members/${userId}`, data);
  }

  async removeMember(userId: string) {
    return this.delete(`/api/tenant/members/${userId}`);
  }

  // ============================================================================
  // LEADS ENDPOINTS
  // ============================================================================

  async getLeads(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    source?: string;
    priority?: string;
  }) {
    return this.get('/api/leads', params);
  }

  async createLead(data: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
    jobTitle?: string;
    phone?: string;
    website?: string;
    source?: string;
    priority?: string;
    tags?: string[];
  }) {
    return this.post('/api/leads', data);
  }

  async getLead(id: string) {
    return this.get(`/api/leads/${id}`);
  }

  async updateLead(id: string, data: any) {
    return this.put(`/api/leads/${id}`, data);
  }

  async deleteLead(id: string) {
    return this.delete(`/api/leads/${id}`);
  }

  async bulkCreateLeads(leads: any[]) {
    return this.post('/api/leads/bulk', { leads });
  }

  async getLeadsStats() {
    return this.get('/api/leads/stats');
  }

  // ============================================================================
  // CAMPAIGNS ENDPOINTS
  // ============================================================================

  async getCampaigns(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    return this.get('/api/campaigns', params);
  }

  async createCampaign(data: {
    name: string;
    subject: string;
    body: string;
    leadIds: string[];
    scheduleAt?: string;
  }) {
    return this.post('/api/campaigns', data);
  }

  async getCampaign(id: string) {
    return this.get(`/api/campaigns/${id}`);
  }

  async updateCampaign(id: string, data: any) {
    return this.put(`/api/campaigns/${id}`, data);
  }

  async deleteCampaign(id: string) {
    return this.delete(`/api/campaigns/${id}`);
  }

  async sendCampaign(id: string) {
    return this.post(`/api/campaigns/${id}/send`);
  }

  async getCampaignStats(id: string) {
    return this.get(`/api/campaigns/${id}/stats`);
  }

  // ============================================================================
  // ANALYTICS ENDPOINTS
  // ============================================================================

  async getDashboard() {
    return this.get('/api/analytics/dashboard');
  }

  async getLeadsAnalytics() {
    return this.get('/api/analytics/leads');
  }

  async getCampaignsAnalytics() {
    return this.get('/api/analytics/campaigns');
  }

  async getPerformanceAnalytics() {
    return this.get('/api/analytics/performance');
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Hook for using API client with auth context
export function useApiClient() {
  return apiClient;
}

export default apiClient;