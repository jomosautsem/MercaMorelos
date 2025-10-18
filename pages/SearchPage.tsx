import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const SearchPage: React.FC = () => {
  const { searchQuery, searchResults } = useAppContext();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {searchQuery ? (
        <h1 className="text-4xl font-extrabold mb-10 text-on-surface tracking-tight">
          Resultados para: <span className="text-primary">"{searchQuery}"</span>
        </h1>
      ) : (
        <h1 className="text-4xl font-extrabold mb-10 text-on-surface tracking-tight">
          Por favor, ingrese un término de búsqueda.
        </h1>
      )}

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {searchResults.filter(p => p).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        searchQuery && (
          <div className="text-center py-16">
            <p className="text-xl text-on-surface-secondary">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
             <p className="text-on-surface-secondary mt-2">Intenta con otras palabras clave.</p>
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
