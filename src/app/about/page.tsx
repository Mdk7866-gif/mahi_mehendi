"use client"
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full overflow-x-hidden">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#3D2817] mb-8 sm:mb-12"
      >
        About Mahi Mehendi
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12 border border-[#8D6E63]/20 w-full"
      >
        <p className="text-base sm:text-lg md:text-xl text-[#6D4C41] leading-relaxed">
          Mahi Mehendi is a passion-driven studio specializing in traditional and contemporary henna art. With years of experience, we bring intricate designs that celebrate femininity and culture. Our focus is on comfort, quality, and creating memories that last.
        </p>
      </motion.div>
    </div>
  );
}