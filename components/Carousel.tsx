import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

interface Slide {
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
}

interface CarouselProps {
  slides: Slide[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const goToPrevious = useCallback(() => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);

  const goToNext = useCallback(() => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, slides]);

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = window.setTimeout(goToNext, 5000);

    return () => {
      resetTimeout();
    };
  }, [currentIndex, goToNext]);

  return (
    <div className="relative w-full h-[35vh] md:h-[65vh] rounded-lg overflow-hidden shadow-2xl group mb-8">
      <div className="w-full h-full flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {slides.map((slide, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <img 
              src={slide.imageUrl} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <div className="text-center text-white p-8 max-w-3xl">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-shadow-lg animate-fade-in-down">{slide.title}</h2>
                <p className="text-lg md:text-xl mb-8 text-on-surface-secondary animate-fade-in-up">{slide.subtitle}</p>
                <Link 
                  to={slide.link} 
                  className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20"
                >
                  Ver Colección
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left/Right Arrows */}
      <button 
        onClick={goToPrevious} 
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-surface/50 hover:bg-surface/80 p-3 rounded-full text-on-surface transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Diapositiva anterior"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button 
        onClick={goToNext} 
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-surface/50 hover:bg-surface/80 p-3 rounded-full text-on-surface transition-all opacity-0 group-hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Siguiente diapositiva"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === slideIndex ? 'bg-primary scale-125' : 'bg-surface/70 hover:bg-surface'}`}
            aria-label={`Ir a la diapositiva ${slideIndex + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;