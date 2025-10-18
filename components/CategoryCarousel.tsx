
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
      setCanScrollLeft(scrollLeft > 0);
      // Add a small tolerance (e.g., 1px) to handle sub-pixel rendering issues
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // A short delay to ensure the container has been rendered and its dimensions are available
    const timer = setTimeout(() => {
        checkForScrollPosition();
    }, 100);
    
    container.addEventListener('scroll', checkForScrollPosition);
    window.addEventListener('resize', checkForScrollPosition);

    return () => {
      clearTimeout(timer);
      container.removeEventListener('scroll', checkForScrollPosition);
      window.removeEventListener('resize', checkForScrollPosition);
    };
  }, [checkForScrollPosition, collections]); // Re-check when collections change
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  if (collections.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-on-surface-secondary">
            Aún no se han añadido colecciones. ¡Vuelve pronto!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
            <button
              onClick={() => scroll('left')}
              className={`absolute top-1/2 -left-4 -translate-y-1/2 z-20 bg-primary rounded-full p-2 shadow-lg hover:bg-primary-focus transition-all duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-label="Desplazar a la izquierda"
              disabled={!canScrollLeft}
            >
              <ChevronLeftIcon className="w-6 h-6 text-slate-900" />
            </button>
          
          <div
            ref={scrollContainerRef}
            className="flex items-center space-x-4 overflow-x-auto py-4 scrollbar-hide"
          >
            {collections.map((category) => (
              <Link
                key={category.id}
                to={`/collection/${category.id}`}
                className="flex-shrink-0 flex flex-col items-center justify-center w-40 h-40 md:w-48 md:h-48 bg-surface-light rounded-2xl group/item hover:bg-primary/20 transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-primary/30 shadow-lg"
                aria-label={`Ver categoría ${category.name}`}
              >
                <span className="text-5xl md:text-6xl mb-4 drop-shadow-sm">{category.icon}</span>
                <span className="text-sm md:text-base font-semibold text-on-surface-secondary group-hover/item:text-primary-focus transition-colors text-center px-2">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>

            <button
              onClick={() => scroll('right')}
              className={`absolute top-1/2 -right-4 -translate-y-1/2 z-20 bg-primary rounded-full p-2 shadow-lg hover:bg-primary-focus transition-all duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              aria-label="Desplazar a la derecha"
              disabled={!canScrollRight}
            >
              <ChevronRightIcon className="w-6 h-6 text-slate-900" />
            </button>
        </div>
         <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      </div>
    </div>
  );
};

export default CategoryCarousel;
