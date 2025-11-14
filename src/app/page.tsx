"use client"
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 sm:px-6 pt-16 w-full max-w-full overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto w-full"
      >
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#3D2817] mb-4 sm:mb-6 leading-tight px-2"
        >
          Welcome to Mahi Mehendi
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg sm:text-xl md:text-2xl text-[#6D4C41] mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2"
        >
          Discover elegant henna designs for every occasion. From simple normal mehendi to exquisite bridal artistry.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link 
            href="/gallery" 
            className="inline-block bg-[#6D4C41] text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold hover:bg-[#3D2817] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
          >
            Explore Gallery
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}