"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.TenantProvider = TenantProvider;
exports.useTenant = useTenant;
const react_1 = __importStar(require("react"));
const TenantContext = (0, react_1.createContext)(undefined);
function TenantProvider({ children, tenantSlug }) {
    const [tenant, setTenant] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchTenantContext = () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!tenantSlug) {
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const response = yield fetch('/api/tenant/context', {
                headers: {
                    'X-Tenant-ID': tenantSlug,
                },
            });
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Tenant not found');
                }
                if (response.status === 403) {
                    throw new Error('Tenant is inactive');
                }
                throw new Error('Failed to load tenant information');
            }
            const data = yield response.json();
            if (!data.success) {
                throw new Error(((_a = data.error) === null || _a === void 0 ? void 0 : _a.message) || 'Failed to load tenant');
            }
            setTenant(data.tenant);
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            setError(errorMessage);
            console.error('Failed to fetch tenant context:', err);
        }
        finally {
            setIsLoading(false);
        }
    });
    const refreshTenant = () => __awaiter(this, void 0, void 0, function* () {
        yield fetchTenantContext();
    });
    (0, react_1.useEffect)(() => {
        fetchTenantContext();
    }, [tenantSlug]);
    const value = {
        tenant,
        tenantSlug: tenantSlug || null,
        isLoading,
        error,
        refreshTenant,
    };
    return (<TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>);
}
function useTenant() {
    const context = (0, react_1.useContext)(TenantContext);
    if (context === undefined) {
        throw new Error('useTenant must be used within a TenantProvider');
    }
    return context;
}
exports.default = TenantContext;
