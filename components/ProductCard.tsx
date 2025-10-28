import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import StarRating from './StarRating';
import { HeartIcon } from './icons';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, user, isProductInWishlist, addToWishlist, removeFromWishlist, isAuthenticated } = useAppContext();
  const isOutOfStock = product.stock === 0;
  const inWishlist = isProductInWishlist(product.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card link navigation
    if (!user) {
        // You might want to navigate to login or show a toast
        return;
    }
    if (inWishlist) {
        removeFromWishlist(product.id);
    } else {
        addToWishlist(product.id);
    }
  }


  return (
    <div className="bg-surface rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1 relative border border-border-color">
      {user?.role !== 'admin' && isAuthenticated && (
        <button 
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/70 backdrop-blur-sm text-on-surface-secondary hover:text-secondary-focus transition-all duration-300 transform hover:scale-110"
            aria-label={inWishlist ? "Quitar de la lista de deseos" : "Añadir a la lista de deseos"}
        >
            <HeartIcon filled={inWishlist} className={`w-6 h-6 ${inWishlist ? 'text-secondary' : ''}`} />
        </button>
      )}
      {isOutOfStock && (
        <div className="absolute top-10 -right-20 transform rotate-45 bg-red-600 text-white text-center font-black text-3xl py-3 w-72 z-10 shadow-xl tracking-wider">
          AGOTADO
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
        <h3 className="text-lg font-bold text-on-surface truncate group-hover:text-primary-focus transition-colors">{product.name}</h3>
        
        {product.reviewCount !== undefined && product.reviewCount > 0 ? (
          <div className="flex items-center mt-2">
            <StarRating rating={product.averageRating || 0} size="sm" />
            <span className="text-xs text-on-surface-secondary ml-2">({product.reviewCount})</span>
          </div>
        ) : (
            <div className="h-4 mt-2"></div>
        )}

        <p className="text-2xl font-extrabold text-on-surface mt-2">${product.price.toFixed(2)}</p>
        {user?.role !== 'admin' && (
            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button 
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                aria-label={isOutOfStock ? 'Producto sin stock' : 'Añadir al carrito'}
                className="w-12 h-12 bg-primary text-slate-800 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed hover:scale-110 hover:shadow-primary/40"
            >
                {isOutOfStock ? 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                }
            </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
