'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Category = 'normal' | 'bridal';

export default function Admin(): React.ReactElement {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<{ category: Category; price: string }>({
    category: 'normal',
    price: '',
  });
  const [message, setMessage] = useState('');
  interface ImageType { _id: string; url: string; category: Category; price: number }
  const [images, setImages] = useState<ImageType[]>([]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'normal' | 'bridal'>('normal');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ category: Category; price: string }>({ category: 'normal', price: '' });
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
        setFormData({ category: 'normal', price: '' });
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
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full border border-[#8D6E63]/20"
        >
          <h2 className="text-2xl font-bold text-center text-[#3D2817] mb-6">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAuth()}
            className="w-full p-3 border-2 border-[#8D6E63]/30 rounded-md mb-4 focus:border-[#6D4C41] focus:outline-none text-[#3D2817] placeholder:text-[#8D6E63]"
          />
          <button
            onClick={handleAuth}
            className="w-full bg-[#6D4C41] text-white py-3 rounded-md hover:bg-[#3D2817] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
          >
            Enter
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 max-w-5xl mx-auto w-full overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#3D2817] mb-6 sm:mb-8"
      >
        Admin Panel
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-5 sm:p-6 md:p-8 rounded-lg shadow-xl border border-[#8D6E63]/20 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4">
          <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Select Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            className="w-full p-2 sm:p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#FFF8F0] file:text-[#6D4C41] hover:file:bg-[#8D6E63]/10 cursor-pointer text-sm sm:text-base"
          />
        </div>

        <div className="mb-4">
          <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Category</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: (e.target as HTMLSelectElement).value as Category })
            }
            className="w-full p-2 sm:p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] bg-white text-sm sm:text-base"
          >
            <option value="normal">Normal Mehendi</option>
            <option value="bridal">Bridal Mehendi</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-[#6D4C41] font-semibold mb-2 text-sm sm:text-base">Price (₹)</label>
          <input
            type="number"
            placeholder="Enter price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: (e.target as HTMLInputElement).value })}
            required
            min="0"
            step="0.01"
            className="w-full p-2 sm:p-3 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41] focus:outline-none text-[#3D2817] placeholder:text-[#8D6E63] text-sm sm:text-base"
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-[#6D4C41] text-white py-2 sm:py-3 rounded-md hover:bg-[#3D2817] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </motion.form>

      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-4 text-center font-semibold p-3 rounded-md ${
            message.toLowerCase().includes('success')
              ? 'text-[#3D2817] bg-[#FFF8F0] border border-[#8D6E63]/30'
              : 'text-red-600 bg-red-50 border border-red-200'
          }`}
        >
          {message}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl sm:text-2xl font-bold text-[#3D2817] mt-10 mb-4"
      >
        Uploaded Images
      </motion.h2>

      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-6">
        {(['normal', 'bridal'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
              selectedCategory === cat
                ? 'bg-[#6D4C41] text-white shadow-lg transform scale-105'
                : 'bg-white text-[#6D4C41] border-2 border-[#8D6E63] hover:bg-[#FFF8F0] hover:border-[#6D4C41]'
            }`}
          >
            {cat === 'normal' ? 'Normal Mehendi' : 'Bridal Mehendi'}
          </button>
        ))}
      </div>

      {loadingImages ? (
        <div className="text-[#6D4C41]">Loading images...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((img) => (
            <motion.div
              key={img._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-[#8D6E63]/20"
            >
              <div className="relative h-64 w-full bg-[#FFF8F0]">
                <Image
                  src={img.url}
                  alt="Mehendi"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <div className="p-3 sm:p-4 flex items-center justify-between bg-[#FFF8F0]">
                <span className="text-sm font-medium text-[#6D4C41]">{img.category === 'normal' ? 'Normal' : 'Bridal'}</span>
                <span className="text-lg font-bold text-[#3D2817]">₹{img.price}</span>
              </div>
              {editingId === img._id ? (
                <div className="p-4 border-t border-[#8D6E63]/20 bg-white">
                  <div className="mb-3">
                    <label className="block text-[#6D4C41] font-semibold mb-1 text-sm">Category</label>
                    <select
                      value={editData.category}
                      onChange={(e) => setEditData({ ...editData, category: (e.target as HTMLSelectElement).value as Category })}
                      className="w-full p-2 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41]"
                    >
                      <option value="normal">Normal Mehendi</option>
                      <option value="bridal">Bridal Mehendi</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="block text-[#6D4C41] font-semibold mb-1 text-sm">Price (₹)</label>
                    <input
                      type="number"
                      value={editData.price}
                      onChange={(e) => setEditData({ ...editData, price: (e.target as HTMLInputElement).value })}

                      min="0"
                      step="0.01"
                      className="w-full p-2 border-2 border-[#8D6E63]/30 rounded-md focus:border-[#6D4C41]"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-[#6D4C41] font-semibold mb-1 text-sm">Replace Photo (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewImageFile(e.currentTarget.files?.[0] ?? null)}
                      className="w-full p-2 border-2 border-[#8D6E63]/30 rounded-md"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={saveEdit} className="px-4 py-2 bg-[#6D4C41] text-white rounded-md hover:bg-[#3D2817]">Save</button>
                    <button onClick={cancelEdit} className="px-4 py-2 bg-gray-200 text-[#3D2817] rounded-md hover:bg-gray-300">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-4 flex items-center justify-end gap-3 bg-white border-t border-[#8D6E63]/20">
                  <button onClick={() => startEdit(img)} className="px-3 py-1.5 bg-[#6D4C41] text-white rounded-md text-sm hover:bg-[#3D2817]">Edit</button>
                  <button onClick={() => confirmDelete(img._id)} className="px-3 py-1.5 bg-red-600 text-white rounded-md text-sm hover:bg-red-700">Delete</button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-[#8D6E63]/20"
          >
            <h3 className="text-lg font-semibold text-[#3D2817] mb-3">Confirm delete</h3>
            <p className="text-sm text-[#6D4C41] mb-6">Are you sure you want to delete this image? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-100 text-[#3D2817] rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDeleteId && performDelete(confirmDeleteId)}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <button
        onClick={() => {
          setIsAuthenticated(false);
          setPassword('');
        }}
        className="mt-6 w-full text-[#6D4C41] hover:text-[#3D2817] font-semibold underline transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
