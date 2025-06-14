'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useHeaders } from 'next/headers';

export interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
}

export interface TenantFeatures {
  aiAgents: boolean;
  campaigns: boolean;
  analytics: boolean;
  webhooks: boolean;
  apiAccess: boolean;
}

export interface TenantLimits {
  maxUsers: number;
  maxLeads: number;
  maxCampaigns: number;
  maxApiCalls: number;
  maxStorage: number;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  isActive: boolean;
  settings: {
    features: TenantFeatures;
    branding: TenantBranding;
    notifications: {
      email: boolean;
      webhook: boolean;
      slack: boolean;
    };
  };
  planLimits: TenantLimits;
  createdAt: string;
  updatedAt: string;
}

interface TenantContextType {
  tenant: Tenant | null;
  tenantSlug: string | null;
  isLoading: boolean;
  error: string | null;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
  tenantSlug?: string;
}

export function TenantProvider({ children, tenantSlug }: TenantProviderProps) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTenantContext = async () => {
    if (!tenantSlug) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/tenant/context', {
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

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to load tenant');
      }

      setTenant(data.tenant);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to fetch tenant context:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshTenant = async () => {
    await fetchTenantContext();
  };

  useEffect(() => {
    fetchTenantContext();
  }, [tenantSlug]);

  const value: TenantContextType = {
    tenant,
    tenantSlug: tenantSlug || null,
    isLoading,
    error,
    refreshTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export default TenantContext;