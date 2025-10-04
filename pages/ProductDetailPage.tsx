
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { getProductById } from '../services/mockApi';
import { useAppContext } from '../context/AppContext';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useAppContext();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      if (productId) {
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct || null);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [productId]);

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
          <button 
            onClick={() => addToCart(product)}
            className="w-full sm:w-auto bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform duration-200 hover:scale-105"
          >
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
