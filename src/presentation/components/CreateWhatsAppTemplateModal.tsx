import { useState, useEffect, useRef } from "react";
import "@/i18n";

// Tipos de categorías de WhatsApp Business API
const TEMPLATE_CATEGORIES = [
  { value: "UTILITY", label: "Utilidad" },
  { value: "MARKETING", label: "Marketing" },
  { value: "AUTHENTICATION", label: "Autenticación" }
];

// Idiomas soportados
const LANGUAGES = [
  { value: "es", label: "Español" },
  { value: "en_US", label: "English (US)" },
  { value: "pt_BR", label: "Português (Brasil)" },
  { value: "en_GB", label: "English (UK)" }
];

// Tipos de encabezado
const HEADER_TYPES = [
  { value: "TEXT", label: "Texto" },
  { value: "IMAGE", label: "Imagen" },
  { value: "VIDEO", label: "Video" },
  { value: "DOCUMENT", label: "Documento" }
];

export interface Parameter {
  id: string;
  name: string;
  example: string;
}

export interface WhatsAppTemplate {
  id?: string;
  name: string;
  category: string;
  language: string;
  headerType?: string;
  headerText?: string;
  headerMedia?: string;
  useMediaInHeader: boolean;
  bodyText: string;
  footerText?: string;
  parameters: Parameter[];
}

interface CreateWhatsAppTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: WhatsAppTemplate) => void;
  template?: WhatsAppTemplate;
  isEditing?: boolean;
}

export default function CreateWhatsAppTemplateModal({
  isOpen,
  onClose,
  onSave,
  template,
  isEditing = false,
}: CreateWhatsAppTemplateModalProps) {
  // const { t } = useTranslation();
  const [form, setForm] = useState<WhatsAppTemplate>({
    name: "",
    category: "UTILITY",
    language: "es",
    headerType: "",
    headerText: "",
    headerMedia: "",
    useMediaInHeader: false,
    bodyText: "",
    footerText: "",
    parameters: [],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (template && isEditing) {
      setForm(template);
    } else {
      // Reset form when opening for creation
      setForm({
        name: "",
        category: "UTILITY",
        language: "es",
        headerType: "",
        headerText: "",
        headerMedia: "",
        useMediaInHeader: false,
        bodyText: "",
        footerText: "",
        parameters: [],
      });
    }
  }, [template, isEditing]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleChange = (field: keyof WhatsAppTemplate, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addParameter = () => {
    const newParam: Parameter = {
      id: Date.now().toString(),
      name: `param_${form.parameters.length + 1}`,
      example: "",
    };
    setForm((prev) => ({
      ...prev,
      parameters: [...prev.parameters, newParam],
    }));
  };

  const updateParameter = (id: string, field: keyof Parameter, value: string) => {
    setForm((prev) => ({
      ...prev,
      parameters: prev.parameters.map((param) =>
        param.id === id ? { ...param, [field]: value } : param
      ),
    }));
  };

  const removeParameter = (id: string) => {
    setForm((prev) => ({
      ...prev,
      parameters: prev.parameters.filter((param) => param.id !== id),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar nombre de plantilla
    if (!form.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    } else if (!/^[a-z0-9_]+$/.test(form.name)) {
      newErrors.name = "Solo se permiten letras minúsculas, números y guiones bajos";
    } else if (form.name.length < 1 || form.name.length > 512) {
      newErrors.name = "El nombre debe tener entre 1 y 512 caracteres";
    }

    // Validar cuerpo del mensaje
    if (!form.bodyText.trim()) {
      newErrors.bodyText = "El cuerpo del mensaje es obligatorio";
    } else if (form.bodyText.length > 1024) {
      newErrors.bodyText = "El cuerpo no puede exceder 1024 caracteres";
    }

    // Validar encabezado si está presente
    if (form.headerType === "TEXT" && form.headerText && form.headerText.length > 60) {
      newErrors.headerText = "El encabezado no puede exceder 60 caracteres";
    }

    // Validar pie de página si está presente
    if (form.footerText && form.footerText.length > 60) {
      newErrors.footerText = "El pie de página no puede exceder 60 caracteres";
    }

    // Validar parámetros
    form.parameters.forEach((param, index) => {
      if (!param.example.trim()) {
        newErrors[`param_${param.id}`] = `El ejemplo del parámetro ${index + 1} es obligatorio`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(form);
      onClose();
    }
  };

  const getPreviewText = () => {
    let preview = "";
    
    // Encabezado
    if (form.headerType === "TEXT" && form.headerText) {
      preview += form.headerText + "\n\n";
    } else if (form.headerType && form.headerType !== "TEXT") {
      preview += `[${form.headerType}]\n\n`;
    }

    // Cuerpo con parámetros reemplazados
    let bodyWithParams = form.bodyText;
    form.parameters.forEach((param, index) => {
      const placeholder = `{{${index + 1}}}`;
      bodyWithParams = bodyWithParams.replace(
        new RegExp(`\\{\\{${param.name}\\}\\}`, 'g'),
        param.example || placeholder
      );
    });
    preview += bodyWithParams;

    // Pie de página
    if (form.footerText) {
      preview += "\n\n" + form.footerText;
    }

    return preview;
  };

  const getCharacterCount = (text: string, max: number) => {
    const count = text.length;
    const isOverLimit = count > max;
    return (
      <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
        {count} de {max}
      </span>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden shadow-2xl flex"
      >
        {/* Lado izquierdo - Formulario */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? "Editar Plantilla" : "Nueva Plantilla de WhatsApp"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form className="space-y-6">
            {/* Información General */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-teal-600 mb-4 border-b border-gray-200 pb-2">
                Información
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Identificador de plantilla"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    Solo letras minúsculas, números y guiones bajos
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoría
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    >
                      {TEMPLATE_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Idioma
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      value={form.language}
                      onChange={(e) => handleChange("language", e.target.value)}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Parámetros */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-teal-600 border-b border-gray-200 pb-2">
                  Parámetros (Opcional)
                </h3>
                <button
                  type="button"
                  onClick={addParameter}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  <span className="text-lg">+</span>
                </button>
              </div>

              {form.parameters.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                    <div className="col-span-1"></div>
                    <div className="col-span-5">Parámetro</div>
                    <div className="col-span-5">Ejemplo</div>
                    <div className="col-span-1"></div>
                  </div>
                  
                  {form.parameters.map((param) => (
                    <div key={param.id} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-1 flex items-center gap-2">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => removeParameter(param.id)}
                          className="text-red-400 hover:text-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                      
                      <div className="col-span-5">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-gray-800 text-white"
                          value={param.name}
                          onChange={(e) => updateParameter(param.id, "name", e.target.value)}
                        />
                      </div>
                      
                      <div className="col-span-5">
                        <input
                          type="text"
                          className={`w-full px-2 py-1 border rounded text-sm bg-gray-800 text-white ${
                            errors[`param_${param.id}`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                          value={param.example}
                          onChange={(e) => updateParameter(param.id, "example", e.target.value)}
                        />
                        {errors[`param_${param.id}`] && (
                          <p className="text-red-500 text-xs mt-1">{errors[`param_${param.id}`]}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Encabezado */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-teal-600 mb-4 border-b border-gray-200 pb-2">
                Encabezado <span className="text-sm font-normal text-gray-500">Opcional</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agrega un título que usarás para este encabezado.
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={form.headerType}
                    onChange={(e) => handleChange("headerType", e.target.value)}
                  >
                    <option value="">Seleccionar tipo</option>
                    {HEADER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {form.headerType === "TEXT" && (
                  <div>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                        errors.headerText ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Texto del encabezado"
                      value={form.headerText}
                      onChange={(e) => handleChange("headerText", e.target.value)}
                      maxLength={60}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.headerText && <p className="text-red-500 text-sm">{errors.headerText}</p>}
                      {getCharacterCount(form.headerText || "", 60)}
                    </div>
                  </div>
                )}

                {form.headerType && form.headerType !== "TEXT" && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        Ejemplos de contenido del encabezado
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Para ayudar a Meta en revisar tu contenido, proporciona ejemplos del contenido multimedia en el encabezado.
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{form.headerType}:</span>
                        <span className="bg-gray-100 px-2 py-1 rounded">Cartoon_Style_Robot.jpg</span>
                        <button className="text-red-500 hover:text-red-700">❌</button>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="useMediaInHeader"
                        checked={form.useMediaInHeader}
                        onChange={(e) => handleChange("useMediaInHeader", e.target.checked)}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                      <label htmlFor="useMediaInHeader" className="text-sm text-teal-600">
                        Usar siempre este archivo Media en el encabezado de la plantilla cuando se envía.
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Cuerpo */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-teal-600 mb-4 border-b border-gray-200 pb-2">
                Cuerpo
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ingresa el texto del mensaje
                </label>
                <textarea
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.bodyText ? 'border-red-500' : 'border-gray-300'
                  }`}
                  rows={4}
                  placeholder="Hola Señor Carlos identificado con el número: {{assistant_phone}}"
                  value={form.bodyText}
                  onChange={(e) => handleChange("bodyText", e.target.value)}
                  maxLength={1024}
                />
                <div className="flex justify-between mt-1">
                  {errors.bodyText && <p className="text-red-500 text-sm">{errors.bodyText}</p>}
                  {getCharacterCount(form.bodyText, 1024)}
                </div>
                
                <button
                  type="button"
                  className="mt-2 text-teal-600 hover:text-teal-700 text-sm flex items-center gap-1"
                >
                  📋 Parámetros
                </button>
              </div>
            </div>

            {/* Pie de página */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-teal-600 mb-4 border-b border-gray-200 pb-2">
                Pie de página <span className="text-sm font-normal text-gray-500">Opcional</span>
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agrega una breve línea de texto en la parte inferior de la plantilla de mensaje.
                </label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.footerText ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="swswdwdwdw"
                  value={form.footerText}
                  onChange={(e) => handleChange("footerText", e.target.value)}
                  maxLength={60}
                />
                <div className="flex justify-between mt-1">
                  {errors.footerText && <p className="text-red-500 text-sm">{errors.footerText}</p>}
                  {getCharacterCount(form.footerText || "", 60)}
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-start gap-3 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2"
              >
                🔒 Guardar
              </button>
            </div>
          </form>
        </div>

        {/* Lado derecho - Vista previa */}
        <div className="w-96 bg-gray-800 p-6 overflow-y-auto">
          <h3 className="text-teal-400 text-lg font-semibold mb-4">
            Vista previa del mensaje
          </h3>
          
          <div className="bg-gray-700 rounded-lg p-4 relative">
            {/* Simular interfaz de WhatsApp */}
            <div className="bg-gray-600 rounded-lg p-3 relative">
              <div className="text-green-400 text-sm mb-2">
                Hola Señor Carlos identificado con el número: 3332801539
              </div>
              <div className="text-green-400 text-xs">
                swswdwdwdw
              </div>
              
              {/* Iconos de estado */}
              <div className="absolute bottom-1 right-2 flex items-center gap-1">
                <span className="text-gray-400 text-xs">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            {/* Preview text con formato */}
            <div className="mt-4 p-3 bg-gray-900 rounded text-white text-sm whitespace-pre-wrap">
              {getPreviewText() || "Vista previa aparecerá aquí..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}