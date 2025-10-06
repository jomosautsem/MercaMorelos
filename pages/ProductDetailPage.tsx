import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { addToCart, allProducts, cart } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      // Try to find product in global state first
      const foundProduct = allProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setLoading(false);
      } else {
        // If not found (e.g., direct navigation), fetch from real API
        try {
          const fetchedProduct = await api.getProduct(productId);
          if (fetchedProduct) {
            setProduct(fetchedProduct);
          } else {
            throw new Error('Product not found');
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setProduct(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProduct();
  }, [productId, allProducts]);
  
  const itemInCart = cart.find(item => item.id === product?.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  
  const isOutOfStock = product ? product.stock <= quantityInCart : true;

  if (loading) {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Producto no encontrado.</div>;
  }

  return (
    <div className="bg-surface rounded-lg shadow-2xl p-6 md:p-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover" />
        </div>
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface mb-4 tracking-tight">{product.name}</h1>
          <p className="text-4xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-on-surface-secondary text-base leading-relaxed mb-8">{product.description}</p>
          
          <div className="mb-8">
            {product.stock > 5 ? (
                 <p className="text-sm font-semibold text-green-400">En Stock</p>
            ) : product.stock > 0 ? (
                <p className="text-sm font-semibold text-yellow-400">¡Quedan pocas unidades! ({product.stock} disponibles)</p>
            ) : (
                <p className="text-sm font-semibold text-red-500">Agotado</p>
            )}
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className="w-full sm:w-auto bg-primary text-background font-bold py-4 px-10 rounded-full hover:bg-primary-focus focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-primary/20"
          >
            {isOutOfStock ? (product.stock === 0 ? 'Agotado' : 'Stock máximo en carrito') : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
