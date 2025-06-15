import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export default function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col md:flex-row items-center justify-between gap-8 h-full"
    >
      <div className="md:w-1/2">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Es hora de dar <span className="text-[#C9A14A]">vida</span> a tu
          negocio
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          FunnelAd te ayuda a automatizar tus ventas y atención al cliente con
          inteligencia artificial.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="px-8 py-4 bg-[#C9A14A] text-white font-medium rounded-md hover:bg-[#B8912A] transition-colors duration-300 flex items-center text-lg"
        >
          CONTINUAR
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </motion.button>
      </div>
      <div className="md:w-1/2">
        <motion.div
          initial={{ scale: 0.9, rotate: -5 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#C9A14A]/30 to-transparent rounded-xl blur-xl animate-pulse"></div>
          <Image
            src="/images/onboarding/welcome-illustration.png"
            alt="FunnelAd - Automatiza tu negocio con IA"
            width={600}
            height={500}
            className="w-full h-auto relative z-10"
            priority
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
