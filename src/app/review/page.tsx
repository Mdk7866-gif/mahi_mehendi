'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Download, Calendar, FileText, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Certificate {
  _id: string;
  name: string;
  courseName: string;
  completionDate: string;
  pdfUrl: string;
  certificateNumber?: string;
  createdAt: string;
}

export default function ReviewPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificates', {
          signal: controller.signal,
          cache: 'force-cache', // Use browser cache when available
        });
        if (!res.ok) throw new Error('Failed to fetch certificates');
        const data = await res.json();
        setCertificates(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Error:', err);
          setError(err.message || 'Failed to load certificates');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
    
    return () => controller.abort();
  }, []);

  // Generate preview image URL from PDF URL using Cloudinary transformation
  const getPreviewUrl = (pdfUrl: string) => {
    if (!pdfUrl) return '';
    // Convert PDF URL to image preview (first page)
    // Cloudinary can convert PDF first page to image by inserting transformation
    if (pdfUrl.includes('cloudinary.com') && pdfUrl.includes('/upload/')) {
      // Insert transformation before filename: /upload/ -> /upload/fl_png,pg_1/
      return pdfUrl.replace('/upload/', '/upload/fl_png,pg_1/').replace('.pdf', '.png');
    }
    return '';
  };

  if (loading) {
    return (
      <main className="min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-amber-600 mx-auto" />
          <p className="mt-4 text-amber-800 font-medium">Loading certificates…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mt-16 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 shadow-sm mx-auto">
            <Sparkles className="text-amber-600" size={18} />
            <span className="text-amber-800 font-medium text-sm">Celebrating our talented learners</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-amber-900">Certificate Gallery</h1>
          <p className="mt-2 text-amber-700 text-sm sm:text-base max-w-2xl mx-auto">Browse certificates of completion from our mehendi artistry courses.</p>
        </motion.header>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
            {error}
          </div>
        )}

        {certificates.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 shadow-md border border-amber-200 text-center">
            <FileText className="mx-auto text-amber-400" size={48} />
            <p className="mt-4 text-amber-700 text-lg">No certificates available yet.</p>
            <p className="mt-2 text-amber-600 text-sm">Check back soon for new certificates!</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {certificates.map((cert, index) => {
                const previewUrl = getPreviewUrl(cert.pdfUrl);
                return (
                  <motion.div
                    key={cert._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200 overflow-hidden hover:shadow-lg transition"
                  >
                    {/* PDF Preview */}
                    <div className="relative h-64 bg-amber-50 border-b border-amber-100">
                      {previewUrl ? (
                        <Image
                          src={previewUrl}
                          alt={`Certificate preview for ${cert.name}`}
                          width={400}
                          height={256}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          quality={75}
                          onError={(e) => {
                            // Fallback to PDF icon if preview fails
                            (e.target as HTMLImageElement).style.display = 'none';
                            const parent = (e.target as HTMLImageElement).parentElement;
                            if (parent && !parent.querySelector('.fallback-icon')) {
                              const icon = document.createElement('div');
                              icon.className = 'fallback-icon absolute inset-0 flex items-center justify-center';
                              icon.innerHTML = '<div class="text-center"><svg class="w-16 h-16 text-amber-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg><p class="text-amber-600 text-sm mt-2">PDF Certificate</p></div>';
                              parent.appendChild(icon);
                            }
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="w-16 h-16 text-amber-400 mx-auto" />
                            <p className="text-amber-600 text-sm mt-2">PDF Certificate</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Certificate Info */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-amber-900 mb-1">{cert.name}</h3>
                      <p className="text-sm text-amber-700 mb-3">{cert.courseName}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-amber-600 mb-4">
                        <Calendar size={14} />
                        <span>{new Date(cert.completionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>

                      {cert.certificateNumber && (
                        <p className="text-xs text-amber-500 mb-4">Cert #: {cert.certificateNumber}</p>
                      )}

                      <a
                        href={cert.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full px-4 py-2.5 font-semibold shadow hover:shadow-lg transition text-sm"
                      >
                        <Download size={16} />
                        View & Download PDF
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-20 left-6 w-44 h-44 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-12 right-6 w-64 h-64 bg-orange-400 rounded-full blur-3xl" />
      </div>
    </main>
  );
}
