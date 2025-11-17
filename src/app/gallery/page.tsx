'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import GalleryCardPopUp from '@/components/GalleryCardPopUp';

interface ImageType {
  _id: string;
  url: string;
  category: 'bridal' | 'engagement' | 'babyshower' | 'sider';
  price: number;
}

const categories = ['bridal', 'engagement', 'babyshower', 'sider'] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } }
};

const cardHoverVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

export default function Gallery() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ImageType['category']>('bridal');
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  useEffect(() => {
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const filteredImages = images.filter((img) => img.category === selectedCategory);

  const handleImageClick = (img: ImageType) => {
    console.log('Image clicked:', img._id);
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen mt-12 flex items-center justify-center bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100"
      >
        <div className="text-center p-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-600 animate-pulse" size={28} />
          </div>
          <p className="mt-4 text-sm text-amber-800 font-medium">Loading gallery...</p>
        </div>
      </motion.div>
    );

  return (
    <>
      <style>{`
        .gallery-card { overflow: hidden; }
        .gallery-image { transition: transform 0.3s ease; }
        .group:hover .gallery-image { transform: scale(1.05); }
      `}</style>

      <main className="min-h-screen mt-12 bg-gradient-to-br from-amber-100 via-orange-50 to-rose-100 relative overflow-x-hidden">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-amber-300 rounded-full px-4 py-2 mb-3 shadow-sm mx-auto">
              <Sparkles className="text-amber-600" size={14} />
              <span className="text-xs text-amber-800 font-medium">Our Designs</span>
            </div>
            <motion.h1 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-amber-900 leading-tight"
            >
              Gallery
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-amber-700 text-xs sm:text-sm max-w-xl mx-auto mt-2"
            >
              Explore our exquisite collection of Mehendi designs across various occasions.
            </motion.p>
          </motion.header>

          {/* Category Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center gap-3 mb-8 flex-wrap"
          >
            {categories.map((cat) => (
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

          {/* Gallery Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filteredImages.map((img, index) => (
              <motion.div
                key={img._id}
                variants={itemVariants}
                whileHover={cardHoverVariants}
                className="gallery-card group bg-white/95 backdrop-blur-sm rounded-2xl shadow-md border border-amber-200 overflow-hidden cursor-pointer"
                onClick={() => handleImageClick(img)}
              >
                <div className="relative h-[22rem] sm:h-[26rem] md:h-[29rem] lg:h-[32rem] bg-amber-50 gallery-image">
                  <Image
                    src={img.url}
                    alt="Mehendi Design"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    draggable={false}
                  />
                </div>

                <div className="p-3 text-center bg-amber-50">
                  <p className="text-lg font-bold text-amber-900">₹{img.price}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {filteredImages.length === 0 && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-amber-700 mt-8 text-lg"
            >
              No images yet. Upload via Admin!
            </motion.p>
          )}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 opacity-10 -z-10">
          <div className="absolute top-20 left-6 w-40 h-40 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-12 right-6 w-56 h-56 bg-orange-400 rounded-full blur-3xl" />
        </div>

        {/* Popup Modal */}
        <GalleryCardPopUp selectedImage={selectedImage} onClose={closeModal} />
      </main>
    </>
  );
}