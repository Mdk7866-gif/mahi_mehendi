'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ImageType {
  _id: string;
  url: string;
  category: 'bridal' | 'engagement' | 'babyshower' | 'sider';
  price: number;
}

interface GalleryCardPopUpProps {
  selectedImage: ImageType | null;
  onClose: () => void;
}

// Helper function to get optimized Cloudinary image URL
function getOptimizedImageUrl(url: string, width: number): string {
  // If it's already a Cloudinary URL, add transformation
  if (url.includes('cloudinary.com')) {
    // Check if URL already has transformations (contains /upload/v or /upload/c or /upload/w etc)
    if (url.includes('/upload/')) {
      const uploadIndex = url.indexOf('/upload/');
      const afterUpload = url.substring(uploadIndex + 8); // +8 for '/upload/'
      
      // Check if transformations already exist (starts with v, c, w, etc.)
      const hasTransformations = /^[vcwqfl]/i.test(afterUpload);
      
      if (!hasTransformations) {
        // No transformations exist, add them
        return url.replace('/upload/', `/upload/w_${width},q_auto:good,f_auto/`);
      } else {
        // Transformations exist, replace or append width if needed
        // For simplicity, just ensure quality and format are set
        if (!url.includes('q_auto') && !url.includes('q_')) {
          return url.replace('/upload/', `/upload/q_auto:good,f_auto/`);
        }
      }
    }
  }
  return url;
}

export default function GalleryCardPopUp({ selectedImage, onClose }: GalleryCardPopUpProps) {
  // Zoom & pan state (initial values will be used on mount; remount when selectedImage._id changes)
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  // Refs for gesture math
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const lastPan = useRef<{ x: number; y: number } | null>(null);
  const isPanning = useRef(false);
  const lastClick = useRef<number>(0);

  // Limits
  const MIN_SCALE = 1;
  const MAX_SCALE = 3;

  // Close modal on ESC key and prevent body scroll while open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        onClose();
      }
    };

    if (selectedImage) {
      document.addEventListener('keydown', handleEscape);
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [selectedImage, onClose]);

  // Helpers: distance & center between two touches (DOM Touch)
  const getTouchDistance = (t1: Touch, t2: Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };
  const getTouchCenter = (t1: Touch, t2: Touch) => {
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  };

  // Clamp translate so user can't pan the image far outside viewport (basic bounds)
  const clampTranslate = (tx: number, ty: number, currentScale = scale) => {
    const container = containerRef.current;
    if (!container) return { x: tx, y: ty };

    const cw = container.clientWidth;
    const ch = container.clientHeight;

    const maxX = Math.max(0, (currentScale - 1) * cw / 2 + 40);
    const maxY = Math.max(0, (currentScale - 1) * ch / 2 + 40);

    return {
      x: Math.max(-maxX, Math.min(maxX, tx)),
      y: Math.max(-maxY, Math.min(maxY, ty)),
    };
  };

  // Touch handlers (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // cast React.Touch to DOM Touch safely
      const t0 = e.touches[0] as unknown as Touch;
      const t1 = e.touches[1] as unknown as Touch;
      const d = getTouchDistance(t0, t1);
      lastTouchDistance.current = d;
      lastTouchCenter.current = getTouchCenter(t0, t1);
    } else if (e.touches.length === 1) {
      isPanning.current = true;
      const t = e.touches[0] as unknown as Touch;
      lastPan.current = { x: t.clientX, y: t.clientY };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current != null && lastTouchCenter.current) {
      const t0 = e.touches[0] as unknown as Touch;
      const t1 = e.touches[1] as unknown as Touch;
      const newD = getTouchDistance(t0, t1);
      const newCenter = getTouchCenter(t0, t1);

      const ratio = newD / lastTouchDistance.current;
      let nextScale = scale * ratio;
      nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));

      const container = containerRef.current;
      if (container) {
        const rect = container.getBoundingClientRect();
        const originX = newCenter.x - rect.left;
        const originY = newCenter.y - rect.top;

        const oldScale = scale;
        const oldTranslate = translate;
        const newTranslateX = originX + (oldTranslate.x - originX) * (nextScale / oldScale);
        const newTranslateY = originY + (oldTranslate.y - originY) * (nextScale / oldScale);

        const clamped = clampTranslate(newTranslateX, newTranslateY, nextScale);
        setTranslate(clamped);
      }

      setScale(nextScale);
      setIsZoomed(nextScale > 1);

      lastTouchDistance.current = newD;
      lastTouchCenter.current = newCenter;
    } else if (e.touches.length === 1 && isPanning.current && lastPan.current) {
      const t = e.touches[0] as unknown as Touch;
      const dx = t.clientX - lastPan.current.x;
      const dy = t.clientY - lastPan.current.y;

      const next = clampTranslate(translate.x + dx, translate.y + dy);
      setTranslate(next);
      lastPan.current = { x: t.clientX, y: t.clientY };
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      lastTouchDistance.current = null;
      lastTouchCenter.current = null;
    }
    if (e.touches.length === 0) {
      isPanning.current = false;
      lastPan.current = null;
    }
  };

  // Mouse handlers (desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPanning.current = true;
    lastPan.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).style.cursor = 'grabbing';
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isPanning.current || !lastPan.current) return;
    const dx = e.clientX - lastPan.current.x;
    const dy = e.clientY - lastPan.current.y;
    const next = clampTranslate(translate.x + dx, translate.y + dy);
    setTranslate(next);
    lastPan.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = (e: React.MouseEvent) => {
    isPanning.current = false;
    lastPan.current = null;
    (e.target as HTMLElement).style.cursor = 'auto';
  };

  // Wheel zoom (desktop)
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const zoomFactor = delta > 0 ? 1.08 : 0.92;
    const nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * zoomFactor));

    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      const oldScale = scale;
      const newTranslateX = cursorX + (translate.x - cursorX) * (nextScale / oldScale);
      const newTranslateY = cursorY + (translate.y - cursorY) * (nextScale / oldScale);

      const clamped = clampTranslate(newTranslateX, newTranslateY, nextScale);
      setTranslate(clamped);
    }

    setScale(nextScale);
    setIsZoomed(nextScale > 1);
  };

  // Double-tap/double-click to toggle zoom
  const onDouble = (clientX?: number, clientY?: number) => {
    const now = Date.now();
    if (now - lastClick.current < 300) {
      const nextScale = scale > 1 ? 1 : 2;
      if (clientX != null && clientY != null && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const originX = clientX - rect.left;
        const originY = clientY - rect.top;
        const oldScale = scale || 1;

        const newTranslateX = originX + (translate.x - originX) * (nextScale / oldScale);
        const newTranslateY = originY + (translate.y - originY) * (nextScale / oldScale);

        setTranslate(clampTranslate(newTranslateX, newTranslateY, nextScale));
      } else {
        setTranslate({ x: 0, y: 0 });
      }
      setScale(nextScale);
      setIsZoomed(nextScale > 1);
    }
    lastClick.current = now;
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    onDouble(e.clientX, e.clientY);
  };

  const handleCloseZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  // Prevent right-click drag selecting text etc.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const prevent = (e: Event) => e.preventDefault();
    container.addEventListener('dragstart', prevent);
    return () => container.removeEventListener('dragstart', prevent);
  }, []);

  if (!selectedImage) return null;

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 image-modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {/* NOTE: key uses selectedImage._id so modal remounts when image changes (resets local state) */}
          <motion.div
            key={`modal-content-${selectedImage._id}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-[95vw] max-h-[95vh] bg-white rounded-2xl overflow-hidden shadow-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Container */}
            <div
              ref={containerRef}
              className={`relative w-full h-[85vh] sm:h-[90vh] flex items-center justify-center bg-amber-50 ${isZoomed ? 'overflow-auto touch-pan-y' : ''}`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={() => {
                isPanning.current = false;
                lastPan.current = null;
              }}
              onWheel={onWheel}
              onClick={handleContainerClick}
              style={{ touchAction: isZoomed ? 'none' : 'manipulation' }}
            >
              <motion.div
                className="relative w-full h-full flex items-center justify-center"
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transition: 'transform 0.05s linear',
                  willChange: 'transform',
                }}
                onDoubleClick={() => onDouble()}
              >
                <Image
                  src={getOptimizedImageUrl(selectedImage.url, 1920)}
                  alt="Mehendi Design Full View"
                  fill
                  className="object-contain p-4 sm:p-8 select-none"
                  priority
                  sizes="95vw"
                  quality={90}
                  style={{ pointerEvents: 'none' }}
                />
              </motion.div>
            </div>

            {/* Zoom Reset Button - Visible only when zoomed */}
            {isZoomed && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCloseZoom}
                className="absolute top-4 right-4 z-10 bg-amber-600/90 hover:bg-amber-700 text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all"
                aria-label="Reset zoom"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </motion.button>
            )}

            {/* Price and Category Info */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto sm:min-w-[200px] bg-white/95 backdrop-blur-sm p-4 rounded-xl text-center border border-amber-200 shadow-lg"
            >
              <p className="text-xl font-bold text-amber-900">₹{selectedImage.price}</p>
              <p className="text-sm text-amber-700 mt-1 capitalize">
                {selectedImage.category} Mehendi
              </p>
            </motion.div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-amber-600 hover:bg-amber-700 text-white p-2 sm:p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2 transition-all"
              aria-label="Close modal"
              type="button"
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}