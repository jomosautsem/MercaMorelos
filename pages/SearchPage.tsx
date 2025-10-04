
import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const SearchPage: React.FC = () => {
  const { searchQuery, searchResults } = useAppContext();

  return (
    <div>
      {searchQuery ? (
        <h1 className="text-3xl font-bold mb-8 text-on-surface">
          Resultados para: <span className="text-primary">"{searchQuery}"</span>
        </h1>
      ) : (
        <h1 className="text-3xl font-bold mb-8 text-on-surface">
          Por favor, ingrese un término de búsqueda.
        </h1>
      )}

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {searchResults.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        searchQuery && (
          <div className="text-center py-10">
            <p className="text-lg text-on-surface-secondary">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
