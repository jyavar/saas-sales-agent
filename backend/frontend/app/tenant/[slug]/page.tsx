'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTenant } from '@/lib/contexts/TenantContext';
import { useAuth } from '@/lib/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { LoginForm } from '@/components/auth/LoginForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface TenantHomePageProps {
  params: { slug: string };
}

export default function TenantHomePage({ params }: TenantHomePageProps) {
  const router = useRouter();
  const { tenant, isLoading: tenantLoading, error: tenantError } = useTenant();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!authLoading && !tenantLoading && isAuthenticated && tenant) {
      router.push(`/tenant/${params.slug}/dashboard`);
    }
  }, [isAuthenticated, authLoading, tenantLoading, tenant, router, params.slug]);

  // Show loading while checking tenant and auth
  if (tenantLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error if tenant not found or inactive
  if (tenantError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {tenantError === 'Tenant not found' ? 'Organization Not Found' : 'Access Denied'}
          </h1>
          <p className="text-gray-600 mb-6">
            {tenantError === 'Tenant not found' 
              ? 'The organization you\'re looking for doesn\'t exist or has been removed.'
              : 'This organization is currently inactive.'}
          </p>
          <a 
            href="https://stratoai.org" 
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Return to Strato AI
          </a>
        </div>
      </div>
    );
  }

  // Show login form for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            {tenant?.settings?.branding?.logo ? (
              <img
                className="mx-auto h-12 w-auto"
                src={tenant.settings.branding.logo}
                alt={tenant.name}
              />
            ) : (
              <h2 className="text-3xl font-bold text-gray-900">
                {tenant?.name || 'Strato AI'}
              </h2>
            )}
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Access your {tenant?.name || 'organization'} dashboard
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  // This shouldn't be reached due to the redirect effect above
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
}