import React, { useState, useEffect } from 'react';
import { PhotoItem } from '../../types';
import { ChevronLeft, ChevronRight, Grid, Smartphone, Maximize2, X, MapPin } from 'lucide-react';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  title?: string;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);

  const total = photos.length;

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxPhoto) {
        if (e.key === 'Escape') setLightboxPhoto(null);
        return;
      }
      if (viewMode === 'carousel') {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, lightboxPhoto, total]);

  if (!photos || photos.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-rule text-ink-500">
        No photographic frames loaded. Add photographs in the Story Editor.
      </div>
    );
  }

  const currentPhoto = photos[currentIndex];

  return (
    <div className="my-8">
      {/* Header with View Mode Switcher and Counter */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-ink-900 mb-6">
        <div className="flex items-center gap-3">
          <span className="bg-editorial-red text-white text-xs font-bold uppercase tracking-widest px-2.5 py-1">
            Photo Feature
          </span>
          <span className="font-mono text-sm text-ink-700">
            {total} Documentary Frames
          </span>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center border border-ink-900 bg-paper-200 p-0.5">
          <button
            onClick={() => setViewMode('carousel')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
              viewMode === 'carousel'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-700 hover:text-ink-950'
            }`}
            title="Instagram-style swipeable carousel"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Carousel</span>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
              viewMode === 'grid'
                ? 'bg-ink-900 text-white shadow-sm'
                : 'text-ink-700 hover:text-ink-950'
            }`}
            title="Editorial masonry layout"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Editorial Grid</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: INSTAGRAM-STYLE CAROUSEL */}
      {viewMode === 'carousel' ? (
        <div className="max-w-2xl mx-auto bg-paper-50 border-2 border-ink-900 shadow-md">
          {/* Top Frame Counter Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-paper-200 border-b border-rule">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-ink-900">
              <span className="text-editorial-red">FRAME</span>
              <span>{String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            </div>
            {currentPhoto.location && (
              <div className="flex items-center gap-1 text-[11px] font-mono text-ink-600">
                <MapPin className="w-3 h-3 text-editorial-red" />
                <span>{currentPhoto.location}</span>
              </div>
            )}
            <button
              onClick={() => setLightboxPhoto(currentPhoto)}
              className="text-ink-600 hover:text-ink-900"
              title="Expand photo"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Main Visual Display */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-ink-950 overflow-hidden flex items-center justify-center group">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.altText || currentPhoto.caption}
              className="w-full h-full object-cover transition-opacity duration-300"
            />

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper-100/90 text-ink-950 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-80 group-hover:opacity-100"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-paper-100/90 text-ink-950 flex items-center justify-center shadow-lg hover:bg-white transition-all opacity-80 group-hover:opacity-100"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Instagram-style Dots Indicator */}
          <div className="flex justify-center items-center gap-1.5 py-3 bg-paper-100 border-b border-rule">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`transition-all ${
                  i === currentIndex
                    ? 'w-6 h-2 bg-editorial-red'
                    : 'w-2 h-2 rounded-full bg-rule-dark hover:bg-ink-600'
                }`}
                aria-label={`Jump to photo ${i + 1}`}
              />
            ))}
          </div>

          {/* Caption and Attribution Block */}
          <div className="p-5">
            <p className="font-serif text-sm sm:text-base text-ink-900 leading-relaxed">
              {currentPhoto.caption}
            </p>
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-rule text-xs font-mono text-ink-600">
              <span className="font-semibold text-ink-800">
                Photo by {currentPhoto.photographer}
              </span>
              <span>The Dispatch Archive</span>
            </div>
          </div>

          {/* Thumbnail preview strip */}
          <div className="flex gap-2 p-3 bg-paper-200 border-t border-rule overflow-x-auto">
            {photos.map((photo, idx) => (
              <button
                key={photo.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-14 h-14 border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-editorial-red ring-2 ring-editorial-red/30'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.url}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* VIEW MODE 2: EDITORIAL MASONRY GRID */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {photos.map((photo, index) => (
            <div
              key={photo.id || index}
              className="bg-paper-100 border border-rule p-4 flex flex-col justify-between"
            >
              <div
                className="relative aspect-[4/3] overflow-hidden bg-ink-950 cursor-pointer group mb-3"
                onClick={() => setLightboxPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt={photo.altText || photo.caption}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-ink-950/80 text-white font-mono text-[10px] px-2 py-0.5">
                  FRAME {String(index + 1).padStart(2, '0')}
                </div>
                <div className="absolute inset-0 bg-ink-950/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Maximize2 className="w-6 h-6 drop-shadow-md" />
                </div>
              </div>

              <div>
                <p className="font-serif text-sm text-ink-900 leading-snug">
                  {photo.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono text-ink-500 pt-2 mt-2 border-t border-rule">
                  <span>Photo: {photo.photographer}</span>
                  {photo.location && <span>{photo.location}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 md:p-8"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white p-2"
            aria-label="Close lightbox"
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.caption}
              className="max-h-[70vh] object-contain shadow-2xl border border-white/20"
            />
            <div className="mt-4 text-center text-paper-100 max-w-2xl">
              <p className="font-serif text-base italic">{lightboxPhoto.caption}</p>
              <p className="text-xs font-mono text-ink-400 mt-1">
                Credit: {lightboxPhoto.photographer}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
