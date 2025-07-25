'use client';

import OnboardingForm from '@/presentation/components/onboarding/OnboardingForm';
import { useEffect } from 'react';

export default function RegisterPage() {
  // Efecto para asegurar que la página se cargue desde el principio
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return  (<div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
  <OnboardingForm />
</div>);
}