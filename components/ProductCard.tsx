
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden group transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 relative">
      {isOutOfStock && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          Agotado
        </div>
      )}
      <Link to={`/product/${product.id}`} className="block">
        <img src={product.imageUrl} alt={product.name} className={`w-full h-64 object-cover ${isOutOfStock ? 'filter grayscale' : ''}`} />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-on-surface truncate group-hover:text-primary">{product.name}</h3>
        <p className="text-xl font-bold text-on-surface mt-2">${product.price.toFixed(2)}</p>
        <button 
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Agotado' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;