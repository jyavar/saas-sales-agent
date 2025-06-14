'use client';

import { ReactNode } from 'react';
import { useTenant } from '@/lib/contexts/TenantContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TenantGuardProps {
  children: ReactNode;
}

export function TenantGuard({ children }: TenantGuardProps) {
  const { tenant, isLoading, error } = useTenant();

  // Show loading while fetching tenant
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Show error if tenant not found or inactive
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Tenant not found' ? 'Organization Not Found' : 'Access Denied'}
          </h1>
          
          <p className="text-gray-600 mb-6">
            {error === 'Tenant not found' 
              ? 'The organization you\'re looking for doesn\'t exist or has been removed.'
              : error === 'Tenant is inactive'
              ? 'This organization is currently inactive. Please contact support for assistance.'
              : 'There was an issue accessing this organization.'}
          </p>
          
          <div className="space-y-3">
            <a 
              href="https://stratoai.org" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Strato AI
            </a>
            
            {error !== 'Tenant not found' && (
              <div>
                <button 
                  onClick={() => window.location.reload()}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render children if tenant is valid
  return <>{children}</>;
}