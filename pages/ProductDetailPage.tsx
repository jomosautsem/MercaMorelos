import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product, Review } from '../types';
import { useAppContext } from '../context/AppContext';
import StarRating from '../components/StarRating';

const ReviewForm: React.FC<{ productId: string, onSubmit: () => void }> = ({ productId, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { addProductReview } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Por favor, selecciona una calificación.');
            return;
        }
        setError('');
        setIsLoading(true);
        const result = await addProductReview(productId, rating, comment);
        if (result.success) {
            setRating(0);
            setComment('');
            onSubmit();
        } else {
            setError(result.message || 'Hubo un error al enviar tu opinión. Inténtalo de nuevo.');
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-surface-light p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-xl font-bold mb-4">Escribe tu opinión</h3>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="mb-4">
                <label className="block text-sm font-medium text-on-surface-secondary mb-2">Tu calificación</label>
                <StarRating rating={rating} onRatingChange={setRating} size="lg" />
            </div>
            <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-on-surface-secondary mb-2">Tu comentario</label>
                <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="w-full p-2 bg-surface border border-surface rounded-md focus:ring-primary focus:border-primary"
                    placeholder="¿Qué te pareció el producto?"
                />
            </div>
            <button type="submit" disabled={isLoading || rating === 0} className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isLoading ? 'Enviando...' : 'Enviar opinión'}
            </button>
        </form>
    );
};


const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { allProducts, addToCart, cart, getReviewsForProduct, isAuthenticated, checkIfUserPurchasedProduct, user } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const foundProduct = allProducts.find(p => p.id === productId);

        if (foundProduct) {
          const reviewsData = await getReviewsForProduct(productId);
          
          // Re-calculate review data based on fetched reviews to ensure it's up to date
          const reviewCount = reviewsData.length;
          const averageRating = reviewCount > 0
              ? reviewsData.reduce((acc, review) => acc + review.rating, 0) / reviewCount
              : 0;

          setProduct({
              ...foundProduct,
              averageRating,
              reviewCount,
          });
          setReviews(reviewsData);
        } else {
            setProduct(null);
            setReviews([]);
        }
      } catch (error) {
          console.error("Failed to fetch product details:", error);
          setProduct(null);
          setReviews([]);
      } finally {
          setLoading(false);
      }
    };

    // The context loads allProducts initially. Once they are available, find the specific product.
    if (allProducts.length > 0) {
      loadData();
    } else {
      // Handle the case where allProducts might still be loading from the context
      setLoading(true);
    }
  }, [productId, allProducts, getReviewsForProduct]);


  const reloadReviews = async () => {
    if (!productId) return;
    const newReviews = await getReviewsForProduct(productId);
    setReviews(newReviews);
    // Note: The overall product rating is updated reactively when `allProducts` changes in the context.
    // This function just ensures the new comment appears immediately.
  };

  const itemInCart = cart.find(item => item.id === product?.id);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;
  
  const isOutOfStock = product ? product.stock <= quantityInCart : true;
  const userCanReview = isAuthenticated && checkIfUserPurchasedProduct(productId || '');
  const hasUserReviewed = reviews.some(review => review.userId === user?.id);

  if (loading && !product) {
    return <div className="text-center py-20">Cargando producto...</div>;
  }

  if (!product) {
    return <div className="text-center py-20">Producto no encontrado.</div>;
  }

  return (
    <>
      <div className="bg-surface rounded-lg shadow-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img src={product.imageUrl} alt={product.name} className={`w-full h-auto object-cover ${product.stock === 0 ? 'filter grayscale' : ''}`} />
          </div>
          <div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-on-surface mb-2 tracking-tight">{product.name}</h1>
            
            {product.reviewCount !== undefined && product.reviewCount > 0 && (
                <div className="flex items-center mb-4">
                    <StarRating rating={product.averageRating || 0} />
                    <a href="#reviews" className="text-sm text-on-surface-secondary ml-3 hover:underline">
                        ({product.reviewCount} {product.reviewCount > 1 ? 'opiniones' : 'opinión'})
                    </a>
                </div>
            )}

            <p className="text-4xl font-bold text-primary mb-6">${product.price.toFixed(2)}</p>
            <p className="text-on-surface-secondary text-base leading-relaxed mb-8">{product.description}</p>
            
            <div className="mb-8">
              {product.stock > 5 ? (
                   <p className="text-sm font-semibold text-green-400">En Stock</p>
              ) : product.stock > 0 ? (
                  <p className="text-sm font-semibold text-yellow-400">¡Quedan pocas unidades! ({product.stock} disponibles)</p>
              ) : (
                  <p className="text-sm font-semibold text-red-500">SIN STOCK</p>
              )}
            </div>
            
            {user?.role !== 'admin' && (
              <button 
                onClick={() => addToCart(product)}
                disabled={isOutOfStock}
                className="w-full sm:w-auto bg-primary text-white font-bold py-4 px-10 rounded-full hover:bg-primary-focus focus:outline-none focus:ring-4 focus:ring-primary/50 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 shadow-lg shadow-primary/20"
              >
                {isOutOfStock ? (product.stock === 0 ? 'SIN STOCK' : 'Stock máximo en carrito') : 'Añadir al carrito'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div id="reviews" className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Opiniones de nuestros clientes</h2>
        
        {userCanReview && !hasUserReviewed && (
            <ReviewForm productId={product.id} onSubmit={reloadReviews} />
        )}
        {hasUserReviewed && (
             <div className="bg-surface-light p-4 rounded-lg text-center text-on-surface-secondary my-6">
                Gracias por tu opinión sobre este producto.
            </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-6 mt-8">
            {reviews.map(review => (
              <div key={review.id} className="bg-surface p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-2">
                  <StarRating rating={review.rating} size="sm" />
                  <p className="ml-4 font-bold text-on-surface">{review.userName}</p>
                </div>
                {review.comment && <p className="text-on-surface-secondary italic">"{review.comment}"</p>}
                <p className="text-xs text-on-surface-secondary text-right mt-2">{new Date(review.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-surface-light rounded-lg mt-8">
            <p className="text-on-surface-secondary">Este producto aún no tiene opiniones.</p>
            {userCanReview && !hasUserReviewed && <p className="text-on-surface-secondary mt-1">¡Sé el primero en dejar una!</p>}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetailPage;