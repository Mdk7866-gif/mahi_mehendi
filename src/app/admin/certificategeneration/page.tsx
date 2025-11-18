'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Sparkles, FileDown, CheckCircle2, Loader2 } from 'lucide-react';

export default function CertificateGeneration() {
  const [name, setName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [completionDate, setCompletionDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [generating, setGenerating] = useState(false);
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [progressState, setProgressState] = useState<{ status: 'idle' | 'uploading' | 'generating' | 'success' | 'error'; text: string }>({
    status: 'idle',
    text: '',
  });
  const [progressValue, setProgressValue] = useState(0);

  const handlePhotoChange = (file: File | null) => {
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhoto(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    } else {
      setPhotoPreview('');
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (progressState.status === 'uploading' || progressState.status === 'generating') {
      const cap = progressState.status === 'uploading' ? 60 : 90;
      setProgressValue(progressState.status === 'uploading' ? 15 : 60);
      interval = setInterval(() => {
        setProgressValue((prev) => (prev >= cap ? cap : prev + Math.random() * 8));
      }, 350);
    } else if (progressState.status === 'success' || progressState.status === 'error') {
      setProgressValue(100);
      timeout = setTimeout(() => {
        setProgressState({ status: 'idle', text: '' });
        setProgressValue(0);
      }, 1500);
    } else {
      setProgressValue(0);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [progressState.status]);

  const startGeneration = async () => {
    if (!photo) {
      setStatus('error');
      setStatusMessage('Please select a learner photo.');
      return;
    }
    if (!name.trim()) {
      setStatus('error');
      setStatusMessage('Learner name is required.');
      return;
    }

    setGenerating(true);
    setStatus(null);
    setStatusMessage('');
    setProgressState({ status: 'uploading', text: 'Uploading learner photo…' });

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('courseName', courseName);
      formData.append('completionDate', completionDate);
      formData.append('photo', photo);

      const res = await fetch('/api/generate-certificate', {
        method: 'POST',
        body: formData,
      });

      setProgressState({ status: 'generating', text: 'Designing PDF certificate…' });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.error || 'Certificate generation failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Mahi-Mehendi-Certificate-${name.trim().replace(/\s+/g, '-')}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
      setStatus('success');
      setStatusMessage('Certificate generated. PDF download started.');
      setProgressState({ status: 'success', text: 'Certificate ready' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Certificate generation failed.';
      setStatus('error');
      setStatusMessage(message);
      setProgressState({ status: 'error', text: message });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="min-h-screen mt-16 bg-linear-to-br from-amber-100 via-orange-50 to-rose-100 py-12 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div>
          {progressState.status !== 'idle' && (
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none">
              <div className="mx-auto w-full max-w-md rounded-2xl bg-white/95 border border-amber-200 shadow-lg backdrop-blur-sm p-3">
                <div className="text-xs font-semibold text-amber-900">{progressState.text}</div>
                <div className="h-1.5 mt-2 rounded-full bg-amber-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ${
                      progressState.status === 'error'
                        ? 'bg-red-500'
                        : progressState.status === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 shadow-sm mx-auto">
            <Sparkles className="text-amber-600" size={18} />
            <span className="text-amber-800 font-medium text-sm">Create certificates that match your brand</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-amber-900">Certificate Generation</h1>
          <p className="mt-2 text-amber-700 text-sm sm:text-base max-w-2xl mx-auto">Upload your learner details and instantly generate a branded PDF certificate.</p>
        </motion.header>

        <section className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-200">
            {status && (
              <div
                className={`mb-5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm border ${
                  status === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                    : 'bg-red-50 text-red-700 border-red-100'
                }`}
              >
                {status === 'success' ? <CheckCircle2 size={18} /> : <Sparkles size={18} className="text-red-500" />}
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-900 text-sm font-semibold mb-1">Learner&apos;s Full Name *</label>
                <input
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm"
                  placeholder="Ananya Patel"
                />
              </div>

              <div>
                <label className="block text-amber-900 text-sm font-semibold mb-1">Course Name</label>
                <input
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                  placeholder="Professional Bridal Mehendi Masterclass"
                  className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-900 text-sm font-semibold mb-1">Completion Date *</label>
                <input
                  type="date"
                  value={completionDate}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  onChange={e => setCompletionDate(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none text-amber-900 text-sm"
                />
              </div>

              <div>
                <label className="block text-amber-900 text-sm font-semibold mb-1">Learner Photo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handlePhotoChange(e.target.files?.[0] ?? null)}
                  className="w-full text-sm text-amber-700 file:mr-3 file:rounded-full file:border-0 file:bg-amber-100 file:px-3 file:py-1 file:text-amber-900"
                />
              </div>
            </div>

            {photoPreview && (
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
                <img src={photoPreview} alt="Learner preview" className="w-16 h-16 rounded-xl object-cover border border-amber-200" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Preview ready</p>
                  <p>Upload to Cloudinary before generating the certificate.</p>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={startGeneration}
                disabled={generating || !name.trim() || !photo}
                className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-full px-5 py-3 font-semibold shadow hover:shadow-lg transition disabled:opacity-60"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
                {generating ? 'Processing certificate…' : 'Generate & download PDF'}
              </button>
            </div>
          </motion.div>

          <motion.aside initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-amber-200 flex flex-col justify-between">
            <div>
              <h3 className="text-amber-900 font-semibold text-lg">Brand Guidelines</h3>
              <p className="mt-1 text-amber-700 text-sm">Every certificate inherits the floral borders, premium fonts, and soft palette from the Mahi Mehendi brand.</p>

              <ul className="mt-5 space-y-3 text-sm text-amber-800">
                <li>• Upload square, high-quality learner photos</li>
                <li>• Ensure the completion date is accurate</li>
                <li>• PDF copies are auto-saved to Cloudinary + MongoDB</li>
                <li>• Download link triggers automatically after generation</li>
              </ul>
            </div>

            <div className="mt-6 rounded-xl border border-amber-100 bg-linear-to-br from-amber-50 to-rose-50 p-4 text-center text-xs text-amber-700">
              Need help? Email{' '}
              <a href="mailto:mahi.mehendi@gmail.com" className="font-semibold underline">
                mahi.mehendi@gmail.com
              </a>
            </div>
          </motion.aside>
        </section>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-16 left-6 w-48 h-48 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-6 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
      </div>
    </main>
  );
}