'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/presentation/contexts/AuthContext';
import { UserRole, ClientSubRole } from '@/core/types/auth';

type AuthMode = 'login' | 'register';

interface ValidationState {
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
  hasUpperCase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  hasMinLength: boolean;
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    phoneNumber: '',
    countryCode: '+1',
    acceptTerms: false,
    role: UserRole.CLIENT,
    clientSubRole: ClientSubRole.ADMIN,
  });
  const [error, setError] = useState<string | null>(null);
  const [validation, setValidation] = useState<ValidationState>({
    email: false,
    password: false,
    confirmPassword: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });
  const { login, register } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    return {
      hasUpperCase,
      hasNumber,
      hasSpecialChar,
      hasMinLength,
    };
  };

  useEffect(() => {
    if (mode === 'register') {
      const emailValid = validateEmail(formData.email);
      const passwordValidation = validatePassword(formData.password);
      const passwordsMatch = formData.password === formData.confirmPassword;

      setValidation({
        email: emailValid,
        password: Object.values(passwordValidation).every(Boolean),
        confirmPassword: passwordsMatch,
        ...passwordValidation,
      });
    }
  }, [formData, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (mode === 'register' && !validation.password) {
      setError('La contraseña no cumple con los requisitos mínimos');
      return;
    }

    if (mode === 'register' && !validation.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          storeName: formData.storeName,
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
          role: formData.role,
          clientSubRole: formData.role === UserRole.CLIENT ? formData.clientSubRole : undefined,
        });
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError('Error de autenticación. Por favor, verifica tus credenciales.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getInputClassName = (isValid: boolean) => {
    return `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      isValid 
        ? 'border-green-300 focus:ring-green-500 focus:border-green-500' 
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Image
          className="mx-auto h-12 w-auto"
          src="/logo.svg"
          alt="FunnelAd"
          width={48}
          height={48}
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea una nueva cuenta'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          {error && (
            <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Tipo de cuenta
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value={UserRole.CLIENT}>Cliente</option>
                    <option value={UserRole.FUNNELAD}>FunnelAd</option>
                  </select>
                </div>

                {formData.role === UserRole.CLIENT && (
                  <div>
                    <label htmlFor="clientSubRole" className="block text-sm font-medium text-gray-700">
                      Rol de cliente
                    </label>
                    <select
                      id="clientSubRole"
                      name="clientSubRole"
                      value={formData.clientSubRole}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value={ClientSubRole.ADMIN}>Administrador</option>
                      <option value={ClientSubRole.AUXILIARY}>Auxiliar</option>
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                    Nombre de la tienda/empresa
                  </label>
                  <div className="mt-1">
                    <input
                      id="storeName"
                      name="storeName"
                      type="text"
                      required
                      value={formData.storeName}
                      onChange={handleChange}
                      className={getInputClassName(true)}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClassName(mode === 'login' || validation.email)}
                />
                {mode === 'register' && formData.email && !validation.email && (
                  <p className="mt-1 text-sm text-red-600">Ingresa un correo electrónico válido</p>
                )}
              </div>
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="countryCode" className="block text-sm font-medium text-gray-700">
                    Código de país
                  </label>
                  <select
                    id="countryCode"
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="+1">+1 (USA)</option>
                    <option value="+52">+52 (México)</option>
                    <option value="+34">+34 (España)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                    Número de teléfono
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={getInputClassName(true)}
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={getInputClassName(mode === 'login' || validation.password)}
                />
                {mode === 'register' && (
                  <div className="mt-2 space-y-1">
                    <p className={`text-sm ${validation.hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      • Mínimo 8 caracteres
                    </p>
                    <p className={`text-sm ${validation.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      • Al menos una letra mayúscula
                    </p>
                    <p className={`text-sm ${validation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      • Al menos un número
                    </p>
                    <p className={`text-sm ${validation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                      • Al menos un carácter especial
                    </p>
                  </div>
                )}
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar contraseña
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={getInputClassName(validation.confirmPassword)}
                    />
                    {formData.confirmPassword && !validation.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                    Acepto los{' '}
                    <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                      términos y condiciones
                    </Link>
                  </label>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {mode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {mode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                {mode === 'login' ? 'Registrarse' : 'Iniciar sesión'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 