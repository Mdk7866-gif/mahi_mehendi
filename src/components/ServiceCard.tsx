'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CheckCircle2, Eye } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  alt: string;
  ctaText: string;
  ctaLink: string;
  price?: string;
  onImageClick: (src: string) => void;
}

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 } // removed 'ease' string
    }
  };
  

export default function ServiceCard({
  id,
  title,
  description,
  features,
  image,
  alt,
  ctaText,
  ctaLink,
  price,
  onImageClick
}: ServiceCardProps): React.ReactElement {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{ y: -4 }}
      className="group bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200/50 overflow-hidden hover:shadow-xl transition-all duration-300"
      aria-labelledby={`service-${id}-title`}
    >
      {/* Image Section */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden bg-amber-50">
        <motion.div
          className="relative w-full h-full cursor-pointer"
          onClick={() => onImageClick(image)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        >
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
            quality={80}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              className="bg-white/90 backdrop-blur-sm rounded-full p-3"
            >
              <Eye className="text-amber-600" size={24} />
            </motion.div>
          </div>
        </motion.div>

        {/* Price Badge */}
        {price && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute top-3 right-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-lg"
          >
            {price}
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          id={`service-${id}-title`}
          className="text-lg sm:text-xl font-bold text-amber-900 mb-2"
        >
          {title}
        </motion.h3>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-700 leading-relaxed mb-4"
        >
          {description}
        </motion.p>

        {/* Features */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5"
          aria-label={`${title} features`}
        >
          {features.map((feature, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-center gap-2 text-xs sm:text-sm text-amber-800"
              whileHover={{ x: 3 }}
            >
              <CheckCircle2 size={16} className="text-amber-600 flex-shrink-0" />
              <span className="truncate">{feature}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Link
              href={ctaLink}
              prefetch={true}
              className="w-full inline-flex items-center justify-center text-sm sm:text-base bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-5 py-2.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all"
            >
              {ctaText}
            </Link>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }}
            className="flex-1"
          >
            <Link
              href="/gallery"
              prefetch={true}
              className="w-full inline-flex items-center justify-center text-sm sm:text-base text-amber-700 hover:text-amber-900 border-2 border-amber-300 hover:border-amber-400 bg-white hover:bg-amber-50 px-5 py-2.5 rounded-full font-semibold transition-all"
            >
              View Gallery
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.article>
  );
}