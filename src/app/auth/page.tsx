"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/presentation/contexts/AuthContext";
import { UserRole, ClientSubRole } from "@/core/types/auth";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
  const [validation] = useState<ValidationState>({
    email: false,
    password: false,
    confirmPassword: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
  });
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
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
            src="/logo.svg"
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
              </div>
            </div>

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
              </div>
            </div>

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
                onClick={() => {
                  if (mode === "login") {
                    router.push("/register"); // Navega a la ruta /register
                    setMode("register");
                  } else {
                    setMode("login");
                  }
                }}
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
