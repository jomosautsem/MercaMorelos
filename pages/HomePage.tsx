import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { allProducts, loading, error } = useAppContext();

  const featuredProducts = useMemo(() => {
    return allProducts.slice(0, 8); // Show first 8 as featured
  }, [allProducts]);

  return (
    <div>
      <div className="bg-primary text-white rounded-lg p-8 md:p-12 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Bienvenido a MercaMorelos</h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto">Tu tienda de moda para Dama y Niño. Descubre las últimas tendencias y los mejores estilos.</p>
        <div className="mt-8 flex justify-center gap-4">
            <Link to="/category/dama" className="bg-white text-primary font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                Ver Ropa de Dama
            </Link>
            <Link to="/category/nino" className="bg-secondary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary-focus transition-colors">
                Ver Ropa de Niño
            </Link>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-on-surface">Productos Destacados</h2>
      {loading ? (
        <div className="text-center py-10">Cargando productos...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-semibold">Error al cargar productos: {error}</div>
      ) : featuredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10 text-on-surface-secondary">No hay productos destacados en este momento.</div>
      )}
    </div>
  );
};

export default HomePage;