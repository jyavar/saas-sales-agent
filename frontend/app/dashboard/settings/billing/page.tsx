"use client";
import { useTenant } from "@/lib/contexts/TenantContext";
import { AuthGuard } from "@/components/testing/AuthGuard";

export default function BillingPage() {
  const { tenant } = useTenant();

  const handleUpgrade = async () => {
    // Aquí iría la lógica real de integración con Stripe/Paddle
    alert("Redirigiendo a checkout de pago...");
  };

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Suscripción</h2>
        <p>Plan actual: <span className="font-semibold">{tenant?.plan ?? "Free"}</span></p>
        <button className="btn btn-primary mt-4" onClick={handleUpgrade}>
          Mejorar plan
        </button>
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Historial de pagos</h3>
          <ul className="text-sm text-gray-600">
            <li>01/2024 - $49 - PRO</li>
            <li>12/2023 - $49 - PRO</li>
            <li>11/2023 - $0 - Free</li>
          </ul>
        </div>
      </div>
    </AuthGuard>
  );
} 