import React, { useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel';
import CategoryCarousel from '../components/CategoryCarousel';
import { useAppContext } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { allProducts, loading, error } = useAppContext();

  const featuredProducts = useMemo(() => {
    return allProducts.slice(0, 8); // Show first 8 as featured
  }, [allProducts]);

  const mainCarouselSlides = [
    {
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'Siente la Moda, Vive el Estilo',
      subtitle: 'Nuestra colección en movimiento, diseñada para ti.',
      link: '/category/dama',
    },
    {
      imageUrl: 'https://picsum.photos/seed/carousel1/1600/900',
      title: 'Nueva Colección de Verano',
      subtitle: 'Estilos frescos y vibrantes para brillar esta temporada.',
      link: '/category/dama',
    },
    {
      imageUrl: 'https://picsum.photos/seed/carousel2/1600/900',
      title: 'Esenciales para Niños',
      subtitle: 'Comodidad y diversión para sus aventuras diarias.',
      link: '/category/nino',
    },
    {
      imageUrl: 'https://picsum.photos/seed/carousel3/1600/900',
      title: 'Ofertas Imperdibles',
      subtitle: 'Hasta 30% de descuento en artículos seleccionados.',
      link: '/category/dama',
    },
  ];

  const secondaryCarouselSlides = [
     {
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      title: 'Vive la Moda en Movimiento',
      subtitle: 'Descubre cómo nuestras prendas cobran vida.',
      link: '/category/dama',
    },
    {
      imageUrl: 'https://picsum.photos/seed/carousel4/1600/900',
      title: 'Detrás de Escena',
      subtitle: 'La calidad y el cuidado en cada detalle de nuestra colección.',
      link: '/category/nino',
    },
  ];

  return (
    <>
      <Carousel slides={mainCarouselSlides} />

      {/* Category Carousel with a clean background */}
      <div className="bg-surface">
          <CategoryCarousel />
      </div>

      {/* Featured Products Section */}
      <div className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-12 text-center text-primary-focus">
            Productos Destacados
          </h2>
          {loading ? (
            <div className="text-center py-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {Array.from({ length: 8 }).map((_, index) => (
                      <div key={index} className="bg-surface rounded-lg shadow-md h-96 animate-pulse"></div>
                  ))}
               </div>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 font-semibold">Error al cargar productos: {error}</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.filter(p => p).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="text-center py-10 text-on-surface-secondary">No hay productos destacados en este momento.</div>
          )}
        </div>
      </div>
      
      <div className="pb-16 bg-background">
        <Carousel slides={secondaryCarouselSlides} height="h-[50vh]" />
      </div>
    </>
  );
};

export default HomePage;
