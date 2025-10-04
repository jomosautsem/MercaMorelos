
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import { getProducts } from '../services/mockApi';
import ProductCard from '../components/ProductCard';

const ProductListPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: 'dama' | 'nino' }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (categoryId) {
          const fetchedProducts = await getProducts(categoryId);
          setProducts(fetchedProducts);
      }
      setLoading(false);
    };
    fetchProducts();
  }, [categoryId]);

  const title = categoryId === 'dama' ? 'Ropa de Dama' : 'Ropa de Niño';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-on-surface capitalize">{title}</h1>
      {loading ? (
        <div className="text-center py-10">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
