import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

const categories = [
  { name: 'Vestidos', link: '/category/dama', icon: '👗' },
  { name: 'Blusas', link: '/category/dama', icon: '👚' },
  { name: 'Jeans Dama', link: '/category/dama', icon: '👖' },
  { name: 'Playeras Niño', link: '/category/nino', icon: '👕' },
  { name: 'Pantalones Niño', link: '/category/nino', icon: '👖' },
  { name: 'Sudaderas', link: '/category/nino', icon: '🧥' },
  { name: 'Accesorios', link: '/category/dama', icon: '👜' },
  { name: 'Zapatos', link: '/category/dama', icon: '👠' },
  { name: 'Ropa Interior', link: '/category/dama', icon: '👙' },
  { name: 'Pijamas', link: '/category/nino', icon: '😴' },
  { name: 'Ofertas', link: '/search', icon: '🔥' },
];

const CategoryCarousel: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkForScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    // A short delay to ensure the container has been rendered and its dimensions are available
    setTimeout(() => {
        checkForScrollPosition();
    }, 100);
    
    container?.addEventListener('scroll', checkForScrollPosition);
    window.addEventListener('resize', checkForScrollPosition);

    return () => {
      container?.removeEventListener('scroll', checkForScrollPosition);
      window.removeEventListener('resize', checkForScrollPosition);
    };
  }, [checkForScrollPosition]);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          {canScrollLeft && (
             <button
              onClick={() => scroll('left')}
              className="absolute top-1/2 -left-4 -translate-y-1/2 z-20 bg-primary rounded-full p-2 shadow-lg hover:bg-primary-focus transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Desplazar a la izquierda"
            >
              <ChevronLeftIcon className="w-6 h-6 text-slate-900" />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex justify-start items-center space-x-4 overflow-x-auto py-4 scrollbar-hide"
          >
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
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

          {canScrollRight && (
             <button
              onClick={() => scroll('right')}
              className="absolute top-1/2 -right-4 -translate-y-1/2 z-20 bg-primary rounded-full p-2 shadow-lg hover:bg-primary-focus transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Desplazar a la derecha"
            >
              <ChevronRightIcon className="w-6 h-6 text-slate-900" />
            </button>
          )}
        </div>
         <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      </div>
    </div>
  );
};

export default CategoryCarousel;