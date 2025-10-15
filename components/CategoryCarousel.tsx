import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Vestidos', link: '/category/dama', icon: '👗' },
  { name: 'Blusas', link: '/category/dama', icon: '👚' },
  { name: 'Jeans', link: '/category/dama', icon: '👖' },
  { name: 'Playeras Niño', link: '/category/nino', icon: '👕' },
  { name: 'Pantalones Niño', link: '/category/nino', icon: '👖' },
  { name: 'Sudaderas', link: '/category/nino', icon: '🧥' },
  { name: 'Ofertas', link: '/search', icon: '🔥' },
];

const CategoryCarousel: React.FC = () => {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center space-x-4 overflow-x-auto py-2 scrollbar-hide">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="flex-shrink-0 flex flex-col items-center justify-center w-48 h-48 bg-surface-light rounded-lg group hover:bg-primary/20 transition-all duration-300 transform hover:-translate-y-1 border border-transparent hover:border-primary/30 shadow-lg"
              aria-label={`Ver categoría ${category.name}`}
            >
              <span className="text-6xl mb-4 drop-shadow-sm">{category.icon}</span>
              <span className="text-base font-semibold text-on-surface-secondary group-hover:text-primary-focus transition-colors text-center">
                {category.name}
              </span>
            </Link>
          ))}
           <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
      </div>
    </div>
  );
};

export default CategoryCarousel;