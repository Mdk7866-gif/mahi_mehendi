'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

type Category = 'bridal' | 'engagement' | 'babyshower' | 'sider';

export default function Admin(): React.ReactElement {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<{ category: Category; price: string }>({
    category: 'bridal',
    price: '',
  });
  const [message, setMessage] = useState('');
  interface ImageType { _id: string; url: string; category: Category; price: number }
  const [images, setImages] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('bridal');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ category: Category; price: string }>({ category: 'bridal', price: '' });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // confirmation modal state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoadingImages(false);
      })
      .catch(() => setLoadingImages(false));
  }, []);

  const filteredImages = images.filter((i) => i.category === selectedCategory);

  const startEdit = (img: ImageType) => {
    setEditingId(img._id);
    setEditData({ category: img.category, price: String(img.price) });
    setNewImageFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setNewImageFile(null);
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const form = new FormData();
    form.append('category', editData.category);
    form.append('price', editData.price);
    if (newImageFile) form.append('image', newImageFile);
    const res = await fetch(`/api/images/${editingId}`, { method: 'PUT', body: form });
    const result = await res.json();
    if (res.ok && result?.image?._id) {
      setImages((prev) => prev.map((p) => (p._id === result.image._id ? result.image : p)));
      cancelEdit();
      setMessage('Updated successfully');
    } else {
      setMessage(result?.error || 'Update failed');
    }
  };

  // call this when Delete is confirmed in modal
  const performDelete = async (id: string) => {
    setDeleting(true);
    setMessage('');
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok) {
        setImages((prev) => prev.filter((p) => p._id !== id));
        setMessage('Deleted successfully');
      } else {
        setMessage(result?.error || 'Delete failed');
      }
    } catch (err) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage('Error deleting image');
    } finally {
      setDeleting(false);
      setConfirmDeleteId(null);
    }
  };

  // open confirmation modal
  const confirmDelete = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleAuth = () => {
    // Use NEXT_PUBLIC env var on the client; fallback password for convenience
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === '174216') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const form = e.currentTarget;
    // elements.namedItem returns Element | null. Cast safely to HTMLInputElement | null
    const fileElement = form.elements.namedItem('image') as HTMLInputElement | null;
    const fileInput = fileElement?.files?.[0];

    if (!fileInput) {
      setMessage('Please select an image file');
      setUploading(false);
      return;
    }

    const data = new FormData();
    data.append('image', fileInput);
    data.append('category', formData.category);
    data.append('price', formData.price);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = (await res.json()) as Record<string, unknown>;

      if (res.ok) {
        setMessage('Image uploaded successfully!');
        form.reset();
        setFormData({ category: 'bridal', price: '' });
        const uploaded = result && typeof result === 'object' ? (result['image'] as ImageType | undefined) : undefined;
        if (uploaded && uploaded._id) {
          setImages((prev) => [uploaded, ...prev]);
        }
      } else {
        const err = result && typeof result === 'object' ? (result['error'] as string | undefined) : undefined;
        setMessage(err || 'Upload failed. Please try again.');
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Error uploading. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-sm w-full border border-amber-200"
        >
          <div className="text-center mb-6">
            <Sparkles className="mx-auto text-amber-600" size={32} />
            <h2 className="text-2xl font-bold text-amber-900 mt-2">Admin Access</h2>
          </div>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            className="w-full p-3 border-2 border-amber-200 rounded-2xl mb-4 focus:border-amber-400 focus:outline-none text-amber-900 placeholder:text-amber-500 text-base"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAuth}
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all"
          >
            Enter
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <>
      <style>{`
        .admin-card { overflow: hidden; }
        .admin-image { transition: transform 0.3s ease; }
        .group:hover .admin-image { transform: scale(1.05); }
      `}</style>

      <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-full px-4 py-2 mb-3 shadow-sm mx-auto">
              <Sparkles className="text-amber-600" size={14} />
              <span className="text-xs text-amber-800 font-medium">Admin Panel</span>
            </div>
            <motion.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-900 leading-tight"
            >
              Manage Gallery
            </motion.h1>
          </motion.header>

          <motion.form
            onSubmit={handleSubmit}
            className="bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-md border border-amber-200 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Select Image *</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer text-base"
              />
            </div>

            <div className="mb-4">
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Category *</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: (e.target as HTMLSelectElement).value as Category })
                }
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 bg-white text-base"
              >
                <option value="bridal">Bridal Mehendi</option>
                <option value="engagement">Engagement Mehendi</option>
                <option value="babyshower">Baby Shower Mehendi</option>
                <option value="sider">Sider Mehendi</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-amber-900 font-semibold mb-2 text-sm sm:text-base">Price (₹) *</label>
              <input
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: (e.target as HTMLInputElement).value })}
                required
                min="0"
                step="0.01"
                className="w-full p-3 border-2 border-amber-200 rounded-2xl focus:border-amber-400 focus:outline-none text-amber-900 placeholder:text-amber-500 text-base"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={uploading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-2xl font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </motion.button>
          </motion.form>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center font-semibold p-3 rounded-2xl mb-6 ${
                message.toLowerCase().includes('success')
                  ? 'text-amber-900 bg-amber-50 border border-amber-200'
                  : 'text-red-600 bg-red-50 border border-red-200'
              }`}
            >
              {message}
            </motion.p>
          )}

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xl sm:text-2xl font-bold text-amber-900 mb-4"
          >
            Uploaded Images
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center gap-3 mb-8 flex-wrap"
          >
            {(['bridal', 'engagement', 'babyshower', 'sider'] as Category[]).map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full font-semibold transition-all text-sm ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                    : 'bg-white/80 backdrop-blur-sm text-amber-700 border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)} Mehendi
              </motion.button>
            ))}
          </motion.div>

          {loadingImages ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center items-center py-8"
            >
              <div className="text-amber-700">Loading images...</div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filteredImages.map((img) => (
                <motion.div
                  key={img._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="admin-card group bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200 overflow-hidden"
                >
                  <div className="relative h-64 bg-amber-50 admin-image">
                    <Image
                      src={img.url}
                      alt="Mehendi"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <div className="p-4 flex items-center justify-between bg-amber-50">
                    <span className="text-sm font-medium text-amber-700 capitalize">{img.category}</span>
                    <span className="text-lg font-bold text-amber-900">₹{img.price}</span>
                  </div>
                  {editingId === img._id ? (
                    <div className="p-4 border-t border-amber-200 bg-white">
                      <div className="mb-3">
                        <label className="block text-amber-900 font-semibold mb-1 text-sm">Category</label>
                        <select
                          value={editData.category}
                          onChange={(e) => setEditData({ ...editData, category: (e.target as HTMLSelectElement).value as Category })}
                          className="w-full p-2 border-2 border-amber-200 rounded-xl focus:border-amber-400"
                        >
                          <option value="bridal">Bridal Mehendi</option>
                          <option value="engagement">Engagement Mehendi</option>
                          <option value="babyshower">Baby Shower Mehendi</option>
                          <option value="sider">Sider Mehendi</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="block text-amber-900 font-semibold mb-1 text-sm">Price (₹)</label>
                        <input
                          type="number"
                          value={editData.price}
                          onChange={(e) => setEditData({ ...editData, price: (e.target as HTMLInputElement).value })}
                          min="0"
                          step="0.01"
                          className="w-full p-2 border-2 border-amber-200 rounded-xl focus:border-amber-400"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="block text-amber-900 font-semibold mb-1 text-sm">Replace Photo (optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewImageFile(e.currentTarget.files?.[0] ?? null)}
                          className="w-full p-2 border-2 border-amber-200 rounded-xl"
                        />
                      </div>
                      <div className="flex gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={saveEdit} 
                          className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold"
                        >
                          Save
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={cancelEdit} 
                          className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl font-semibold hover:bg-amber-200"
                        >
                          Cancel
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex items-center justify-end gap-3 bg-white border-t border-amber-200">
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => startEdit(img)} 
                        className="px-3 py-1.5 bg-amber-600 text-white rounded-xl text-sm font-semibold hover:bg-amber-700"
                      >
                        Edit
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => confirmDelete(img._id)} 
                        className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700"
                      >
                        Delete
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Confirmation Modal */}
          {confirmDeleteId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
              onClick={(e) => e.target === e.currentTarget && setConfirmDeleteId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-6 border border-amber-200"
              >
                <h3 className="text-lg font-semibold text-amber-900 mb-3">Confirm Delete</h3>
                <p className="text-sm text-amber-700 mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
                <div className="flex justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={deleting}
                    className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 font-semibold"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmDeleteId && performDelete(confirmDeleteId)}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 font-semibold"
                  >
                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsAuthenticated(false);
              setPassword('');
            }}
            className="mt-6 w-full text-amber-700 hover:text-amber-900 font-semibold underline transition-colors text-base"
          >
            Logout
          </motion.button>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-6 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-12 right-6 w-56 h-56 bg-orange-400 rounded-full blur-3xl" />
        </div>
      </main>
    </>
  );
}