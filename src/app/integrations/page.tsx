"use client";

import { useModal } from "@/core/hooks/useModal";
import { useState, FC, ChangeEvent, Fragment, useEffect } from "react";
import { initFacebookSdk } from "@/core/utils/facebookSDK";
import { Integration, IntegrationType, CreateIntegrationData } from "@/core/types/integration";
import { FaWhatsapp, FaInstagram, FaGlobe, FaFacebookMessenger, FaEnvelope, FaPhone, FaTelegram } from 'react-icons/fa';
import { integrationService } from "@/core/services/integrationService";
import { telegramServices } from "@/core/services/telegramServices";
import { Toaster, toast } from "sonner";

const TypeBadge: FC<{ type: IntegrationType }> = ({ type }) => {
  const typeClasses = {
    WABA: "bg-blue-100 text-blue-800",
    Telegram: "bg-cyan-100 text-cyan-800",
    Email: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center space-x-1 ${typeClasses[type]}`}
    >
      {type === "WABA" && <FaWhatsapp className="h-4 w-4" />}
      {type === "Telegram" && <FaTelegram className="h-4 w-4" />}
      {type === "Email" && <FaEnvelope className="h-4 w-4" />}
      <span>{type}</span>
    </span>
  );
};

const StatusBadge: FC<{ status: Integration["status"] }> = ({ status }) => {
  const statusClasses = {
    Active: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
    Error: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center space-x-1 ${statusClasses[status]}`}
    >
      <span>{status}</span>
    </span>
  );
};


// Componente Toggle Switch
const ToggleSwitch: FC<{ enabled: boolean; onChange: (enabled: boolean) => void; label: string }> = ({
  enabled,
  onChange,
  label
}) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        className={`${enabled ? 'bg-blue-600' : 'bg-gray-200'
          } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={`${enabled ? 'translate-x-5' : 'translate-x-0'
            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

// Modal modificado con toggle de autenticación
function AddIntegrationModal({ onIntegrationCreated }: { onIntegrationCreated: (integration: Integration) => void }) {
  const { hideModal } = useModal();
  const [formData, setFormData] = useState({
    name: "",
    provider: "WABA" as IntegrationType,
    description: "",
    config: {} as any,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [useFacebookLogin, setUseFacebookLogin] = useState(false); // Nuevo estado para el toggle

  const updateConfig = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      config: {
        ...prev.config,
        [field]: value
      }
    }));
  };

  const handleProviderChange = (newProvider: IntegrationType) => {
    setFormData(prev => ({
      ...prev,
      provider: newProvider,
      config: {}
    }));
    // Resetear el toggle cuando cambie el proveedor
    setUseFacebookLogin(false);
  };

  // const handleFacebookLogin = () => {
  //   if (!window.FB) {
  //     toast.error("Facebook SDK not loaded");
  //     return;
  //   }

  //   window.FB.login((response: any) => {
  //     if (response.authResponse) {
  //       console.log("Facebook login successful!", response);

  //       // Obtener información adicional del usuario/página
  //       window.FB.api('/me', { fields: 'id,name,email' }, (userInfo: any) => {
  //         console.log("User info:", userInfo);

  //         // Auto-llenar los campos con la información de Facebook
  //         setFormData(prev => ({
  //           ...prev,
  //           config: {
  //             ...prev.config,
  //             appID: userInfo.id,
  //             accessToken: response.authResponse.accessToken,
  //             // Puedes agregar más campos según lo que devuelva la API
  //           }
  //         }));

  //         toast.success("Facebook authentication successful");
  //       });
  //     } else {
  //       console.log("User cancelled login or didn't authorize the app.");
  //       toast.error("Facebook authentication cancelled");
  //     }
  //   }, {
  //     scope: 'pages_manage_metadata,pages_read_engagement,pages_messaging',
  //     return_scopes: true
  //   });
  // };


  const handleFacebookLogin = () => {
    if (!window.FB) {
      toast.error("Facebook SDK not loaded");
      return;
    }


    // Response callback
    const fbLoginCallback = (response: any) => {
      if (response.authResponse) {
        const code = response.authResponse.code;
        // Auto-llenar los campos con la información de Facebook
        setFormData(prev => ({
          ...prev,
          config: {
            ...prev.config,
            appID: code,
            accessToken: response.authResponse.accessToken,
            // Puedes agregar más campos según lo que devuelva la API
          }
        }));

        toast.success("Facebook authentication successful");


        // your code goes here
      } else {
        console.log('response: ', response); // remove after testing
        // your code goes here
        console.log("User cancelled login or didn't authorize the app.");
        toast.error("Facebook authentication cancelled");
      }
    }


    window.FB.login(fbLoginCallback, {
      config_id: '<CONFIGURATION_ID>', // your configuration ID goes here
      response_type: 'code',
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: '<FEATURE_TYPE>',
        sessionInfoVersion: '3',
      }
    });



    // window.FB.login((response: any) => {
    //   if (response.authResponse) {
    //     console.log("Facebook login successful!", response);

    //     // Obtener información adicional del usuario/página
    //     window.FB.api('/me', { fields: 'id,name,email' }, (userInfo: any) => {
    //       console.log("User info:", userInfo);

    //       // Auto-llenar los campos con la información de Facebook
    //       setFormData(prev => ({
    //         ...prev,
    //         config: {
    //           ...prev.config,
    //           appID: userInfo.id,
    //           accessToken: response.authResponse.accessToken,
    //           // Puedes agregar más campos según lo que devuelva la API
    //         }
    //       }));

    //       toast.success("Facebook authentication successful");
    //     });
    //   } else {
    //     console.log("User cancelled login or didn't authorize the app.");
    //     toast.error("Facebook authentication cancelled");
    //   }
    // }, {
    //   scope: 'pages_manage_metadata,pages_read_engagement,pages_messaging',
    //   return_scopes: true
    // });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar que todos los campos requeridos estén completos
      if (!formData.name.trim()) {
        toast.error("Name is required");
        return;
      }

      // Validar configuración según el proveedor y método de autenticación
      const isConfigValid = validateConfig(formData.provider, formData.config, useFacebookLogin);
      if (!isConfigValid) {
        toast.error("Please complete all required configuration fields.");
        return;
      }

      const toastId = toast.loading("Creating integration...");

      const newIntegration: CreateIntegrationData = {
        ...formData,
        status: "Active",
        lastSync: new Date().toISOString(),
        stats: {
          totalRequests: 0,
          successRate: 100,
        },
      };

      const result = await integrationService.create(newIntegration);

      if (result._id && result._id !== "") {
        // Manejar conexiones específicas por proveedor
        if (result.provider === "Telegram") {
          const resultConnect = await telegramServices.connectTelegramWebhook(result.config.botToken || "");
          if (resultConnect.ok !== true) {
            toast.error("Integration created but failed to connect webhook", { id: toastId });
            onIntegrationCreated(result);
            hideModal();
            return;
          }
        }

        toast.success("Integration created successfully", { id: toastId });
        onIntegrationCreated(result);
        hideModal();
      } else {
        toast.error("Error creating integration", { id: toastId });
      }
    } catch (error) {
      console.error("Error creating integration:", error);
      toast.error("Error creating integration");
    } finally {
      setIsLoading(false);
    }
  };

  const validateConfig = (provider: IntegrationType, config: any, useFacebookAuth: boolean): boolean => {
    switch (provider) {
      case "WABA":
        if (useFacebookAuth) {
          // Si usa Facebook login, solo necesita que los campos estén llenos (se llenan automáticamente)
          return config.appID && config.accessToken;
        } else {
          // Si usa login manual, todos los campos son requeridos
          return config.appID && config.accessToken && config.appSecret && config.metaIDBusiness;
        }
      case "Telegram":
        return config.botToken;
      case "Email":
        return config.smtpServer && config.email;
      default:
        return true;
    }
  };

  const renderConfigFields = () => {
    switch (formData.provider) {
      case "WABA":
        return (
          <>
            {/* Toggle para elegir método de autenticación */}
            <div className="border-b pb-4 mb-4">
              <ToggleSwitch
                enabled={useFacebookLogin}
                onChange={setUseFacebookLogin}
                label="Use Facebook Login"
              />
              <p className="text-xs text-gray-500 mt-2">
                {useFacebookLogin
                  ? "Authenticate with Facebook to automatically fill the required fields"
                  : "Manually enter your Facebook app credentials"}
              </p>
            </div>

            {useFacebookLogin ? (
              // Método de Facebook Login
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FaFacebookMessenger className="h-6 w-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Facebook Authentication
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Click the button below to authenticate with Facebook and automatically configure your WABA integration.
                      </p>
                      <button
                        type="button"
                        onClick={handleFacebookLogin}
                        disabled={isLoading}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaFacebookMessenger className="h-4 w-4 mr-2" />
                        Sign in with Facebook
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mostrar campos auto-llenados (solo lectura) */}
                {formData.config.appID && (
                  <div className="space-y-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-green-900 mb-2">
                      ✅ Authentication successful
                    </h5>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        App ID (Auto-filled)
                      </label>
                      <input
                        type="text"
                        value={formData.config.appID || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Access Token (Auto-filled)
                      </label>
                      <input
                        type="password"
                        value={formData.config.accessToken || ""}
                        readOnly
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Método manual
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Manual Configuration:</strong> You'll need to provide all the required Facebook app credentials manually.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App ID *
                  </label>
                  <input
                    type="text"
                    value={formData.config.appID || ""}
                    onChange={(e) => updateConfig("appID", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business ID *
                  </label>
                  <input
                    type="text"
                    value={formData.config.metaIDBusiness || ""}
                    onChange={(e) => updateConfig("metaIDBusiness", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123456789"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    App Secret *
                  </label>
                  <input
                    type="password"
                    value={formData.config.appSecret || ""}
                    onChange={(e) => updateConfig("appSecret", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your-app-secret"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Token *
                  </label>
                  <input
                    type="password"
                    value={formData.config.accessToken || ""}
                    onChange={(e) => updateConfig("accessToken", e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="EAABwz..."
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}
          </>
        );
      case "Telegram":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot Token *
              </label>
              <input
                type="password"
                value={formData.config.botToken || ""}
                onChange={(e) => updateConfig("botToken", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1234567890:AAG..."
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bot URL
              </label>
              <input
                type="text"
                value={formData.config.urlBotTelegram || ""}
                onChange={(e) => updateConfig("urlBotTelegram", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="t.me/botName"
                disabled={isLoading}
              />
            </div>
          </>
        );
      case "Email":
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Server *
              </label>
              <input
                type="text"
                value={formData.config.smtpServer || ""}
                onChange={(e) => updateConfig("smtpServer", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="smtp.gmail.com"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                value={formData.config.email || ""}
                onChange={(e) => updateConfig("email", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="notifications@company.com"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SMTP Port
              </label>
              <input
                type="number"
                value={formData.config.smtpPort || ""}
                onChange={(e) => updateConfig("smtpPort", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="587"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.config.password || ""}
                onChange={(e) => updateConfig("password", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="********"
                disabled={isLoading}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Create New Integration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="My integration"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            value={formData.provider}
            onChange={(e) => handleProviderChange(e.target.value as IntegrationType)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="WABA">WABA (Facebook)</option>
            <option value="Telegram">Telegram</option>
            <option value="Email">Email</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Describe this integration..."
            disabled={isLoading}
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Configuration - {formData.provider}
          </h3>
          <div className="space-y-3">
            {renderConfigFields()}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            * Required fields
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={hideModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Integration"}
          </button>
        </div>
      </form>

      {/* Debug: Mostrar el estado actual del formData */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
        <details>
          <summary className="cursor-pointer text-gray-600">Debug: View form data</summary>
          <pre className="mt-2 text-gray-800 whitespace-pre-wrap">
            {JSON.stringify({ ...formData, useFacebookLogin }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}


function EditIntegrationModal({
  integration,
  onIntegrationUpdated
}: {
  integration: Integration,
  onIntegrationUpdated: (integration: Integration) => void
}) {
  const { hideModal } = useModal();
  const [formData, setFormData] = useState({
    name: integration.name,
    description: integration.description,
    status: integration.status,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const toastId = toast.loading("Updating integration...");

      // Simular llamada al servicio de actualización
      // const result = await integrationService.update(integration._id, formData);

      // Por ahora simulo una respuesta exitosa
      const updatedIntegration: Integration = {
        ...integration,
        ...formData,
        lastSync: new Date().toISOString(), // Actualizar fecha de sincronización
      };

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Integration updated successfully", { id: toastId });
      onIntegrationUpdated(updatedIntegration);
      hideModal();
    } catch (error) {
      console.error("Error updating integration:", error);
      toast.error("Error updating integration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-lg">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Edit Integration: {integration.name}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Integration["status"] })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={isLoading}
          >
            <option value="Active">Activo</option>
            <option value="Inactive">Inactivo</option>
            <option value="Error">Error</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={hideModal}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DeleteConfirmModal({
  integration,
  onIntegrationDeleted
}: {
  integration: Integration,
  onIntegrationDeleted: (integrationId: string) => void
}) {
  const { hideModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      const toastId = toast.loading("Deleting integration...");

      // Simular llamada al servicio de eliminación
      // const result = await integrationService.delete(integration._id);

      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Integration deleted successfully", { id: toastId });
      onIntegrationDeleted(integration._id);
      hideModal();
    } catch (error) {
      console.error("Error deleting integration:", error);
      toast.error("Error deleting integration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-2 text-center">
        Remove Integration
      </h2>
      <p className="text-sm text-gray-600 mb-6 text-center">
        ¿Are you sure you want to delete the "{integration.name}" integration? This action cannot be undone.
      </p>
      <div className="flex justify-center space-x-3">
        <button
          onClick={hideModal}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

// --- Componente Principal ---
export default function IntegrationsManager() {
  const { showModal } = useModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [filterType, setFilterType] = useState<IntegrationType | "All">("All");
  const [filterStatus, setFilterStatus] = useState<Integration["status"] | "All">("All");
  const [fb, setFb] = useState(null);

  useEffect(() => {
    initFacebookSdk()
      .then((FB) => {
        console.log("FB SDK listo", FB);
        FB.getLoginStatus((res: any) => console.log("Estado login:", res));
      })
      .catch(console.error);
    loadInitData();
  }, []);

  async function loadInitData() {
    try {
      const data = await integrationService.getAllIntegrations();
      setIntegrations(data);
      console.log(data);
    } catch (error) {
      console.error("Error loading integrations:", error);
      toast.error("Error loading integrations");
    }
  }

  // Handlers para actualizar el estado local
  const handleIntegrationCreated = (newIntegration: Integration) => {
    setIntegrations(prev => [newIntegration, ...prev]);
    toast.success("Integration added to table");
  };

  const handleIntegrationUpdated = (updatedIntegration: Integration) => {
    setIntegrations(prev =>
      prev.map(integration =>
        integration._id === updatedIntegration._id ? updatedIntegration : integration
      )
    );
    toast.success("Integration updated in table");
  };

  const handleIntegrationDeleted = (integrationId: string) => {
    setIntegrations(prev => prev.filter(integration => integration._id !== integrationId));
    setSelectedIntegrations(prev => prev.filter(id => id !== integrationId));
    setExpandedRows(prev => prev.filter(id => id !== integrationId));
    toast.success("Integration removed from table");
  };

  const handleToggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIntegrations(filteredIntegrations.map((integration) => integration._id));
    } else {
      setSelectedIntegrations([]);
    }
  };

  const handleSelectOne = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    if (e.target.checked) {
      setSelectedIntegrations((prev) => [...prev, id]);
    } else {
      setSelectedIntegrations((prev) => prev.filter((integrationId) => integrationId !== id));
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  // Filtrar integraciones
  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "All" || integration.provider === filterType;
    const matchesStatus = filterStatus === "All" || integration.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 bg-50 min-h-screen">
      <Toaster richColors position="top-right" />

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Integration Management
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage integrations with WABA, Telegram, and Email
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Total: {filteredIntegrations.length} integrations
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 flex flex-col lg:flex-row justify-between items-center gap-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2 w-full lg:w-auto">
              <div className="relative w-full lg:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Buscar integración..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as IntegrationType | "All")}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">All types</option>
                <option value="WABA">WABA</option>
                <option value="Telegram">Telegram</option>
                <option value="Email">Email</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as Integration["status"] | "All")}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="All">All states</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Error">Error</option>
              </select>
            </div>

            <button
              className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full lg:w-auto justify-center text-sm font-medium"
              onClick={() => showModal(
                <AddIntegrationModal onIntegrationCreated={handleIntegrationCreated} />
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>New Integration</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      onChange={handleSelectAll}
                      checked={
                        selectedIntegrations.length === filteredIntegrations.length &&
                        filteredIntegrations.length > 0
                      }
                    />
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Integration
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Last Sync
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Success Rate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Expand</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredIntegrations.map((integration) => (
                  <Fragment key={integration._id}>
                    <tr
                      className={
                        selectedIntegrations.includes(integration._id) ? "bg-blue-50" : ""
                      }
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={selectedIntegrations.includes(integration._id)}
                          onChange={(e) => handleSelectOne(e, integration._id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {integration.name}
                          </div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">
                            {integration.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TypeBadge type={integration.provider} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={integration.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(integration.lastSync)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${integration.stats.successRate >= 95 ? 'text-green-600' :
                            integration.stats.successRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                            {integration.stats.successRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <button
                            onClick={() =>
                              showModal(
                                <EditIntegrationModal
                                  integration={integration}
                                  onIntegrationUpdated={handleIntegrationUpdated}
                                />
                              )
                            }
                            className="text-gray-400 hover:text-indigo-600"
                            title="Editar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                              <path
                                fillRule="evenodd"
                                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => showModal(
                              <DeleteConfirmModal
                                integration={integration}
                                onIntegrationDeleted={handleIntegrationDeleted}
                              />
                            )}
                            className="text-gray-400 hover:text-red-600"
                            title="Eliminar"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                          <button
                            className="text-gray-400 hover:text-green-600"
                            title="Probar conexión"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleToggleRow(integration._id)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <svg
                            className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ease-out ${expandedRows.includes(integration._id) ? "rotate-180" : ""
                              }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    {/* --- Fila de Detalles Expandible --- */}
                    <tr>
                      <td
                        colSpan={8}
                        className="p-0"
                        style={{ transition: "padding 0.3s ease-out" }}
                      >
                        <div
                          className={`grid transition-all duration-300 ease-out ${expandedRows.includes(integration._id)
                            ? "grid-rows-[1fr]"
                            : "grid-rows-[0fr]"
                            }`}
                        >
                          <div className="overflow-hidden">
                            <div className="p-6 bg-slate-50 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Estadísticas */}
                                <div className="bg-white p-4 rounded-lg border">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    📊 Estadísticas
                                  </h4>
                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Total applications:</span>
                                      <span className="font-medium">{integration.stats.totalRequests.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Success rate:</span>
                                      <span className={`font-medium ${integration.stats.successRate >= 95 ? 'text-green-600' :
                                        integration.stats.successRate >= 85 ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {integration.stats.successRate}%
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                      <span className="text-gray-600">Created:</span>
                                      <span className="font-medium">{formatDate(integration.createdAt)}</span>
                                    </div>
                                    {integration.stats.lastError && (
                                      <div className="mt-2 p-2 bg-red-50 rounded">
                                        <span className="text-xs text-red-600">
                                          ⚠️ {integration.stats.lastError}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Configuración */}
                                <div className="bg-white p-4 rounded-lg border">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    ⚙️ Configuration
                                  </h4>
                                  <div className="space-y-2">
                                    {integration.provider === "WABA" && (
                                      <>
                                        <div className="text-sm">
                                          <span className="text-gray-600">Page ID:</span>
                                          <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {integration.config.appID}
                                          </span>
                                        </div>
                                        <div className="text-sm">
                                          <span className="text-gray-600">Access Token:</span>
                                          <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {integration.config.accessToken?.substring(0, 10)}***
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {integration.provider === "Telegram" && (
                                      <>
                                        <div className="text-sm">
                                          <span className="text-gray-600">Bot Token:</span>
                                          <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {integration.config.botToken?.substring(0, 15)}***
                                          </span>
                                        </div>
                                        <div className="text-sm">
                                          <span className="text-gray-600">Url:</span>
                                          <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {integration.config.urlBotTelegram}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                    {integration.provider === "Email" && (
                                      <>
                                        <div className="text-sm">
                                          <span className="text-gray-600">SMTP Server:</span>
                                          <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {integration.config.smtpServer}
                                          </span>
                                        </div>
                                        <div className="text-sm">
                                          <span className="text-gray-600">Email:</span>
                                          <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                            {integration.config.email}
                                          </span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Acciones rápidas */}
                                <div className="bg-white p-4 rounded-lg border">
                                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                    🚀 Quick Actions
                                  </h4>
                                  <div className="space-y-2">
                                    <button className="w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors">
                                      🔄 Synchronize now
                                    </button>
                                    <button className="w-full text-left text-sm text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded transition-colors">
                                      🧪 Test connection
                                    </button>
                                    <button className="w-full text-left text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-2 rounded transition-colors">
                                      📋 View logs
                                    </button>
                                    <button className="w-full text-left text-sm text-orange-600 hover:text-orange-800 hover:bg-orange-50 p-2 rounded transition-colors">
                                      📊 View metrics
                                    </button>
                                    {integration.status === "Inactive" && (
                                      <button className="w-full text-left text-sm text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded transition-colors">
                                        ▶️ Enable integration
                                      </button>
                                    )}
                                    {integration.status === "Active" && (
                                      <button className="w-full text-left text-sm text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 p-2 rounded transition-colors">
                                        ⏸️ Pause integration
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mensaje cuando no hay resultados */}
          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No integrations found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterType !== "All" || filterStatus !== "All"
                  ? "Try adjusting the search filters."
                  : "Start by creating your first integration."}
              </p>
              {(!searchTerm && filterType === "All" && filterStatus === "All") && (
                <div className="mt-6">
                  <button
                    onClick={() => showModal(
                      <AddIntegrationModal onIntegrationCreated={handleIntegrationCreated} />
                    )}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    New Integration
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Acciones en lote */}
        {selectedIntegrations.length > 0 && (
          <div className="mt-4 bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">
                {selectedIntegrations.length} integración(es) seleccionada(s)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  // Implementar activación en lote
                  toast.info("Bulk activation not implemented yet");
                }}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Activar
              </button>
              <button
                onClick={() => {
                  // Implementar pausa en lote
                  toast.info("Bulk pause not implemented yet");
                }}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Pausar
              </button>
              <button
                onClick={() => {
                  // Implementar eliminación en lote
                  if (confirm(`¿Estás seguro de que quieres eliminar ${selectedIntegrations.length} integración(es)?`)) {
                    selectedIntegrations.forEach(id => handleIntegrationDeleted(id));
                    toast.success(`${selectedIntegrations.length} integrations deleted`);
                  }
                }}
                className="px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}