"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/core/contexts/AuthContext";
import { UserRole, ClientSubRole } from "@/core/types/auth";
import { useRouter } from "next/navigation";
import { authService } from "@/core/services/authService";

type AuthMode = "login" | "register";

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
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    storeName: "",
    phoneNumber: "",
    countryCode: "+1",
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
    if (mode === "register") {
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

    if (mode === "register" && !validation.password) {
      setError("La contraseña no cumple con los requisitos mínimos");
      return;
    }

    if (mode === "register" && !validation.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          storeName: formData.storeName,
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
          role: formData.role,
          clientSubRole:
            formData.role === UserRole.CLIENT
              ? formData.clientSubRole
              : undefined,
        });
      }
    } catch (error) {
      console.error("Error de autenticación:", error);
      setError("Error de autenticación. Por favor, verifica tus credenciales.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Color dorado de FunnelAd
  const funneladGold = "#FFD700";

  // Custom select style for dark mode
  const selectClassName =
    "mt-1 block w-full pl-3 pr-10 py-2 text-base rounded-md border border-gray-600 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 sm:text-sm transition-colors duration-200 appearance-none";

  // Custom arrow for select
  const customSelectWrapper = "relative";
  const customSelectArrow =
    "pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-yellow-400";

  const getInputClassName = (isValid: boolean) => {
    return `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-900 text-white ${
      isValid
        ? "border-green-300 focus:ring-green-500 focus:border-green-500"
        : "border-gray-600 focus:ring-blue-500 focus:border-blue-500"
    }`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
      {/* Fondo decorativo moderno */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-tr from-yellow-400/30 via-yellow-200/10 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-blue-200/10 to-transparent rounded-full blur-2xl animate-pulse" />
      </div>
      <div className="relative z-10 w-full max-w-md mx-auto">
        <div className="flex flex-col items-center">
          <Image
            className="mx-auto h-16 w-auto drop-shadow-lg"
            src="/images/FunnelAdLogo_Recurso_1.png"
            alt="FunnelAd"
            width={64}
            height={64}
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white drop-shadow-md">
            {mode === "login"
              ? "Inicia sesión en tu cuenta"
              : "Crea una nueva cuenta"}
          </h2>
        </div>
        <div className="mt-8 bg-gray-800/90 py-10 px-6 shadow-2xl rounded-2xl border border-gray-700 backdrop-blur-md max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {error && (
            <div className="mb-4 p-4 bg-red-400/10 text-red-300 rounded-md border border-red-400/30 text-center">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {mode === "register" && (
              <>
                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Tipo de cuenta
                  </label>
                  <div className={customSelectWrapper}>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value={UserRole.CLIENT}>Cliente</option>
                      <option value={UserRole.FUNNELAD}>FunnelAd</option>
                    </select>
                    <span className={customSelectArrow}>
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {formData.role === UserRole.CLIENT && (
                  <div className={customSelectWrapper}>
                    <select
                      id="clientSubRole"
                      name="clientSubRole"
                      value={formData.clientSubRole}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value={ClientSubRole.ADMIN}>Administrador</option>
                      <option value={ClientSubRole.AUXILIARY}>Auxiliar</option>
                    </select>
                    <span className={customSelectArrow}>
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="storeName"
                    className="block text-sm font-medium text-gray-700"
                  >
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
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
                  className={getInputClassName(
                    mode === "login" || validation.email
                  )}
                />
                {mode === "register" && formData.email && !validation.email && (
                  <p className="mt-1 text-sm text-red-600">
                    Ingresa un correo electrónico válido
                  </p>
                )}
              </div>
            </div>

            {mode === "register" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="countryCode"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Código de país
                  </label>
                  <div className={customSelectWrapper}>
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value="+1">+1 (USA)</option>
                      <option value="+52">+52 (México)</option>
                      <option value="+34">+34 (España)</option>
                    </select>
                    <span className={customSelectArrow}>
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M7 10l5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-sm font-medium text-gray-700"
                  >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
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
                  className={getInputClassName(
                    mode === "login" || validation.password
                  )}
                />
                {mode === "register" && (
                  <div className="mt-2 space-y-1">
                    <p
                      className={`text-sm ${
                        validation.hasMinLength
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      • Mínimo 8 caracteres
                    </p>
                    <p
                      className={`text-sm ${
                        validation.hasUpperCase
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      • Al menos una letra mayúscula
                    </p>
                    <p
                      className={`text-sm ${
                        validation.hasNumber
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      • Al menos un número
                    </p>
                    <p
                      className={`text-sm ${
                        validation.hasSpecialChar
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      • Al menos un carácter especial
                    </p>
                  </div>
                )}
              </div>
            </div>

            {mode === "register" && (
              <>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                    {formData.confirmPassword &&
                      !validation.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          Las contraseñas no coinciden
                        </p>
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
                  <label
                    htmlFor="acceptTerms"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Acepto los{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-500"
                    >
                      términos y condiciones
                    </Link>
                  </label>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white"
                style={{
                  backgroundColor: funneladGold,
                  color: "#222",
                  fontWeight: 600,
                }}
              >
                {mode === "login" ? "Iniciar sesión" : "Registrarse"}
              </button>
            </div>
          </form>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  {mode === "login"
                    ? "¿No tienes una cuenta?"
                    : "¿Ya tienes una cuenta?"}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="w-full flex justify-center py-2 px-4 border border-yellow-400/60 rounded-md shadow-sm text-sm font-semibold bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                style={{ color: funneladGold }}
              >
                {mode === "login" ? "Registrarse" : "Iniciar sesión"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
