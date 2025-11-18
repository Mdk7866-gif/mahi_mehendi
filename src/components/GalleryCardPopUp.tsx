'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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
  if (url.includes('cloudinary.com')) {
    if (url.includes('/upload/')) {
      const uploadIndex = url.indexOf('/upload/');
      const afterUpload = url.substring(uploadIndex + 8);
      const hasTransformations = /^[vcwqfl]/i.test(afterUpload);
      
      if (!hasTransformations) {
        return url.replace('/upload/', `/upload/w_${width},q_auto:good,f_auto/`);
      } else {
        if (!url.includes('q_auto') && !url.includes('q_')) {
          return url.replace('/upload/', `/upload/q_auto:good,f_auto/`);
        }
      }
    }
  }
  return url;
}

export default function GalleryCardPopUp({ selectedImage, onClose }: GalleryCardPopUpProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const lastPan = useRef<{ x: number; y: number } | null>(null);
  const isPanning = useRef(false);
  

  const MIN_SCALE = 1;
  const MAX_SCALE = 3;

  // Close on ESC and prevent body scroll
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

  const getTouchDistance = (t1: Touch, t2: Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.hypot(dx, dy);
  };

  const getTouchCenter = (t1: Touch, t2: Touch) => {
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  };

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

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
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

  const handleZoomIn = () => {
    const nextScale = Math.min(MAX_SCALE, scale + 0.5);
    setScale(nextScale);
    setIsZoomed(nextScale > 1);
  };

  const handleZoomOut = () => {
    const nextScale = Math.max(MIN_SCALE, scale - 0.5);
    setScale(nextScale);
    setIsZoomed(nextScale > 1);
    if (nextScale === 1) {
      setTranslate({ x: 0, y: 0 });
    }
  };

  const handleResetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const prevent = (e: Event) => e.preventDefault();
    container.addEventListener('dragstart', prevent);
    return () => container.removeEventListener('dragstart', prevent);
  }, []);

  if (!selectedImage) return null;

  const categoryLabels: Record<string, string> = {
    bridal: 'Bridal',
    engagement: 'Engagement',
    babyshower: 'Baby Shower',
    sider: 'Sider'
  };

  return (
    <AnimatePresence>
      {selectedImage && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key={`modal-content-${selectedImage._id}`}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            className="relative w-full h-full max-w-7xl max-h-[95vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/70 to-transparent p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-600 p-2 rounded-lg">
                  <span className="text-white font-bold text-sm">
                    {categoryLabels[selectedImage.category]} Mehendi
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full transition-all"
                aria-label="Close modal"
              >
                <X size={24} />
              </motion.button>
            </motion.div>

            {/* Image Container */}
            <div className="relative w-full h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl overflow-hidden shadow-2xl">
              <div
                ref={containerRef}
                className={`relative w-full h-full flex items-center justify-center ${
                  isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                }`}
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
                style={{ touchAction: isZoomed ? 'none' : 'manipulation' }}
              >
                <motion.div
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                    transition: 'transform 0.05s linear',
                    willChange: 'transform',
                  }}
                >
                  <Image
                    src={getOptimizedImageUrl(selectedImage.url, 1920)}
                    alt={`${categoryLabels[selectedImage.category]} Mehendi Design`}
                    fill
                    className="object-contain p-2 sm:p-4 md:p-8 select-none"
                    priority
                    sizes="95vw"
                    quality={90}
                    style={{ pointerEvents: 'none' }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Bottom Info Bar */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/70 to-transparent p-4"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Price Info */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white/80 text-sm">Starting from</span>
                    <span className="text-amber-400 text-2xl font-bold">₹{selectedImage.price}</span>
                  </div>
                </motion.div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomOut}
                    disabled={scale <= MIN_SCALE}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom out"
                  >
                    <ZoomOut size={20} />
                  </motion.button>

                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                    <span className="text-white text-sm font-medium">
                      {Math.round(scale * 100)}%
                    </span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleZoomIn}
                    disabled={scale >= MAX_SCALE}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Zoom in"
                  >
                    <ZoomIn size={20} />
                  </motion.button>

                  {isZoomed && (
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleResetZoom}
                      className="bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-full transition-all ml-2"
                      aria-label="Reset zoom"
                    >
                      <Maximize2 size={20} />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Mobile Zoom Hint */}
            {!isZoomed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm"
                >
                  Pinch or scroll to zoom
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}