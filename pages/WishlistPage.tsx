import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

const WishlistPage: React.FC = () => {
  const { wishlist } = useAppContext();

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="py-20">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Tu lista de deseos está vacía</h1>
          <p className="text-on-surface-secondary mb-8 max-w-md mx-auto">
            Guarda los productos que te encantan para no perderlos de vista.
          </p>
          <Link
            to="/"
            className="bg-primary text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30"
          >
            Descubrir productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold mb-10 text-on-surface tracking-tight">Mi Lista de Deseos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
