import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import "@/i18n";
import type { Trigger, CreateTriggerData } from "@/core/types/trigger";

// // Simulación de plantillas de bienvenida
// const trigger_types = [
//   { id: "1", name: "Logica", content: "¡" },
//   { id: "2", name: "Webhook", content: "" },
// ];

interface CreateTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: CreateTriggerData) => void;
  trigger?: Trigger;
  isEditing?: boolean;
}

export default function CreateTriggerModal({
  isOpen,
  onClose,
  onSave,
  trigger,
  isEditing = false,
}: CreateTriggerModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<CreateTriggerData>({
    name: "",
    description: "",
    model:"",
    storeId: "",
    isActive: true,
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (trigger && isEditing) {
      setForm({
        name: trigger.name,
        description: "",
        model: "",
        storeId: "",
        isActive: trigger.isActive,
      });
    } else {
      // Reset form when opening for creation
      setForm({
        name: "",
        description: "",
        model: "",
        storeId: "",
        isActive: true,
      });
    }
  }, [trigger, isEditing]);

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

  const handleChange = (field: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white/95 backdrop-blur-sm rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-[#0B2C3D] tracking-tight flex items-center gap-3">
              <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A14A] to-[#A8842C] flex items-center justify-center">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M3 12c0-2.21 1.79-4 4-4h2V6a3 3 0 1 1 6 0v2h2a4 4 0 1 1 0 8h-2v2a3 3 0 1 1-6 0v-2H7a4 4 0 0 1-4-4Z"
                    fill="#fff"
                  />
                </svg>
              </span>
              {isEditing ? t("Edit Trigger ") : t("New Trigger")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form className="space-y-8">
            {/* General */}
            <div>
              <h3 className="text-xl font-bold text-[#C9A14A] mb-4">
                {t("general")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-[#0B2C3D] font-semibold mb-1">
                    {t("Name trigger ")}
                  </label>
                  <input
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[#0B2C3D] font-semibold mb-1">
                    {t("Type of trigger")}
                  </label>
                  {/* <select
                    className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                    value={form.triggerTemplateId}
                    onChange={(e) =>
                      handleChange("triggerTemplateId", e.target.value)
                    }
                  >
                    <option value="">{t("--")}</option>
                    {trigger_types.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select> */}
                </div>
              </div>
            </div>

            {/* {form.triggerTemplateId === "1" && (
              <div className="md:col-span-2">
                <label className="block text-[#0B2C3D] font-semibold mb-1">
                  {t("Logic Field")}
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg p-2 border-2 border-[#F5F6FA] focus:border-[#C9A14A] focus:ring-0 bg-[#F5F6FA] text-[#0B2C3D]"
                  placeholder={t("Enter logic content")}
                  onChange={(e) => handleChange("logicField", e.target.value)}
                />
              </div>
            )}

            {form.triggerTemplateId === "2" && (
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-[#C9A14A]"
                      onChange={(e) =>
                        handleChange("webhookCheckbox", e.target.checked)
                      }
                    />
                    <span className="ml-2 text-[#0B2C3D] font-semibold">
                      {t("Enable Webhook")}
                    </span>
                  </label>
                </div>
                <div className="space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="webhookOption"
                      value="option1"
                      className="form-radio h-5 w-5 text-[#C9A14A]"
                      onChange={(e) =>
                        handleChange("webhookOption", e.target.value)
                      }
                    />
                    <span className="ml-2 text-[#0B2C3D]">
                      {t("Webhook Option 1")}
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="webhookOption"
                      value="option2"
                      className="form-radio h-5 w-5 text-[#C9A14A]"
                      onChange={(e) =>
                        handleChange("webhookOption", e.target.value)
                      }
                    />
                    <span className="ml-2 text-[#0B2C3D]">
                      {t("Webhook Option 2")}
                    </span>
                  </label>
                </div>
              </div>
            )} */}
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#C9A14A] to-[#A8842C] hover:from-[#A8842C] hover:to-[#C9A14A] text-white px-6 py-2 rounded-lg font-semibold"
            >
              {t("save_assistant")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
