// src/app/contact/page.tsx
// Contact page for the website
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

export default function Contact(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    emailOrPhone: '',
    occasion: '',
    preferredDate: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  // <-- added submitted state to fix the build error
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const handleChange =
    (key: keyof ContactForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData((p) => ({ ...p, [key]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSubmitted(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', emailOrPhone: '', occasion: '', preferredDate: '', message: '' });
      } else {
        setError(json?.error || 'Failed to submit.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-amber-600 mx-auto" />
            <Sparkles className="absolute inset-0 m-auto text-amber-600 animate-pulse" size={28} />
          </div>
          <p className="mt-4 text-amber-800 font-medium">Preparing contact form…</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen mt-16 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 shadow-sm mx-auto">
            <Sparkles className="text-amber-600" size={18} />
            <span className="text-amber-800 font-medium text-sm">Have a question? We’d love to help</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-amber-900">Contact Mahi Mehendi</h1>
          <p className="mt-2 text-amber-700 text-sm sm:text-base max-w-2xl mx-auto">Share your event details and preferred date — we&apos;ll get back with availability and a quote.</p>
        </motion.header>

        <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

            {/* Left: Contact card (form) */}
            <div className="order-2 lg:order-1">
              <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md border border-amber-200">
                {submitted && (
                  <div className="mb-4 p-3 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                    Thank you — your message has been sent. We&apos;ll contact you shortly.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-900 text-sm font-semibold mb-1">Name *</label>
                    <input required value={formData.name} onChange={handleChange('name')} className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm" placeholder="Your full name" />
                  </div>

                  <div>
                    <label className="block text-amber-900 text-sm font-semibold mb-1">Email or Phone *</label>
                    <input required value={formData.emailOrPhone} onChange={handleChange('emailOrPhone')} className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm" placeholder="Email or phone" />
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-amber-900 text-sm font-semibold mb-1">Occasion *</label>
                    <select required value={formData.occasion} onChange={handleChange('occasion')} className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm bg-white">
                      <option value="">Select an occasion</option>
                      <option value="bridal">Bridal</option>
                      <option value="engagement">Engagement</option>
                      <option value="babyshower">Baby Shower</option>
                      <option value="sider">Sider</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-amber-900 text-sm font-semibold mb-1">Preferred Date *</label>
                    <input required value={formData.preferredDate} onChange={handleChange('preferredDate')} min={new Date().toISOString().split('T')[0]} type="date" className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm" />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-amber-900 text-sm font-semibold mb-1">Message *</label>
                  <textarea required value={formData.message} onChange={handleChange('message')} rows={4} className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm resize-none" placeholder="Tell us about your requirements..." />
                </div>

                {error && <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md border border-red-100 text-sm">{error}</div>}

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button disabled={submitting} type="submit" className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full px-4 py-2 font-semibold shadow hover:shadow-lg transition disabled:opacity-60">
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>

                  <Link href="/services" className="flex-1 inline-flex items-center justify-center border-2 border-amber-200 rounded-full px-4 py-2 text-amber-800 bg-white hover:bg-amber-50 transition">Back to Services</Link>
                </div>

              </form>
            </div>

            {/* Right: Info panel */}
            <aside className="order-1 lg:order-2 flex flex-col justify-between">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-md border border-amber-200">
                <h3 className="text-amber-900 font-semibold text-lg">Quick Contact</h3>
                <p className="mt-2 text-amber-700 text-sm">Prefer a quick chat? Call or message us directly.</p>

                <div className="mt-4 space-y-3">
                  <a href="tel:+918511402381" className="flex items-center gap-3 text-amber-800 hover:text-amber-900">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-700">📞</span>
                    <div className="text-sm">+91 85114 02381</div>
                  </a>

                  <a href="mailto:mahi.mehendi@gmail.com" className="flex items-center gap-3 text-amber-800 hover:text-amber-900">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-50 text-amber-700">✉️</span>
                    <div className="text-sm">mahi.mehendi@gmail.com</div>
                  </a>

                  <div className="pt-2 border-t border-amber-100 mt-3">
                    <h4 className="text-amber-900 font-semibold text-sm">Visit Us</h4>
                    <address className="not-italic text-amber-700 text-sm mt-1">A/4 Al-Aksha Duplex, Kajuri Road,<br/>Chandola Lake, Ahmedabad</address>
                    <Link href="https://maps.google.com/?q=A/4%20Al-Aksha%20Duplex%20Kajuri%20Road%20Beral%20Market%20Chandola%20Lake%20Danilimda%20Ahmedabad" className="inline-block mt-3 text-sm text-amber-700 hover:text-amber-900 underline">View map</Link>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-xs text-amber-700">© {new Date().getFullYear()} Mahi Mehendi</div>
            </aside>

          </div>
        </motion.section>
      </div>

      {/* subtle decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-20 left-6 w-44 h-44 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-6 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
      </div>
    </main>
  );
}
