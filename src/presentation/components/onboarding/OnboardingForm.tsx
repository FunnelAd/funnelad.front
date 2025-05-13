'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

// Definición de los pasos del onboarding
const STEPS = [
  {
    id: 'welcome',
    title: 'Es hora de dar vida a tu negocio',
    description: 'Bienvenido a FunnelAd, donde transformamos tu presencia digital'
  },
  {
    id: 'info',
    title: 'Información general',
    description: 'Cuéntanos sobre ti y tu negocio'
  },
  {
    id: 'agent',
    title: '¿Qué tipo de agente deseas?',
    description: 'Selecciona el tipo de asistente que mejor se adapte a tus necesidades'
  },
  {
    id: 'confirmation',
    title: 'Confirmación',
    description: '¡Todo listo para comenzar!'
  }
];

// Tipos de agentes disponibles
const AGENT_TYPES = [
  {
    id: 'text',
    name: 'AGENTE DE TEXTO',
    description: 'Apto para responder mensajes en canales de texto.',
    icon: '/images/onboarding/text-agent-icon.svg',
    bgColor: 'bg-[#002639]'
  },
  {
    id: 'voice',
    name: 'AGENTE DE VOZ',
    description: 'Apto para generar y recibir llamadas',
    icon: '/images/onboarding/voice-agent-icon.svg',
    bgColor: 'bg-[#1D5A7A]'
  }
];

const OnboardingForm: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Información general
    businessName: '',
    fullName: '',
    email: '',
    whatsapp: '',
    
    // Tipo de agente
    agentType: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Seleccionar tipo de agente
  const handleAgentSelect = (agentId: string) => {
    setFormData(prev => ({
      ...prev,
      agentType: agentId
    }));
    
    if (errors.agentType) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.agentType;
        return newErrors;
      });
    }
  };

  // Validar el formulario según el paso actual
  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      // Validación de información general
      if (!formData.businessName.trim()) newErrors.businessName = 'El nombre del negocio es requerido';
      if (!formData.fullName.trim()) newErrors.fullName = 'Tu nombre es requerido';
      if (!formData.email.trim()) {
        newErrors.email = 'El correo electrónico es requerido';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El correo electrónico no es válido';
      }
      if (!formData.whatsapp.trim()) newErrors.whatsapp = 'El teléfono de WhatsApp es requerido';
    } else if (currentStep === 2) {
      // Validación de tipo de agente
      if (!formData.agentType) newErrors.agentType = 'Debes seleccionar un tipo de agente';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Avanzar al siguiente paso
  const handleNext = () => {
    if (currentStep === 0 || validateStep()) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  // Retroceder al paso anterior
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Enviar el formulario
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Aquí iría la lógica para enviar los datos al backend
      console.log('Datos del formulario:', formData);
      
      // Simular una petición al backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirigir al dashboard después de completar el onboarding
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Renderizar el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Es hora de dar <span className="text-[#C9A14A]">vida</span> a tu negocio
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                FunnelAd te ayuda a automatizar tus ventas y atención al cliente con inteligencia artificial.
              </p>
              <button
                onClick={handleNext}
                className="px-8 py-3 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center"
              >
                CONTINUAR
              </button>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, type: "spring" }}
              >
                <Image
                  src="/images/onboarding/welcome-illustration.png"
                  alt="FunnelAd - Automatiza tu negocio"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        );
      
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="md:w-2/5">
              <motion.div
                initial={{ scale: 0.9, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="/images/onboarding/business-info-illustration.png"
                  alt="Información de negocio"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-full"
                />
              </motion.div>
            </div>
            
            <div className="md:w-3/5">
              <h2 className="text-3xl font-bold text-white mb-6">
                Información general
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-1">
                    Nombre de negocio/empresa
                  </label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.businessName ? 'border-red-500' : 'border-[#C9A14A]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700`}
                  />
                  {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName}</p>}
                </div>
                
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">
                    Tu nombre
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.fullName ? 'border-red-500' : 'border-[#C9A14A]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700`}
                  />
                  {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-[#C9A14A]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300 mb-1">
                    Teléfono WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.whatsapp ? 'border-red-500' : 'border-[#C9A14A]'} rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700`}
                  />
                  {errors.whatsapp && <p className="mt-1 text-sm text-red-500">{errors.whatsapp}</p>}
                </div>
                
                <p className="text-sm text-gray-400 mt-2">
                  El correo electrónico y el teléfono de WhatsApp son fundamentales para enviarte notificaciones importantes sobre tu agente.
                </p>
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              ¿Qué tipo de agente deseas?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {AGENT_TYPES.map((agent) => (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${agent.bgColor} rounded-lg p-8 cursor-pointer transition-all duration-300 h-full flex flex-col items-center ${formData.agentType === agent.id ? 'ring-4 ring-[#C9A14A]' : ''}`}
                  onClick={() => handleAgentSelect(agent.id)}
                >
                  <div className="w-32 h-32 mb-6">
                    <Image
                      src={agent.icon}
                      alt={agent.name}
                      width={128}
                      height={128}
                      className="w-full h-full"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
                  <p className="text-white text-center">{agent.description}</p>
                  <div className="mt-auto pt-4">
                    <span className="text-[#C9A14A] font-medium">
                      {formData.agentType === agent.id ? 'SELECCIONADO >' : 'SELECCIONAR >'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {errors.agentType && (
              <p className="text-center text-red-500 mt-2">{errors.agentType}</p>
            )}
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center"
            >
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            
            <h2 className="text-3xl font-bold text-white">
              ¡Felicidades! Tu agente está listo
            </h2>
            
            <p className="text-lg text-gray-300">
              Hemos configurado tu agente de {formData.agentType === 'text' ? 'texto' : 'voz'} para {formData.businessName}.
              <br />Te enviaremos un correo a {formData.email} con los detalles.
            </p>
            
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center justify-center mx-auto"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  'COMENZAR A USAR FUNNELAD'
                )}
              </button>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
      {/* Fondo decorativo moderno */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-yellow-400/30 via-yellow-200/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-blue-200/10 to-transparent rounded-full blur-2xl animate-pulse" />
      </div>
      
      {/* Logo */}
      <div className="container mx-auto pt-8 px-4 relative z-10">
        <Image
          src="/src/assets/logos/FunnelAdLogo_Recurso_5.png"
          alt="FunnelAd"
          width={150}
          height={50}
          className="h-10 w-auto"
        />
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Navegación entre pasos */}
          {currentStep > 0 && (
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={handlePrevious}
                className="flex items-center text-white hover:text-[#C9A14A] transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Atrás
              </button>
              
              {currentStep < STEPS.length - 1 && (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center"
                >
                  CONTINUAR
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </button>
              )}
            </div>
          )}
          
          {/* Contenido del paso actual */}
          <AnimatePresence mode="wait">
            <div key={currentStep} className="min-h-[60vh] bg-gray-800/90 py-10 px-6 shadow-2xl rounded-2xl border border-gray-700 backdrop-blur-md">
              {renderStep()}
            </div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;