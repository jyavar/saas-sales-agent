import type { ReactNode } from "react";
import { NextAuthSessionProvider } from "@/components/NextAuthSessionProvider";
import { TenantProvider } from "@/lib/contexts/TenantContext";

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <TenantProvider>{children}</TenantProvider>
    </NextAuthSessionProvider>
  );
} 