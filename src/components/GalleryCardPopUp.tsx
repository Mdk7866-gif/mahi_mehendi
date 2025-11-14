'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageType {
  _id: string;
  url: string;
  category: 'normal' | 'bridal';
  price: number;
}

interface GalleryCardPopUpProps {
  selectedImage: ImageType | null;
  onClose: () => void;
}

export default function GalleryCardPopUp({ selectedImage, onClose }: GalleryCardPopUpProps) {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        onClose();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [selectedImage, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop, not the content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={handleBackdropClick}
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[95vw] max-h-[95vh] bg-white rounded-lg overflow-hidden shadow-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div 
              className={`relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center bg-[#FFF8F0] cursor-zoom-in ${isZoomed ? 'overflow-auto' : ''}`}
              onClick={handleImageClick}
            >
              <motion.div
                animate={{ scale: isZoomed ? 1.5 : 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={selectedImage.url}
                  alt="Mehendi Design Full View"
                  fill
                  className={`object-contain p-4 sm:p-8 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                  priority
                  sizes="95vw"
                  style={{ touchAction: isZoomed ? 'pan-x pan-y' : 'none' }} // Enable panning on mobile when zoomed
                />
              </motion.div>
            </div>

            {/* Zoom Reset Button - Visible only when zoomed */}
            {isZoomed && (
              <button
                onClick={handleCloseZoom}
                className="absolute top-16 right-4 z-10 bg-[#6D4C41]/90 text-white p-2 rounded-full hover:bg-[#3D2817] transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:ring-offset-2"
                aria-label="Reset zoom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            )}

            {/* Price and Category Info */}
            <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto sm:min-w-[200px] bg-[#FFF8F0]/95 backdrop-blur-sm p-4 rounded-lg text-center border border-[#8D6E63]/20 shadow-lg">
              <p className="text-xl sm:text-2xl font-bold text-[#3D2817]">₹{selectedImage.price}</p>
              <p className="text-sm sm:text-base text-[#6D4C41] mt-1 capitalize">
                {selectedImage.category} Mehendi
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-[#6D4C41] text-white p-2 sm:p-3 rounded-full hover:bg-[#3D2817] transition-colors shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#6D4C41] focus:ring-offset-2"
              aria-label="Close modal"
              type="button"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}