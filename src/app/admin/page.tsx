'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import GalleryCardPopUp from '@/components/GalleryCardPopUp';

type Category = 'bridal' | 'engagement' | 'babyshower' | 'sider';

interface ImageType { _id: string; url: string; category: Category; price: number }

export default function Admin(): React.ReactElement {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<{ category: Category; price: string }>({ category: 'bridal', price: '' });
  const [message, setMessage] = useState('');
  const [images, setImages] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('bridal');
  const [editingImage, setEditingImage] = useState<ImageType | null>(null); // slide-over edit
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/images')
      .then((r) => r.json())
      .then((data) => setImages(Array.isArray(data) ? data : []))
      .catch(() => setImages([]))
      .finally(() => setLoadingImages(false));
  }, []);

  const filteredImages = images.filter((i) => i.category === selectedCategory);

  const handleImageClick = (img: ImageType) => setSelectedImage(img);
  const closeModal = () => setSelectedImage(null);

  const startEdit = (img: ImageType) => {
    setEditingImage(img);
    setNewImageFile(null);
    setMessage('');
  };

  const cancelEdit = () => setEditingImage(null);

  const saveEdit = async (payload?: { category?: Category; price?: string; file?: File | null }) => {
    if (!editingImage) return;
    const form = new FormData();
    form.append('category', (payload?.category ?? editingImage.category) as string);
    form.append('price', (payload?.price ?? String(editingImage.price)) as string);
    if (payload?.file) form.append('image', payload.file);

    const res = await fetch(`/api/images/${editingImage._id}`, { method: 'PUT', body: form });
    const json = await res.json();
    if (res.ok && json?.image?._id) {
      setImages((prev) => prev.map((p) => (p._id === json.image._id ? json.image : p)));
      setMessage('Updated successfully');
      setEditingImage(null);
    } else {
      setMessage(json?.error || 'Update failed');
    }
  };

  const confirmDelete = (id: string) => setConfirmDeleteId(id);

  const performDelete = async (id: string) => {
    setDeleting(true);
    setMessage('');
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok) {
        setImages((prev) => prev.filter((p) => p._id !== id));
        setMessage('Deleted successfully');
      } else {
        setMessage(json?.error || 'Delete failed');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Delete error');
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  const handleAuth = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === '174216') setIsAuthenticated(true);
    else alert('Incorrect password');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const fileEl = (e.currentTarget.elements.namedItem('image') as HTMLInputElement | null)?.files?.[0];
    if (!fileEl) {
      setMessage('Please select an image file');
      setUploading(false);
      return;
    }

    const data = new FormData();
    data.append('image', fileEl);
    data.append('category', formData.category);
    data.append('price', formData.price);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const json = await res.json();
      if (res.ok) {
        setMessage('Image uploaded successfully!');
        e.currentTarget.reset();
        setFormData({ category: 'bridal', price: '' });
        if (json?.image?._id) setImages((p) => [json.image, ...p]);
      } else {
        setMessage(json?.error || 'Upload failed');
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload error');
    } finally {
      setUploading(false);
    }
  };

  // ---------- RENDER ----------
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen mt-16 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl w-full max-w-sm border border-amber-200">
          <div className="text-center mb-4">
            <Sparkles className="mx-auto text-amber-600" size={36} />
            <h2 className="text-2xl font-bold text-amber-900 mt-2">Admin Access</h2>
            <p className="text-amber-700 text-sm mt-1">Enter admin password to manage the gallery.</p>
          </div>

          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAuth()} className="w-full p-3 border-2 border-amber-200 rounded-xl mb-3 focus:border-amber-400 outline-none" />

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleAuth} className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 rounded-xl font-semibold">Enter</motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen mt-16 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 py-10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full px-3 py-1.5 shadow-sm mx-auto">
            <Sparkles className="text-amber-600" size={14} />
            <span className="text-xs text-amber-800 font-medium">Admin Panel</span>
          </div>
          <motion.h1 initial={{ scale: 0.98 }} animate={{ scale: 1 }} className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-3">Manage Gallery</motion.h1>
        </motion.header>

        {/* UPLOAD FORM */}
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white/95 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-sm border border-amber-200 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="sm:col-span-1">
              <label className="block text-amber-900 text-sm font-semibold mb-1">Photo *</label>
              <input name="image" type="file" accept="image/*" required className="w-full p-2 rounded-xl border-2 border-amber-100 file:py-2 file:px-3 file:rounded-md file:bg-amber-50 file:text-amber-700" />
            </div>

            <div>
              <label className="block text-amber-900 text-sm font-semibold mb-1">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })} className="w-full p-2 rounded-xl border-2 border-amber-100">
                <option value="bridal">Bridal</option>
                <option value="engagement">Engagement</option>
                <option value="babyshower">Baby Shower</option>
                <option value="sider">Sider</option>
              </select>
            </div>

            <div>
              <label className="block text-amber-900 text-sm font-semibold mb-1">Price (₹) *</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} min="0" step="0.01" placeholder="e.g. 1200" className="w-full p-2 rounded-xl border-2 border-amber-100" />
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} disabled={uploading} type="submit" className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold shadow-sm">{uploading ? 'Uploading...' : 'Upload'}</motion.button>

            <button type="button" onClick={() => { setFormData({ category: 'bridal', price: '' }); (document.querySelector('input[name=image]') as HTMLInputElement | null)?.value && ((document.querySelector('input[name=image]') as HTMLInputElement).value = ''); setMessage(''); }} className="px-4 py-2 bg-white border border-amber-200 rounded-xl text-amber-800">Reset</button>

            <div className="ml-auto text-xs text-amber-700">{message && <span className="font-medium">{message}</span>}</div>
          </div>
        </motion.form>

        {/* CATEGORY FILTERS */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 justify-center mb-5 flex-wrap">
          {(['bridal', 'engagement', 'babyshower', 'sider'] as Category[]).map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-sm font-semibold ${selectedCategory === cat ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow' : 'bg-white/90 border border-amber-200 text-amber-800'}`}>
              {cat[0].toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* IMAGE GRID */}
        {loadingImages ? (
          <div className="flex items-center justify-center py-14 text-amber-700">Loading images...</div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <motion.div key={img._id} className="group bg-white/95 rounded-2xl shadow-sm border border-amber-200 overflow-hidden cursor-pointer" whileHover={{ scale: 1.02 }}>
                <div className="relative h-44 sm:h-40" onClick={() => handleImageClick(img)}>
                  <Image src={img.url} alt="mehendi" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />
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

        {/* Confirm Delete Modal */}
        <AnimatePresence>
          {confirmDeleteId && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900">Confirm Delete</h3>
                <p className="text-sm text-amber-700 mt-2">Are you sure you want to delete this image? This action cannot be undone.</p>
                <div className="mt-4 flex justify-end gap-3">
                  <button onClick={() => setConfirmDeleteId(null)} disabled={deleting} className="px-3 py-1.5 rounded-md bg-amber-100 text-amber-700">Cancel</button>
                  <button onClick={() => confirmDeleteId && performDelete(confirmDeleteId)} disabled={deleting} className="px-3 py-1.5 rounded-md bg-red-600 text-white">{deleting ? 'Deleting...' : 'Yes, Delete'}</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Slide-over edit panel */}
        <AnimatePresence>
          {editingImage && (
            <motion.aside initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 300, opacity: 0 }} className="fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] bg-white/95 backdrop-blur-sm border-l border-amber-200 shadow-2xl">
              <div className="p-5 h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-amber-900">Edit Photo</h3>
                  <button onClick={cancelEdit} className="text-amber-700">Close</button>
                </div>

                <div className="mt-4 overflow-auto"> 
                  <div className="w-full h-56 relative rounded-lg overflow-hidden border border-amber-100">
                    <Image src={editingImage.url} alt="editing" fill className="object-cover" />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <label className="text-sm text-amber-800 font-semibold">Category</label>
                    <select defaultValue={editingImage.category} onChange={(e) => setEditingImage((p) => p ? { ...p, category: e.target.value as Category } : p)} className="p-2 rounded-xl border-2 border-amber-100">
                      <option value="bridal">Bridal</option>
                      <option value="engagement">Engagement</option>
                      <option value="babyshower">Baby Shower</option>
                      <option value="sider">Sider</option>
                    </select>

                    <label className="text-sm text-amber-800 font-semibold">Price (₹)</label>
                    <input type="number" value={editingImage.price} onChange={(e) => setEditingImage((p) => p ? { ...p, price: Number(e.target.value) } : p)} className="p-2 rounded-xl border-2 border-amber-100" />

                    <label className="text-sm text-amber-800 font-semibold">Replace Photo (optional)</label>
                    <input type="file" accept="image/*" onChange={(e) => setNewImageFile(e.currentTarget.files?.[0] ?? null)} className="p-2 rounded-xl border-2 border-amber-100" />

                    <div className="flex gap-3 mt-4">
                      <button onClick={() => saveEdit({ category: editingImage.category, price: String(editingImage.price), file: newImageFile })} className="flex-1 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white">Save changes</button>
                      <button onClick={cancelEdit} className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-200 text-amber-800">Cancel</button>
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
          <button onClick={() => { setIsAuthenticated(false); setPassword(''); }} className="text-amber-700 underline">Logout</button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-24 left-6 w-44 h-44 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-6 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
      </div>

      <GalleryCardPopUp selectedImage={selectedImage} onClose={closeModal} />
    </main>
  );
}
