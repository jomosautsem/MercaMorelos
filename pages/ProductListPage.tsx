import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAppContext } from '../context/AppContext';

const ProductListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: 'dama' | 'nino' }>();
  const { allProducts, loading, error } = useAppContext();
  
  const products = useMemo(() => {
      if (categoryId) {
          return allProducts.filter(p => p.category === categoryId);
      }
      return [];
  }, [categoryId, allProducts]);

  const title = categoryId === 'dama' ? 'Ropa de Dama' : 'Ropa de Niño';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold mb-10 text-on-surface capitalize tracking-tight">{title}</h1>
      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="bg-surface rounded-lg shadow-md h-96 animate-pulse"></div>
            ))}
         </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500 font-semibold">Error al cargar productos: {error}</div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-on-surface-secondary">No se encontraron productos en esta categoría.</div>
      )}
    </div>
  );
};

export default ProductListPage;