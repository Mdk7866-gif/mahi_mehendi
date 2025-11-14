'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ category: 'normal' as const, price: '' });
  const [message, setMessage] = useState('');

  const handleAuth = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === '174216') { // Fallback for client
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
    const data = new FormData();
    const fileInput = (form.elements.namedItem('image') as HTMLInputElement)?.files?.[0];
    
    if (!fileInput) {
      setMessage('Please select an image file');
      setUploading(false);
      return;
    }

    data.append('image', fileInput);
    data.append('category', formData.category);
    data.append('price', formData.price);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: data });
      const result = await res.json();
      
      if (res.ok) {
        setMessage('Image uploaded successfully!');
        form.reset();
        setFormData({ category: 'normal', price: '' });
      } else {
        setMessage(result.error || 'Upload failed. Please try again.');
      }
    } catch (error: any) {
      setMessage(error.message || 'Error uploading. Please check your connection and try again.');
    }
    setUploading(false);
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
            onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
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
    <div className="py-16 sm:py-20 px-4 sm:px-6 max-w-md mx-auto w-full overflow-x-hidden">
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
            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
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
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
            message.includes('success') 
              ? 'text-[#3D2817] bg-[#FFF8F0] border border-[#8D6E63]/30' 
              : 'text-red-600 bg-red-50 border border-red-200'
          }`}
        >
          {message}
        </motion.p>
      )}
      <button
        onClick={() => { setIsAuthenticated(false); setPassword(''); }}
        className="mt-6 w-full text-[#6D4C41] hover:text-[#3D2817] font-semibold underline transition-colors"
      >
        Logout
      </button>
    </div>
  );
}