import React, { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import { useAppContext } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { allProducts, loading, error } = useAppContext();

  const featuredProducts = useMemo(() => {
    return allProducts.slice(0, 8); // Show first 8 as featured
  }, [allProducts]);

  const carouselSlides = [
    {
      imageUrl: 'https://picsum.photos/seed/carousel1/1600/900?grayscale&blur=2',
      title: 'Nueva Colección de Verano',
      subtitle: 'Estilos frescos y vibrantes para brillar esta temporada.',
      link: '/category/dama',
    },
    {
      imageUrl: 'https://picsum.photos/seed/carousel2/1600/900?grayscale&blur=2',
      title: 'Esenciales para Niños',
      subtitle: 'Comodidad y diversión para sus aventuras diarias.',
      link: '/category/nino',
    },
    {
      imageUrl: 'https://picsum.photos/seed/carousel3/1600/900?grayscale&blur=2',
      title: 'Ofertas Imperdibles',
      subtitle: 'Hasta 30% de descuento en artículos seleccionados.',
      link: '/category/dama',
    },
  ];

  return (
    <div className="space-y-16">
      <Carousel slides={carouselSlides} />

      <div>
        <h2 className="text-4xl font-bold mb-8 text-center text-on-surface">Productos Destacados</h2>
        {loading ? (
          <div className="text-center py-10">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-surface rounded-lg shadow-lg h-96 animate-pulse"></div>
                ))}
             </div>
          </div>
        ) : error ? (
          <div className="text-center py-10 text-red-400 font-semibold">Error al cargar productos: {error}</div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
           <div className="text-center py-10 text-on-surface-secondary">No hay productos destacados en este momento.</div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
