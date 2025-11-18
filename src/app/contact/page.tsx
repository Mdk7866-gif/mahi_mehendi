// src/app/contact/page.tsx
'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, Mail, Map, X, CheckCircle } from 'lucide-react';

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
  const [submitted, setSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const okButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  // auto-dismiss modal after 4s when it opens
  useEffect(() => {
    if (!showModal) return;
    // give focus to OK button for accessibility
    okButtonRef.current?.focus();
    const t = setTimeout(() => setShowModal(false), 4000);
    // allow closing with Escape key
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false);
      if (e.key === 'Enter') setShowModal(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
    };
  }, [showModal]);

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
        setShowModal(true);
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
    <>
      <main className="min-h-screen mt-16 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.header
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 shadow-sm mx-auto">
              <Sparkles className="text-amber-600" size={18} />
              <span className="text-amber-800 font-medium text-sm">Have a question? We’d love to help</span>
            </div>

            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-amber-900">Contact Mahi Mehendi</h1>
            <p className="mt-2 text-amber-700 text-sm sm:text-base max-w-2xl mx-auto">
              Share your event details and preferred date — we&apos;ll get back with availability and a quote.
            </p>
          </motion.header>

          <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left: Contact card (form) */}
              <div className="order-2 lg:order-1">
                <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-md border border-amber-200">
                  {/* Inline banner */}
                  {submitted && (
                    <div className="mb-4 p-3 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                      Thank you — your message has been sent. We&apos;ll contact you shortly.
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-amber-900 text-sm font-semibold mb-1">Name *</label>
                      <input
                        required
                        value={formData.name}
                        onChange={handleChange('name')}
                        className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-amber-900 text-sm font-semibold mb-1">Email or Phone *</label>
                      <input
                        required
                        value={formData.emailOrPhone}
                        onChange={handleChange('emailOrPhone')}
                        className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm"
                        placeholder="Email or phone"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-amber-900 text-sm font-semibold mb-1">Occasion *</label>
                      <select
                        required
                        value={formData.occasion}
                        onChange={handleChange('occasion')}
                        className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm bg-white"
                      >
                        <option value="">Select an occasion</option>
                        <option value="bridal">Bridal</option>
                        <option value="engagement">Engagement</option>
                        <option value="babyshower">Baby Shower</option>
                        <option value="sider">Sider</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-amber-900 text-sm font-semibold mb-1">Preferred Date *</label>
                      <input
                        required
                        value={formData.preferredDate}
                        onChange={handleChange('preferredDate')}
                        min={new Date().toISOString().split('T')[0]}
                        type="date"
                        className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-amber-900 text-sm font-semibold mb-1">Message *</label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={handleChange('message')}
                      rows={4}
                      className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  {error && (
                    <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md border border-red-100 text-sm">{error}</div>
                  )}

                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                    <button
                      disabled={submitting}
                      type="submit"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full px-4 py-2 font-semibold shadow hover:shadow-lg transition disabled:opacity-60"
                    >
                      {submitting ? 'Sending…' : 'Send Message'}
                    </button>

                    <Link
                      href="/services"
                      className="flex-1 inline-flex items-center justify-center border-2 border-amber-200 rounded-full px-4 py-2 text-amber-800 bg-white hover:bg-amber-50 transition"
                    >
                      Back to Services
                    </Link>
                  </div>
                </form>
              </div>

              {/* Right: Info panel */}
              <aside className="order-1 lg:order-2 flex flex-col justify-between">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-amber-200">
                  <h3 className="text-amber-900 font-semibold text-lg flex items-center gap-2">Quick Contact</h3>

                  <p className="mt-2 text-amber-700 text-sm">Prefer a quick chat? Call or message us directly.</p>

                  <div className="mt-4 space-y-4">
                    <a href="tel:+918511402381" className="flex items-center gap-3 group text-amber-800 hover:text-amber-900 transition-all">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-700 shadow-sm group-hover:bg-amber-100">
                        <Phone size={18} />
                      </span>
                      <div className="text-sm font-medium">+91 85114 02381</div>
                    </a>

                    <a href="tel:+919601655793" className="flex items-center gap-3 group text-amber-800 hover:text-amber-900 transition-all">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-700 shadow-sm group-hover:bg-amber-100">
                        <Phone size={18} />
                      </span>
                      <div className="text-sm font-medium">+91 96016 55793</div>
                    </a>

                    <a href="mailto:mahi.mehendi@gmail.com" className="flex items-center gap-3 group text-amber-800 hover:text-amber-900 transition-all">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-700 shadow-sm group-hover:bg-amber-100">
                        <Mail size={18} />
                      </span>
                      <div className="text-sm font-medium">mahi.mehendi@gmail.com</div>
                    </a>

                    <div className="pt-3 border-t border-amber-100 mt-4">
                      <h4 className="text-amber-900 font-semibold text-sm flex items-center gap-2">Visit Us</h4>

                      <address className="not-italic text-amber-700 text-sm leading-tight mt-1">
                        A/4 Al-Aksha Duplex, Kajuri Road,<br />
                        Chandola Lake, Ahmedabad
                      </address>

                      <Link
                        href="https://maps.google.com/?q=A/4%20Al-Aksha%20Duplex%20Kajuri%20Road%20Beral%20Market%20Chandola%20Lake%20Danilimda%20Ahmedabad"
                        className="inline-flex items-center gap-2 mt-3 text-sm text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-all"
                      >
                        <Map size={16} />
                        View Map
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs text-amber-700">
                  © {new Date().getFullYear()} Mahi Mehendi • Managed by <span className="font-semibold">Zaid Alam</span>
                </div>
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

      {/* SUCCESS POPUP MODAL - IMPROVED LAYOUT */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-hidden={!showModal}
          >
            {/* overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />

            {/* modal card */}
            <motion.div
              initial={{ y: 18, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 12, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              role="dialog"
              aria-modal="true"
              aria-label="Submission success"
              className="relative w-full max-w-md mx-auto bg-white rounded-2xl p-5 shadow-2xl ring-1 ring-amber-100"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 p-1 rounded-md text-amber-500 hover:bg-amber-50"
                aria-label="Close success dialog"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <CheckCircle size={32} />
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-amber-900 font-semibold text-lg">Message sent successfully</h3>
                  <p className="mt-1 text-amber-700 text-sm">
                    Thanks for reaching out — we received your message. We’ll contact you shortly to confirm availability and next steps.
                  </p>

                  <div className="mt-4 flex items-center gap-3">
                    <button
                      ref={okButtonRef}
                      onClick={() => setShowModal(false)}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-amber-600 text-white font-semibold shadow hover:shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                    >
                      OK
                    </button>

                    <button
                      onClick={() => {
                        setShowModal(false);
                        // optionally navigate to services page or elsewhere:
                        // router.push('/services');
                      }}
                      className="inline-flex items-center justify-center px-3 py-2 rounded-full border border-amber-200 text-amber-700 bg-white hover:bg-amber-50 transition"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
