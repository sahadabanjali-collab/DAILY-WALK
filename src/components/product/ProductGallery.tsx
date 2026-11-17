import React, { useState } from 'react';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productName }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentImage = images[selectedImageIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="space-y-4">
      {/* Main Display Image */}
      <div
        className="relative aspect-square w-full bg-[#F7F7F7] rounded-2xl overflow-hidden border border-[#E5E5E5] flex items-center justify-center p-6 cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={currentImage}
          alt={productName}
          decoding="async"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.failed) {
              target.dataset.failed = 'true';
              target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75';
            }
          }}
          className={`max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                }
              : undefined
          }
        />

        <span className="absolute bottom-3 right-3 text-[10px] font-bold text-[#777777] bg-white/80 px-2 py-1 rounded-md backdrop-blur-xs pointer-events-none hidden sm:block">
          Hover to zoom
        </span>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`aspect-square rounded-xl bg-[#F7F7F7] p-2 border-2 overflow-hidden flex items-center justify-center transition-all ${
                selectedImageIndex === idx
                  ? 'border-[#E53935] shadow-sm scale-102'
                  : 'border-[#E5E5E5] hover:border-gray-400 opacity-80 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.dataset.failed) {
                    target.dataset.failed = 'true';
                    target.src = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=75';
                  }
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
