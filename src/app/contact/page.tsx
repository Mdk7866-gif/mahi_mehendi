'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

type ContactForm = {
  name: string;
  emailOrPhone: string;
  occasion: string;
  preferredDate: string;
  message: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const buttonHoverVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

export default function Contact(): React.ReactElement {
  // keep hooks at top
  const [loading, setLoading] = useState(true); // show spinner like Services page
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    emailOrPhone: '',
    occasion: '',
    preferredDate: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // show the same loading spinner briefly (matches Services page experience)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const handleChange =
    (key: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', emailOrPhone: '', occasion: '', preferredDate: '', message: '' });
      } else {
        setError(result?.error || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If loading: show a centered spinner like ServicesPage
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen mt-12 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100"
      >
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-600 mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-pulse" size={32} />
          </div>
          <p className="mt-6 text-base text-amber-800 font-medium">Preparing contact form...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-hidden py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-full px-4 py-2 mb-4 shadow-sm mx-auto"
          >
            <Sparkles className="text-amber-600" size={16} />
            <span className="text-xs text-amber-800 font-medium">Get in touch</span>
          </motion.div>
          <motion.h1 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-amber-900 leading-tight"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-amber-700 text-sm sm:text-base max-w-2xl mx-auto mt-2"
          >
            Tell us your requirements and we'll reach out to plan your mehendi session.
          </motion.p>
        </motion.header>

        {!submitted ? (
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 sm:p-8 border border-amber-200"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Name *</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange('name')}
                required
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 placeholder:text-amber-500 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Email or Phone *</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                placeholder="Email address or phone number"
                value={formData.emailOrPhone}
                onChange={handleChange('emailOrPhone')}
                required
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 placeholder:text-amber-500 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Occasion *</label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={formData.occasion}
                onChange={handleChange('occasion')}
                required
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 bg-white text-sm sm:text-base"
              >
                <option value="">Select an occasion</option>
                <option value="bridal">Bridal</option>
                <option value="engagement">Engagement</option>
                <option value="babyshower">Baby Shower</option>
                <option value="sider">Sider</option>
              </motion.select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Preferred Date *</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="date"
                value={formData.preferredDate}
                onChange={handleChange('preferredDate')}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 text-sm sm:text-base"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Message *</label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                placeholder="Tell us about your requirements..."
                value={formData.message}
                onChange={handleChange('message')}
                required
                rows={4}
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 placeholder:text-amber-500 resize-none text-sm sm:text-base"
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm sm:text-base"
              >
                {error}
              </motion.div>
            )}

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.button
                variants={buttonHoverVariants}
                whileHover="hover"
                whileTap="tap"
                type="submit"
                disabled={submitting}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-4 py-3 rounded-full font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {submitting ? 'Submitting...' : 'Send Message'}
              </motion.button>

              <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
                <Link 
                  href="/services" 
                  className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-amber-200 hover:border-amber-300 bg-white hover:bg-amber-50 text-amber-800 rounded-full px-4 py-3 font-semibold transition-all text-sm sm:text-base"
                >
                  Back to Services
                </Link>
              </motion.div>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            variants={containerVariants}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg p-6 sm:p-8 border border-amber-200 text-center"
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-amber-800 font-semibold"
            >
              Thank you! We'll get back to you soon.
            </motion.p>
            <motion.button 
              variants={buttonHoverVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => setSubmitted(false)} 
              className="mt-4 text-amber-700 hover:text-amber-900 underline text-sm sm:text-base"
            >
              Submit another inquiry
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* decorative floats (kept outside container for layered look) */}
      <div className="pointer-events-none absolute inset-0 opacity-10 -z-10">
        <div className="absolute top-24 left-6 w-48 h-48 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-6 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
      </div>
    </main>
  );
}