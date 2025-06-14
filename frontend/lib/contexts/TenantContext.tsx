"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

// Define the shape of tenant data
export interface Tenant {
  id: string;
  name: string;
  branding?: Record<string, any>;
  plan?: string;
  [key: string]: any;
}

interface TenantContextValue {
  tenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const TenantContext = createContext<TenantContextValue | undefined>(undefined);

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract slug from /tenant/[slug]/...
  useEffect(() => {
    setLoading(true);
    setError(null);
    const match = pathname.match(/\/tenant\/([^/]+)/);
    const slug = match ? match[1] : null;
    if (!slug) {
      setTenant(null);
      setLoading(false);
      setError("Tenant slug not found in URL");
      return;
    }
    fetch(`/api/tenants/${slug}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Tenant not found");
        return res.json();
      })
      .then((data) => {
        setTenant(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Error loading tenant");
        setTenant(null);
        setLoading(false);
      });
  }, [pathname]);

  return (
    <TenantContext.Provider value={{ tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
};

/**
 * Hook to access the current tenant context.
 */
export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
};

/**
 * TenantGuard: Wrapper to protect routes/components that require a valid tenant.
 * Redirects to /error/tenant if tenant is missing or error.
 */
export const TenantGuard = ({ children }: { children: ReactNode }) => {
  const { tenant, loading, error } = useTenant();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!tenant || error)) {
      router.replace("/error/tenant");
    }
  }, [tenant, loading, error, router]);

  if (loading) return <div className="p-4 text-center">Loading tenant...</div>;
  return <>{children}</>;
};

/**
 * Patch fetch/axios client to inject X-Tenant-ID header automatically.
 * Example for fetch:
 */
export const withTenantHeader = (tenantId: string) => {
  return async (input: RequestInfo, init: RequestInit = {}) => {
    const headers = new Headers(init.headers);
    headers.set("X-Tenant-ID", tenantId);
    return fetch(input, { ...init, headers });
  };
};

// For axios, you can set up an interceptor in your client.ts:
// import axios from "axios";
// axios.interceptors.request.use((config) => {
//   const tenantId = ... // get from context or storage
//   if (tenantId) config.headers["X-Tenant-ID"] = tenantId;
//   return config;
// }); 