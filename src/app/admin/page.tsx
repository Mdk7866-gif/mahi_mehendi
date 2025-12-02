'use client';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import GalleryCardPopUp from '@/components/GalleryCardPopUp';

type Category = 'bridal' | 'engagement' | 'babyshower' | 'sider' | 'karwa chauth';
interface ImageType { _id: string; url: string; category: Category; price: number }

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'bridal', label: 'Bridal', icon: '👰' },
  { id: 'engagement', label: 'Engagement', icon: '💍' },
  { id: 'babyshower', label: 'Baby Shower', icon: '🍼' },
  { id: 'sider', label: 'Sider', icon: '✨' },
  { id: 'karwa chauth', label: 'Karwa Chauth', icon: '🌙' }
];

export default function Admin(): React.ReactElement {
  // auth and session
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticating, setAuthenticating] = useState(false);
  const [authError, setAuthError] = useState('');

  // images & UI
  const [images, setImages] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('bridal');
  const [filteredImages, setFilteredImages] = useState<ImageType[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  // upload form
  const [formData, setFormData] = useState<{ category: Category; price: string }>({ category: 'bridal', price: '' });
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // edit slide-over
  const [editingImage, setEditingImage] = useState<ImageType | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // messages/progress
  const [message, setMessage] = useState('');
  const [progressState, setProgressState] = useState<{ status: 'idle'|'loading'|'success'|'error'; text: string }>({ status: 'idle', text: '' });
  const [progressValue, setProgressValue] = useState(0);

  // ===== session verify =====
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch('/api/admin-auth', { cache: 'no-store' });
        const data = await res.json();
        if (data?.authenticated) setIsAuthenticated(true);
      } catch (err) {
        console.error(err);
      } finally {
        setCheckingSession(false);
      }
    };
    verify();
  }, []);

  // ===== load images after auth =====
  useEffect(() => {
    if (!isAuthenticated) return;
    const controller = new AbortController();

    const fetchImages = async () => {
      setProgressState({ status: 'loading', text: 'Loading gallery...' });
      setLoadingImages(true);
      try {
        const res = await fetch('/api/images', { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error('Unable to load images');
        const data = await res.json();
        setImages(Array.isArray(data) ? data : []);
        setProgressState({ status: 'success', text: 'Gallery ready' });
      } catch (err) {
        console.error(err);
        setImages([]);
        setProgressState({ status: 'error', text: 'Failed to load gallery' });
      } finally {
        setLoadingImages(false);
      }
    };

    fetchImages();
    return () => controller.abort();
  }, [isAuthenticated]);

  // update filtered list when images or selectedCategory changes
  useEffect(() => {
    setFilteredImages(images.filter(i => i.category === selectedCategory));
  }, [images, selectedCategory]);

  // progress animation (keeps your existing logic - incremental fill)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (progressState.status === 'loading') {
      setProgressValue(16);
      interval = setInterval(() => setProgressValue(prev => Math.min(86, prev + Math.random() * 9)), 360);
    } else if (progressState.status === 'success' || progressState.status === 'error') {
      setProgressValue(100);
      timeout = setTimeout(() => {
        setProgressValue(0);
        setProgressState({ status: 'idle', text: '' });
      }, 1400);
    } else {
      setProgressValue(0);
    }

    return () => { if (interval) clearInterval(interval); if (timeout) clearTimeout(timeout); };
  }, [progressState.status]);

  // ===== auth handler =====
  const handleAuth = async () => {
    setAuthError('');
    setAuthenticating(true);
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data?.authenticated) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setAuthError(data?.error || 'Incorrect password');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to authenticate');
    } finally {
      setAuthenticating(false);
    }
  };

  // ===== upload form preview handler =====
  const onUploadFileChange = (file?: File | null) => {
    if (!file) {
      setUploadPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
    // revoke later to avoid leaks
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  // ===== upload submit =====
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setProgressState({ status: 'loading', text: 'Uploading photo...' });
    setMessage('');

    const file = fileInputRef.current?.files?.[0] ?? null;
    if (!file) {
      setMessage('Please select an image');
      setUploading(false);
      setProgressState({ status: 'error', text: 'Select an image' });
      return;
    }

    const payload = new FormData();
    payload.append('image', file);
    payload.append('category', formData.category);
    payload.append('price', formData.price);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: payload });
      const json = await res.json();
      if (res.ok && json?.image) {
        setImages(p => [json.image, ...p]);
        setMessage('Image uploaded');
        (e.currentTarget as HTMLFormElement).reset();
        setFormData({ category: 'bridal', price: '' });
        setUploadPreview(null);
        setProgressState({ status: 'success', text: 'Upload complete' });
      } else {
        setMessage(json?.error || 'Upload failed');
        setProgressState({ status: 'error', text: 'Upload failed' });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload error');
      setProgressState({ status: 'error', text: 'Upload error' });
    } finally {
      setUploading(false);
    }
  };

  // ===== open edit slide-over =====
  const startEdit = (img: ImageType) => {
    setEditingImage(img);
    setNewImageFile(null);
    setEditPreview(null);
    setMessage('');
  };

  const onEditFileChange = (file?: File | null) => {
    setNewImageFile(file ?? null);
    if (!file) {
      setEditPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setEditPreview(url);
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };

  const saveEdit = async (payload?: { category?: Category; price?: string; file?: File | null }) => {
    if (!editingImage) return;
    const form = new FormData();
    form.append('category', (payload?.category ?? editingImage.category) as string);
    form.append('price', (payload?.price ?? String(editingImage.price)) as string);
    if (payload?.file) form.append('image', payload.file);

    setSavingEdit(true);
    setProgressState({ status: 'loading', text: 'Saving changes...' });
    setMessage('');
    try {
      const res = await fetch(`/api/images/${editingImage._id}`, { method: 'PUT', body: form });
      const json = await res.json();
      if (res.ok && json?.image) {
        setImages(prev => prev.map(p => p._id === json.image._id ? json.image : p));
        setMessage('Saved successfully');
        setProgressState({ status: 'success', text: 'Changes saved' });
        setEditingImage(null);
      } else {
        setMessage(json?.error || 'Update failed');
        setProgressState({ status: 'error', text: 'Update failed' });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update error');
      setProgressState({ status: 'error', text: 'Update error' });
    } finally {
      setSavingEdit(false);
    }
  };

  // ===== delete =====
  const confirmDelete = (id: string) => setConfirmDeleteId(id);
  const performDelete = async (id: string) => {
    setDeleting(true);
    setProgressState({ status: 'loading', text: 'Deleting photo...' });
    setMessage('');
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok) {
        setImages(prev => prev.filter(p => p._id !== id));
        setMessage('Deleted');
        setProgressState({ status: 'success', text: 'Photo deleted' });
      } else {
        setMessage(json?.error || 'Delete failed');
        setProgressState({ status: 'error', text: 'Delete failed' });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete error');
      setProgressState({ status: 'error', text: 'Delete error' });
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  // ===== misc helpers =====
  const logout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    setIsAuthenticated(false);
    setPassword('');
  };

  // ===== render states =====
  if (checkingSession) {
    return (
      <main className="min-h-screen mt-16 flex items-center justify-center bg-linear-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="text-amber-800">Verifying admin session…</div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen mt-16 flex items-center justify-center bg-linear-to-br from-amber-100 via-orange-50 to-rose-100 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm bg-white/95 backdrop-blur-sm p-5 rounded-2xl border border-amber-200 shadow-lg">
          <div className="text-center">
            <Sparkles className="mx-auto text-amber-600" size={40} />
            <h2 className="mt-3 text-2xl font-bold text-amber-900">Admin Access</h2>
            <p className="text-amber-700 text-sm mt-1">Enter admin password to manage the gallery.</p>
          </div>

          <div className="mt-4">
            <label htmlFor="admin-pass" className="sr-only">Password</label>
            <input
              id="admin-pass"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
              className="mt-2 w-full p-3 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none"
            />
            {authError && <div className="mt-2 text-sm text-red-600">{authError}</div>}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAuth}
              disabled={authenticating || !password.trim()}
              className="mt-4 w-full bg-linear-to-r from-amber-600 to-orange-600 text-white py-2 rounded-xl font-semibold disabled:opacity-60"
            >
              {authenticating ? 'Verifying…' : 'Enter'}
            </motion.button>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mt-16 bg-linear-to-br from-amber-100 via-orange-50 to-rose-100 py-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* progress toaster */}
        <AnimatePresence>
          {progressState.status !== 'idle' && (
            <motion.div initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -18, opacity: 0 }} className="fixed left-1/2 -translate-x-1/2 top-4 z-50 w-[min(96%,640px)] pointer-events-none">
              <div className="mx-auto bg-white/95 border border-amber-200 rounded-2xl p-3 shadow-lg backdrop-blur-sm">
                <div className="text-xs font-semibold text-amber-900">{progressState.text}</div>
                <div className="h-1.5 mt-2 rounded-full bg-amber-100 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-200 ${progressState.status === 'error' ? 'bg-red-500' : progressState.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.header initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full px-3 py-1.5 shadow-sm mx-auto">
            <Sparkles className="text-amber-600" size={14} />
            <span className="text-xs text-amber-800 font-medium">Admin Panel</span>
          </div>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-amber-900">Manage Gallery</h1>
        </motion.header>

        {/* UPLOAD FORM (compact grid) */}
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-amber-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr_120px] gap-3 items-start">
            <div>
              <label className="block text-amber-900 text-sm font-semibold mb-1">Photo *</label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  name="image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => onUploadFileChange(e.currentTarget.files?.[0] ?? null)}
                  className="w-full file:py-2 file:px-3 file:rounded-md file:bg-amber-50 file:text-amber-700"
                />
              </div>
              {uploadPreview && (
                <div className="mt-2 w-28 h-20 rounded-md overflow-hidden border border-amber-100 relative">
                  <Image src={uploadPreview} alt="preview" fill className="object-cover" sizes="112px" unoptimized />
                </div>
              )}
            </div>

            <div className="sm:col-span-1">
              <label className="block text-amber-900 text-sm font-semibold mb-1">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} className="w-full p-2 rounded-xl border-2 border-amber-100">
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>

              <label className="block text-amber-900 text-sm font-semibold mb-1 mt-3">Price (₹) *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} min="0" step="0.01" placeholder="e.g. 1200" className="w-full p-2 rounded-xl border-2 border-amber-100" />
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="flex gap-2 w-full">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={uploading} type="submit" className="flex-1 px-3 py-2 bg-linear-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold disabled:opacity-60">
                  {uploading ? 'Uploading...' : 'Upload'}
                </motion.button>
              </div>

              <div className="flex gap-2 w-full">
                <button type="button" onClick={() => { setFormData({ category: 'bridal', price: '' }); if (fileInputRef.current) fileInputRef.current.value = ''; setUploadPreview(null); setMessage(''); }} className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-amber-800">Reset</button>
                <div className="ml-auto text-xs text-amber-700">{message && <span className="font-medium">{message}</span>}</div>
              </div>
            </div>
          </div>
        </motion.form>

        {/* CATEGORY FILTERS (compact scrollable) */}
        <div className="mb-5">
          <div role="tablist" aria-label="Filter categories" className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory px-1 py-1">
            {CATEGORIES.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`snap-start inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${active ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md' : 'bg-white/90 border border-amber-200 text-amber-800'}`}
                >
                  <span aria-hidden className="leading-none">{cat.icon}</span>
                  <span className="hidden sm:inline">{cat.label}</span>
                  <span className="sm:hidden sr-only">{cat.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 text-xs text-amber-700 sm:hidden text-center">Showing: <strong className="capitalize">{selectedCategory}</strong></div>
        </div>

        {/* IMAGE GRID */}
        {loadingImages ? (
          <div className="flex items-center justify-center py-14 text-amber-700">Loading images...</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredImages.map(img => (
              <motion.div key={img._id} className="group bg-white/95 rounded-2xl shadow-sm border border-amber-200 overflow-hidden cursor-pointer" whileHover={{ scale: 1.02 }}>
                <div className="relative h-44 sm:h-40" onClick={() => setSelectedImage(img)}>
                  <Image src={img.url} alt="mehendi" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" loading="lazy" quality={75} />
                </div>

                <div className="p-3 flex items-center justify-between bg-amber-50">
                  <div className="text-amber-700 text-sm capitalize">{img.category}</div>
                  <div className="text-amber-900 font-bold">₹{img.price}</div>
                </div>

                <div className="p-3 flex items-center gap-2 justify-end bg-white border-t border-amber-100">
                  <button onClick={(e) => { e.stopPropagation(); startEdit(img); }} className="px-2 py-1 rounded-md bg-amber-600 text-white text-xs font-semibold">Edit</button>
                  <button onClick={(e) => { e.stopPropagation(); confirmDelete(img._id); }} className="px-2 py-1 rounded-md bg-red-600 text-white text-xs font-semibold">Delete</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Confirm Delete Modal (with thumbnail) */}
        <AnimatePresence>
          {confirmDeleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 w-full max-w-md border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900">Confirm Delete</h3>
                <p className="text-sm text-amber-700 mt-2">This image will be removed permanently. Are you sure?</p>

                <div className="mt-3">
                  {images.find(i => i._id === confirmDeleteId) && (
                    <div className="w-full h-36 rounded-md overflow-hidden border border-amber-100 relative">
                      <Image src={images.find(i => i._id === confirmDeleteId)!.url} alt="to delete" fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end gap-3">
                  <button onClick={() => setConfirmDeleteId(null)} disabled={deleting} className="px-3 py-1.5 rounded-md bg-amber-100 text-amber-700">Cancel</button>
                  <button onClick={() => confirmDeleteId && performDelete(confirmDeleteId)} disabled={deleting} className="px-3 py-1.5 rounded-md bg-red-600 text-white">{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit slide-over */}
        <AnimatePresence>
          {editingImage && (
            <motion.aside initial={{ x: 320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 320, opacity: 0 }} className="fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] bg-white/95 backdrop-blur-sm border-l border-amber-200 shadow-2xl">
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-amber-900">Edit Photo</h3>
                  <button onClick={() => setEditingImage(null)} className="text-amber-700">Close</button>
                </div>

                <div className="mt-4 overflow-auto">
                  <div className="w-full h-56 relative rounded-lg overflow-hidden border border-amber-100">
                    <Image src={editPreview ?? editingImage.url} alt="editing" fill className="object-cover" sizes="(max-width: 640px) 100vw, 420px" unoptimized={!!editPreview} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <label className="text-sm text-amber-800 font-semibold">Category</label>
                    <select value={editingImage.category} onChange={(e) => setEditingImage(p => p ? { ...p, category: e.target.value as Category } : p)} className="p-2 rounded-xl border-2 border-amber-100">
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>

                    <label className="text-sm text-amber-800 font-semibold">Price (₹)</label>
                    <input type="number" value={editingImage.price} onChange={(e) => setEditingImage(p => p ? { ...p, price: Number(e.target.value) } : p)} className="p-2 rounded-xl border-2 border-amber-100" />

                    <label className="text-sm text-amber-800 font-semibold">Replace Photo (optional)</label>
                    <input type="file" accept="image/*" onChange={(e) => onEditFileChange(e.currentTarget.files?.[0] ?? null)} className="p-2 rounded-xl border-2 border-amber-100" />

                    <div className="flex gap-3 mt-4">
                      <button onClick={() => saveEdit({ category: editingImage.category, price: String(editingImage.price), file: newImageFile })} disabled={savingEdit} className="flex-1 px-3 py-2 rounded-xl bg-linear-to-r from-amber-600 to-orange-600 text-white disabled:opacity-60">{savingEdit ? 'Saving...' : 'Save changes'}</button>
                      <button onClick={() => setEditingImage(null)} disabled={savingEdit} className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-200 text-amber-800">Cancel</button>
                    </div>

                    {message && <div className={`mt-3 p-2 rounded-md ${message.toLowerCase().includes('success') ? 'bg-amber-50 text-amber-900' : 'bg-red-50 text-red-700'}`}>{message}</div>}
                  </div>
                </div>

                <div className="mt-auto text-xs text-amber-700">© {new Date().getFullYear()} Mahi Mehendi</div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="mt-6 text-center">
          <button onClick={logout} className="text-amber-700 underline">Logout</button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-24 left-6 w-44 h-44 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-6 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
      </div>

      <GalleryCardPopUp selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  );
}
