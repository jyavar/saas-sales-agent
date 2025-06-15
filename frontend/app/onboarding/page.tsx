"use client";
import React from 'react';
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/lib/contexts/TenantContext";
import { AuthGuard } from "@/components/testing/AuthGuard";
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';

export default function OnboardingPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  return (
    <AuthGuard>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <OnboardingWizard />
      </div>
    </AuthGuard>
  );
} 