"use client"
import { motion } from 'framer-motion';

const reviews = [
  { text: 'Absolutely stunning bridal mehendi! Highly recommend.', name: 'Priya S.' },
  { text: 'Simple and elegant designs. Perfect for daily wear.', name: 'Aisha K.' },
];

export default function Reviews() {
  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full overflow-x-hidden">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#3D2817] mb-8 sm:mb-12"
      >
        Reviews
      </motion.h1>
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 w-full">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-lg border border-[#8D6E63]/20 hover:shadow-xl transition-all duration-300 w-full"
          >
            <p className="text-[#6D4C41] mb-4 text-base sm:text-lg leading-relaxed">"{review.text}"</p>
            <p className="font-semibold text-[#3D2817] text-right text-sm sm:text-base">- {review.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}