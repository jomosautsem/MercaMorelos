import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';


const CategoryCarousel: React.FC = () => {
  const { collections } = useAppContext();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 1);
      // Add a small tolerance (e.g., 2px) to handle sub-pixel rendering issues
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // A short delay to ensure the container has been rendered and its dimensions are available
    const timer = setTimeout(() => {
        checkForScrollPosition();
    }, 150);
    
    container.addEventListener('scroll', checkForScrollPosition, { passive: true });
    window.addEventListener('resize', checkForScrollPosition);

    // Also check when collections data arrives
    checkForScrollPosition();

    return () => {
      clearTimeout(timer);
      if (container) {
        container.removeEventListener('scroll', checkForScrollPosition);
      }
      window.removeEventListener('resize', checkForScrollPosition);
    };
  }, [checkForScrollPosition, collections]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  if (collections.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-on-surface-secondary">
            Aún no se han añadido colecciones. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-10 text-slate-800 drop-shadow-sm">
          Explora Nuestras Colecciones
        </h2>
        <div className="relative">
            <button
              onClick={() => scroll('left')}
              className={`absolute top-1/2 -left-4 -translate-y-1/2 z-20 bg-slate-800 text-primary rounded-full p-2 shadow-lg hover:bg-slate-700 hover:scale-110 transition-all duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-label="Desplazar a la izquierda"
              disabled={!canScrollLeft}
            >
              <ChevronLeftIcon className="w-6 h-6" />
            </button>
          
          <div
            ref={scrollContainerRef}
            className="grid grid-flow-col grid-rows-2 gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-6 overflow-x-auto p-4 scrollbar-hide"
          >
            {collections.map((category) => (
              <Link
                key={category.id}
                to={`/collection/${category.id}`}
                className="flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-slate-800/70 backdrop-blur-md rounded-2xl group/item transition-all duration-300 transform hover:-translate-y-1.5 border-2 border-transparent hover:border-primary shadow-lg hover:shadow-2xl hover:shadow-primary/20"
                aria-label={`Ver colección ${category.name}`}
              >
                <span className="text-4xl md:text-5xl mb-2 transition-transform duration-300 group-hover/item:scale-110 drop-shadow-md">{category.icon}</span>
                <span className="text-xs md:text-sm font-semibold text-slate-200 group-hover/item:text-primary transition-colors text-center px-1">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

            <button
              onClick={() => scroll('right')}
              className={`absolute top-1/2 -right-4 -translate-y-1/2 z-20 bg-slate-800 text-primary rounded-full p-2 shadow-lg hover:bg-slate-700 hover:scale-110 transition-all duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-label="Desplazar a la derecha"
              disabled={!canScrollRight}
            >
              <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
         <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      </div>
    </div>
  );
};

export default CategoryCarousel;