"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GameImageCarouselProps {
  images: string[];
  alt: string;
}

export default function GameImageCarousel({ images, alt }: GameImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

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

  // 预览状态下键盘支持（ESC 关闭、左右箭头切换）
  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isLightboxOpen, images.length]);

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
        className="object-cover transition-opacity duration-300 cursor-zoom-in"
        onClick={() => setIsLightboxOpen(true)}
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

      {/* 图片放大预览（Lightbox） */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="图片预览"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="relative w-[92vw] h-[82vh] max-w-[1600px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex]}
              alt={alt}
              fill
              className="object-contain"
              priority
            />

            {/* 关闭按钮 */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 rounded-full p-2"
              aria-label="关闭预览"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 左右导航 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white"
                  aria-label="上一张"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-3 text-white"
                  aria-label="下一张"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
