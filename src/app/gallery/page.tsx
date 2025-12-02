'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ImageIcon } from 'lucide-react';
import GalleryCardPopUp from '@/components/GalleryCardPopUp';

interface ImageType {
  _id: string;
  url: string;
  category: 'bridal' | 'engagement' | 'babyshower' | 'sider' | 'karwa chauth';
  price: number;
}

const categories = [
  { id: 'bridal', label: 'Bridal', icon: '👰' },
  { id: 'engagement', label: 'Engagement', icon: '💍' },
  { id: 'babyshower', label: 'Baby Shower', icon: '🍼' },
  { id: 'sider', label: 'Sider', icon: '✨' },
  { id: 'karwa chauth', label: 'Karwa Chauth', icon: '🌙' }
] as const;

// keep animations subtle
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
};
const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.32 } }
};

function getOptimizedImageUrl(url: string, width: number) {
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    const prefix = url.split('/upload/')[0];
    const rest = url.split('/upload/')[1];
    // Check if transformations already exist
    if (!/q_auto|f_auto|w_/.test(rest)) {
      // Use smaller widths for thumbnails, auto quality, and WebP format
      return `${prefix}/upload/w_${width},q_auto:low,f_auto,dpr_auto/${rest}`;
    }
  }
  return url;
}

export default function Gallery(): React.ReactElement {
  const [images, setImages] = useState<ImageType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ImageType['category']>('bridal');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Prefetch images API for faster loading
    const controller = new AbortController();
    
    // Start fetch immediately without delay
    fetch('/api/images', { 
      signal: controller.signal,
      cache: 'no-store'
    })
      .then((r) => r.json())
      .then((data) => {
        setImages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setImages([]);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => images.filter(i => i.category === selectedCategory), [images, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen mt-12 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100">
        <div className="text-center p-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-amber-600 mx-auto" />
            <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600" size={24} />
          </div>
          <p className="mt-4 text-sm text-amber-800">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-200 rounded-full px-4 py-2 shadow-sm mx-auto">
            <ImageIcon className="text-amber-600" size={16} />
            <span className="text-sm text-amber-800 font-medium">Our Designs</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-amber-900">Gallery</h1>
          <p className="mt-2 text-amber-700 text-sm sm:text-base max-w-2xl mx-auto">Explore our curated Mehendi designs across occasions.</p>
        </header>

        {/* filters */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedCategory === cat.id ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow' : 'bg-white/90 border border-amber-200 text-amber-800'}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* grid: compact cards like Admin */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-block mb-4 bg-amber-100 p-6 rounded-full">
              <ImageIcon size={40} className="text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold text-amber-900">No designs yet</h3>
            <p className="text-amber-700 text-sm mt-2">No {selectedCategory} images available — check back soon.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={selectedCategory} variants={containerVariants} initial="hidden" animate="visible" exit={{ opacity: 0 }} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((img) => (
                <motion.div key={img._id} variants={itemVariants} whileHover={{ scale: 1.02 }} className="group bg-white/95 rounded-2xl shadow-sm border border-amber-200 overflow-hidden cursor-pointer">

                  {/* compact image height (like Admin) */}
                  <div className="relative h-44 sm:h-40 bg-amber-50" onClick={() => setSelectedImage(img)}>
                    {!loaded[img._id] && (
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100" />
                    )}

                    <Image
                      src={getOptimizedImageUrl(img.url, 400)}
                      alt={`${img.category} mehendi`}
                      fill
                      className={`object-cover transition-transform duration-500 group-hover:scale-110 ${loaded[img._id] ? 'opacity-100' : 'opacity-0'}`}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      quality={75}
                      onLoad={() => setLoaded(prev => ({ ...prev, [img._id]: true }))}
                    />
                  </div>

                  <div className="p-3 bg-amber-50 flex items-center justify-between">
                    <div className="text-sm text-amber-700 capitalize">{img.category}</div>
                    <div className="text-amber-900 font-bold">₹{img.price}</div>
                  </div>

                  <div className="p-3 bg-white border-t border-amber-100 flex items-center justify-end gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setSelectedImage(img); }} className="px-2 py-1 rounded-md bg-amber-600 text-white text-xs font-semibold">View</button>
                    <a href={`/contact`} className="px-2 py-1 rounded-md bg-white border border-amber-200 text-amber-800 text-xs font-semibold">Book</a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

      </div>

      {/* background decor (subtle) */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-8">
        <div className="absolute top-24 left-8 w-48 h-48 bg-amber-400 rounded-full blur-3xl" />
        <div className="absolute bottom-16 right-8 w-72 h-72 bg-orange-400 rounded-full blur-3xl" />
      </div>

      <GalleryCardPopUp selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
    </main>
  );
}
