'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type ContactForm = {
  name: string;
  emailOrPhone: string;
  occasion: string;
  preferredDate: string;
  message: string;
};

export default function Contact(): React.ReactElement {
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
  
  return (
    <div className="py-20 px-4 max-w-2xl mx-auto w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#3D2817] mb-8 sm:mb-12"
      >
        Contact Us
      </motion.h1>
      {!submitted ? (
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6 bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-[#8D6E63]/20 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Name *</label>
            <input
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              className="w-full p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] placeholder:text-[#8D6E63] text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Email or Phone *</label>
            <input
              type="text"
              placeholder="Email address or phone number"
              value={formData.emailOrPhone}
              onChange={handleChange('emailOrPhone')}
              required
              className="w-full p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] placeholder:text-[#8D6E63] text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Occasion *</label>
            <select
              value={formData.occasion}
              onChange={handleChange('occasion')}
              required
              className="w-full p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] bg-white text-sm sm:text-base"
            >
              <option value="">Select an occasion</option>
              <option value="Bridal">Bridal</option>
              <option value="Wedding">Wedding</option>
              <option value="Festival">Festival</option>
              <option value="Party">Party</option>
              <option value="Normal/Daily">Normal/Daily</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Preferred Date *</label>
            <input
              type="date"
              value={formData.preferredDate}
              onChange={handleChange('preferredDate')}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Message *</label>
            <textarea
              placeholder="Tell us about your requirements..."
              value={formData.message}
              onChange={handleChange('message')}
              required
              rows={4}
              className="w-full p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] placeholder:text-[#8D6E63] resize-none text-sm sm:text-base"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm sm:text-base">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#6D4C41] text-white py-3 rounded-md hover:bg-[#3D2817] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {submitting ? 'Submitting...' : 'Send Message'}
          </button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-6 sm:p-8 border border-[#8D6E63]/20 text-center"
        >
          <p className="text-lg sm:text-xl text-[#6D4C41] font-semibold">Thank you! We&apos;ll get back to you soon.</p>
          <button onClick={() => setSubmitted(false)} className="mt-4 text-[#6D4C41] hover:text-[#3D2817] underline text-sm sm:text-base">
            Submit another inquiry
          </button>
        </motion.div>
      )}
    </div>
  );
}
