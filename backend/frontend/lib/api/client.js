"use strict";
/**
 * API client with multi-tenant support
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.ApiClient = void 0;
exports.useApiClient = useApiClient;
class ApiClient {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        this.tenantSlug = options.tenantSlug;
        this.accessToken = options.accessToken;
    }
    /**
     * Set tenant context
     */
    setTenant(tenantSlug) {
        this.tenantSlug = tenantSlug;
    }
    /**
     * Set access token
     */
    setAccessToken(token) {
        this.accessToken = token;
    }
    /**
     * Get default headers
     */
    getHeaders() {
        const headers = {
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
    request(endpoint_1) {
        return __awaiter(this, arguments, void 0, function* (endpoint, options = {}) {
            var _a;
            const url = `${this.baseUrl}${endpoint}`;
            const config = Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, this.getHeaders()), options.headers) });
            try {
                const response = yield fetch(url, config);
                const data = yield response.json();
                if (!response.ok) {
                    throw new Error(((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || `HTTP ${response.status}`);
                }
                return data;
            }
            catch (error) {
                console.error('API request failed:', error);
                throw error;
            }
        });
    }
    /**
     * GET request
     */
    get(endpoint, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new URL(endpoint, this.baseUrl);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        url.searchParams.append(key, String(value));
                    }
                });
            }
            return this.request(url.pathname + url.search);
        });
    }
    /**
     * POST request
     */
    post(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, {
                method: 'POST',
                body: data ? JSON.stringify(data) : undefined,
            });
        });
    }
    /**
     * PUT request
     */
    put(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, {
                method: 'PUT',
                body: data ? JSON.stringify(data) : undefined,
            });
        });
    }
    /**
     * DELETE request
     */
    delete(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(endpoint, {
                method: 'DELETE',
            });
        });
    }
    // ============================================================================
    // AUTH ENDPOINTS
    // ============================================================================
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post('/api/auth/login', { email, password });
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post('/api/auth/register', data);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post('/api/auth/logout');
        });
    }
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/auth/profile');
        });
    }
    updateProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.put('/api/auth/profile', data);
        });
    }
    // ============================================================================
    // TENANT ENDPOINTS
    // ============================================================================
    getTenantContext() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/tenant');
        });
    }
    updateTenant(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.put('/api/tenant', data);
        });
    }
    getTenantMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/tenant/members');
        });
    }
    inviteMember(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post('/api/tenant/members', data);
        });
    }
    updateMember(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.put(`/api/tenant/members/${userId}`, data);
        });
    }
    removeMember(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delete(`/api/tenant/members/${userId}`);
        });
    }
    // ============================================================================
    // LEADS ENDPOINTS
    // ============================================================================
    getLeads(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/leads', params);
        });
    }
    createLead(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post('/api/leads', data);
        });
    }
    getLead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/api/leads/${id}`);
        });
    }
    updateLead(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.put(`/api/leads/${id}`, data);
        });
    }
    deleteLead(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delete(`/api/leads/${id}`);
        });
    }
    bulkCreateLeads(leads) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post('/api/leads/bulk', { leads });
        });
    }
    getLeadsStats() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/leads/stats');
        });
    }
    // ============================================================================
    // CAMPAIGNS ENDPOINTS
    // ============================================================================
    getCampaigns(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/campaigns', params);
        });
    }
    createCampaign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post('/api/campaigns', data);
        });
    }
    getCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/api/campaigns/${id}`);
        });
    }
    updateCampaign(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.put(`/api/campaigns/${id}`, data);
        });
    }
    deleteCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.delete(`/api/campaigns/${id}`);
        });
    }
    sendCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.post(`/api/campaigns/${id}/send`);
        });
    }
    getCampaignStats(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/api/campaigns/${id}/stats`);
        });
    }
    // ============================================================================
    // ANALYTICS ENDPOINTS
    // ============================================================================
    getDashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/analytics/dashboard');
        });
    }
    getLeadsAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/analytics/leads');
        });
    }
    getCampaignsAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/analytics/campaigns');
        });
    }
    getPerformanceAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get('/api/analytics/performance');
        });
    }
}
exports.ApiClient = ApiClient;
// Create singleton instance
exports.apiClient = new ApiClient();
// Hook for using API client with auth context
function useApiClient() {
    return exports.apiClient;
}
exports.default = exports.apiClient;
