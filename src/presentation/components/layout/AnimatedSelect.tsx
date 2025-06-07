import { motion } from "framer-motion";

interface AnimatedSelectProps {
  label: string;
  id: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}

export const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
  label,
  id,
  options,
  value,
  onChange,
  error,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="mb-6"
  >
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-300 mb-1"
    >
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-3 border ${
        error ? "border-red-500" : "border-[#C9A14A]"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm`}
      aria-invalid={!!error}
    >
      <option value="">Selecciona una opción</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </motion.div>
);
