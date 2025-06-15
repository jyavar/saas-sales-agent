"use strict";
'use client';
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
exports.useAuth = useAuth;
const react_1 = require("react");
const TenantContext_1 = require("@/lib/contexts/TenantContext");
function useAuth() {
    const [user, setUser] = (0, react_1.useState)(null);
    const [session, setSession] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const { tenantSlug } = (0, TenantContext_1.useTenant)();
    const isAuthenticated = !!user && !!session;
    // Get auth headers with tenant context
    const getAuthHeaders = (0, react_1.useCallback)(() => {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (session === null || session === void 0 ? void 0 : session.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
        }
        if (tenantSlug) {
            headers['X-Tenant-ID'] = tenantSlug;
        }
        return headers;
    }, [session === null || session === void 0 ? void 0 : session.access_token, tenantSlug]);
    // Load session from localStorage
    const loadSession = (0, react_1.useCallback)(() => {
        try {
            const storedSession = localStorage.getItem('auth_session');
            if (storedSession) {
                const parsedSession = JSON.parse(storedSession);
                // Check if session is expired
                if (parsedSession.expires_at > Date.now()) {
                    setSession(parsedSession);
                    setUser(parsedSession.user);
                }
                else {
                    // Session expired, clear it
                    localStorage.removeItem('auth_session');
                }
            }
        }
        catch (error) {
            console.error('Failed to load session:', error);
            localStorage.removeItem('auth_session');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    // Save session to localStorage
    const saveSession = (0, react_1.useCallback)((newSession) => {
        try {
            localStorage.setItem('auth_session', JSON.stringify(newSession));
            setSession(newSession);
            setUser(newSession.user);
        }
        catch (error) {
            console.error('Failed to save session:', error);
        }
    }, []);
    // Clear session
    const clearSession = (0, react_1.useCallback)(() => {
        localStorage.removeItem('auth_session');
        setSession(null);
        setUser(null);
    }, []);
    // Login function
    const login = (0, react_1.useCallback)((email, password) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield fetch('/api/auth/login', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ email, password }),
            });
            const data = yield response.json();
            if (!response.ok || !data.success) {
                return {
                    success: false,
                    error: ((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Login failed',
                };
            }
            // Create session with expiration
            const newSession = {
                access_token: data.session.access_token,
                user: data.user,
                expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
            };
            saveSession(newSession);
            return { success: true };
        }
        catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Network error. Please try again.',
            };
        }
    }), [getAuthHeaders, saveSession]);
    // Register function
    const register = (0, react_1.useCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const response = yield fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = yield response.json();
            if (!response.ok || !result.success) {
                return {
                    success: false,
                    error: ((_a = result.error) === null || _a === void 0 ? void 0 : _a.message) || 'Registration failed',
                };
            }
            // Create session with expiration
            const newSession = {
                access_token: result.session.access_token,
                user: result.user,
                expires_at: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
            };
            saveSession(newSession);
            return { success: true };
        }
        catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: 'Network error. Please try again.',
            };
        }
    }), [saveSession]);
    // Logout function
    const logout = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        try {
            if (session === null || session === void 0 ? void 0 : session.access_token) {
                yield fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: getAuthHeaders(),
                });
            }
        }
        catch (error) {
            console.error('Logout error:', error);
        }
        finally {
            clearSession();
        }
    }), [session === null || session === void 0 ? void 0 : session.access_token, getAuthHeaders, clearSession]);
    // Refresh session
    const refreshSession = (0, react_1.useCallback)(() => __awaiter(this, void 0, void 0, function* () {
        if (!(session === null || session === void 0 ? void 0 : session.access_token))
            return;
        try {
            const response = yield fetch('/api/auth/profile', {
                headers: getAuthHeaders(),
            });
            if (response.ok) {
                const data = yield response.json();
                if (data.success && data.user) {
                    const updatedSession = Object.assign(Object.assign({}, session), { user: data.user });
                    saveSession(updatedSession);
                }
            }
            else if (response.status === 401) {
                // Session invalid, clear it
                clearSession();
            }
        }
        catch (error) {
            console.error('Failed to refresh session:', error);
        }
    }), [session, getAuthHeaders, saveSession, clearSession]);
    // Load session on mount
    (0, react_1.useEffect)(() => {
        loadSession();
    }, [loadSession]);
    // Refresh session periodically
    (0, react_1.useEffect)(() => {
        if (!isAuthenticated)
            return;
        const interval = setInterval(() => {
            refreshSession();
        }, 5 * 60 * 1000); // Every 5 minutes
        return () => clearInterval(interval);
    }, [isAuthenticated, refreshSession]);
    return {
        user,
        session,
        isLoading,
        isAuthenticated,
        login,
        logout,
        register,
        refreshSession,
    };
}
