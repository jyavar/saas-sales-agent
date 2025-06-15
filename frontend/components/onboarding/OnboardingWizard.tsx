import React, { useState } from 'react';
import Joyride from 'react-joyride';

const steps = [
  {
    target: '.onboarding-step-1',
    content: 'Bienvenido a StratoSalesAgent. Aquí puedes crear tu primera campaña.',
  },
  {
    target: '.onboarding-step-2',
    content: 'Configura los datos de tu empresa y preferencias.',
  },
  {
    target: '.onboarding-step-3',
    content: '¡Listo! Explora el dashboard y comienza a automatizar tus ventas.',
  },
];

export const OnboardingWizard: React.FC = () => {
  const [run, setRun] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  // Simulación de carga de datos demo
  const handleDemoData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/demo/seed', { method: 'POST' });
      if (!res.ok) throw new Error('Error al cargar datos demo');
      setStep(1);
    } catch (err) {
      setError('No se pudo cargar la demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow onboarding-step-1">
      <Joyride steps={steps} run={run} continuous showSkipButton locale={{ next: 'Siguiente', back: 'Atrás', skip: 'Saltar', last: 'Finalizar' }} />
      <h2 className="text-2xl font-bold mb-4">Bienvenido a StratoSalesAgent</h2>
      {loading && <div className="text-blue-600">Cargando datos demo...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {step === 0 && !loading && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleDemoData}>
          Probar con datos demo
        </button>
      )}
      {step === 1 && !loading && (
        <div className="onboarding-step-2">
          <p className="mb-2">Datos demo cargados. Ahora configura tu empresa.</p>
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => setStep(2)}>
            Siguiente
          </button>
        </div>
      )}
      {step === 2 && !loading && (
        <div className="onboarding-step-3">
          <p className="mb-2">¡Listo! Explora el dashboard y comienza a automatizar tus ventas.</p>
        </div>
      )}
    </div>
  );
};

export default OnboardingWizard; 