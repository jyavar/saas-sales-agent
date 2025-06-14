"use client";
import { useAuth } from "@/hooks/use-auth";
import { useTenant } from "@/lib/contexts/TenantContext";
import { AuthGuard } from "@/components/testing/AuthGuard";

export default function OnboardingPage() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4">¡Bienvenido, {user?.email}!</h1>
        <p className="mb-2">Tu tenant: <span className="font-semibold">{tenant?.name}</span></p>
        <p className="mb-4">Rol: <span className="font-semibold">{user?.role}</span></p>
        <p>Completa tu perfil y comienza a usar la plataforma.</p>
      </div>
    </AuthGuard>
  );
} 