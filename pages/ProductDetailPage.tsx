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
        // If not found (e.g., direct navigation), fetch from the real API
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
    <div className="bg-surface rounded-lg shadow-lg p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-md object-cover" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-on-surface mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
          <p className="text-on-surface-secondary text-lg mb-8">{product.description}</p>
          
          <div className="mb-6">
            {product.stock > 0 ? (
                 <p className="text-sm font-semibold text-green-600">Disponible: {product.stock} unidades</p>
            ) : (
                <p className="text-sm font-semibold text-red-600">Agotado</p>
            )}
          </div>
          
          <button 
            onClick={() => addToCart(product)}
            disabled={isOutOfStock}
            className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-200 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isOutOfStock ? (product.stock === 0 ? 'Agotado' : 'Stock máximo en carrito') : 'Añadir al carrito'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
