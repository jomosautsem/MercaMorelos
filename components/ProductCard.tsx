import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useAppContext();
  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-surface rounded-lg shadow-lg overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 relative border border-transparent hover:border-primary/20">
      {isOutOfStock && (
        <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
          Agotado
        </div>
      )}
      <div className="overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={`w-full h-72 object-cover transition-transform duration-500 ease-in-out group-hover:scale-110 ${isOutOfStock ? 'filter grayscale' : ''}`} 
          />
        </Link>
      </div>
      <div className="p-5 relative">
        <h3 className="text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">{product.name}</h3>
        
        {product.reviewCount !== undefined && product.reviewCount > 0 ? (
          <div className="flex items-center mt-2">
            <StarRating rating={product.averageRating || 0} size="sm" />
            <span className="text-xs text-on-surface-secondary ml-2">({product.reviewCount})</span>
          </div>
        ) : (
            <div className="h-4 mt-2"></div>
        )}

        <p className="text-2xl font-extrabold text-primary mt-2">${product.price.toFixed(2)}</p>
        <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? 'Producto agotado' : 'Añadir al carrito'}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed hover:scale-110"
          >
            {isOutOfStock ? 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;