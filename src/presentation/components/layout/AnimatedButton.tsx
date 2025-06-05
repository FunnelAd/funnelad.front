import { motion } from "framer-motion";

interface AnimatedButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
  children,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    disabled={disabled}
    className="px-8 py-4 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center text-lg mx-auto disabled:opacity-60"
  >
    {isLoading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        Procesando...
      </>
    ) : (
      children
    )}
  </motion.button>
);
