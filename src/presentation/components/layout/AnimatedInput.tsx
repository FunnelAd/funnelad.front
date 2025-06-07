import { motion } from "framer-motion";

interface AnimatedInputProps {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

export const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
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
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border ${
        error ? "border-red-500" : "border-[#C9A14A]"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm`}
      aria-invalid={!!error}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </motion.div>
);
