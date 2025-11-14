'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageType {
  _id: string;
  url: string;
  category: 'normal' | 'bridal';
  price: number;
}

export default function Gallery() {
  const [images, setImages] = useState<ImageType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'normal' | 'bridal'>('normal');
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
    console.log('Image clicked:', img._id); // Debug: Check console if this logs
    setSelectedImage(img);
  };

  const closeModal = (e?: React.MouseEvent) => {
    if (e && e.target === e.currentTarget) {
      console.log('Modal closed'); // Debug
    }
    setSelectedImage(null);
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <div className="text-[#6D4C41] text-xl font-semibold">Loading gallery...</div>
    </div>
  );

  return (
    <div className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#3D2817] mb-8 sm:mb-12"
      >
        Gallery
      </motion.h1>
      <div className="flex justify-center items-center gap-3 sm:gap-4 mb-8 sm:mb-12 flex-nowrap overflow-x-auto pb-2">
        {(['normal', 'bridal'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base whitespace-nowrap flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#6D4C41] text-white shadow-lg transform scale-105'
                : 'bg-white text-[#6D4C41] border-2 border-[#8D6E63] hover:bg-[#FFF8F0] hover:border-[#6D4C41]'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)} Mehendi
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
        {filteredImages.map((img) => (
          <motion.div
            key={img._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-[#8D6E63]/20 w-full cursor-pointer"
            onClick={() => handleImageClick(img)}
          >
            <div 
              className="relative h-96 sm:h-[28rem] md:h-[32rem] w-full bg-[#FFF8F0] cursor-pointer"
              onClick={() => handleImageClick(img)} // Extra layer for reliability
            >
              <Image 
                src={img.url} 
                alt="Mehendi Design" 
                fill 
                className="object-cover" 
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <div className="p-3 sm:p-4 text-center bg-[#FFF8F0]">
              <p className="text-lg sm:text-xl font-bold text-[#3D2817]">₹{img.price}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {filteredImages.length === 0 && (
        <p className="text-center text-[#6D4C41] mt-8 text-lg">No images yet. Upload via Admin!</p>
      )}

      {/* Full-Screen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-full max-h-full bg-white rounded-lg overflow-hidden shadow-2xl pointer-events-auto" // Ensures clicks inside work
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[80vh] sm:h-[90vh] flex items-center justify-center bg-[#FFF8F0]">
                <Image 
                  src={selectedImage.url} 
                  alt="Mehendi Design Full View" 
                  fill 
                  className="object-contain p-4" 
                  priority
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-64 bg-[#FFF8F0]/90 backdrop-blur-sm p-4 rounded-lg text-center">
                <p className="text-xl font-bold text-[#3D2817]">₹{selectedImage.price}</p>
                <p className="text-sm text-[#6D4C41] mt-1 capitalize">{selectedImage.category} Mehendi</p>
              </div>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-[#6D4C41] text-white p-2 rounded-full hover:bg-[#8D6E63] transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}