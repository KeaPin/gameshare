"use client";

import { useState } from 'react';
import Image from 'next/image';

interface GameImageCarouselProps {
  images: string[];
  alt: string;
}

export default function GameImageCarousel({ images, alt }: GameImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="relative aspect-[16/9] overflow-hidden">
      {/* 主图片 */}
      <Image
        src={images[currentIndex]}
        alt={alt}
        fill
        className="object-cover transition-opacity duration-300"
        priority
      />
      
      {/* 导航箭头 */}
      {images.length > 1 && (
        <>
          {/* 左箭头 */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full p-2 transition-all duration-200 group"
            aria-label="上一张图片"
          >
            <svg
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* 右箭头 */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-sm hover:bg-black/80 rounded-full p-2 transition-all duration-200 group"
            aria-label="下一张图片"
          >
            <svg
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* 指示器和计数 */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-4">
        {/* 圆点指示器 */}
        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`跳转到第${index + 1}张图片`}
              />
            ))}
          </div>
        )}

        {/* 计数器 */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1">
          <span className="text-white text-sm">
            {currentIndex + 1}/{images.length}
          </span>
        </div>
      </div>
    </div>
  );
}
