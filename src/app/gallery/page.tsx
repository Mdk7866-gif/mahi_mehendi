'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import GalleryCardPopUp from '@/components/GalleryCardPopUp';

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
    console.log('Image clicked:', img._id);
    setSelectedImage(img);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading)
    return (
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

      {/* Category Filters */}
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

      {/* Gallery Grid */}
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
            {/* Reduced height by ~20% */}
            <div
              className="relative h-[22rem] sm:h-[26rem] md:h-[29rem] lg:h-[32rem] w-full bg-[#FFF8F0] cursor-pointer"
              onClick={() => handleImageClick(img)}
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

      {/* Popup Modal */}
      <GalleryCardPopUp selectedImage={selectedImage} onClose={closeModal} />
    </div>
  );
}
