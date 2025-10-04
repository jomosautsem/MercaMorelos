

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
    <div>
      <h1 className="text-3xl font-bold mb-8 text-on-surface capitalize">{title}</h1>
      {loading ? (
        <div className="text-center py-10">Cargando...</div>
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