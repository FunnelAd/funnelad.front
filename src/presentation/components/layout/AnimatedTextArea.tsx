import { motion } from "framer-motion";

interface AnimatedTextareaProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
}

export const AnimatedTextarea: React.FC<AnimatedTextareaProps> = ({
  label,
  id,
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
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className={`w-full px-4 py-3 border ${
        error ? "border-red-500" : "border-[#C9A14A]"
      } rounded-md focus:outline-none focus:ring-2 focus:ring-[#C9A14A] text-white bg-gray-700/80 backdrop-blur-sm resize-none`}
      aria-invalid={!!error}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </motion.div>
);
