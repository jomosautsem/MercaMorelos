
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { TrashIcon, PlusIcon, MinusIcon } from '../components/icons';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useAppContext();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-on-surface-secondary mb-8">Parece que no has añadido nada a tu carrito todavía.</p>
        <Link to="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">
          Continuar Comprando
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras ({cartCount} {cartCount > 1 ? 'artículos' : 'artículo'})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-md p-6">
          <ul className="divide-y divide-gray-200">
            {cart.map(item => (
              <li key={item.id} className="flex items-center py-6">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 rounded-md object-cover mr-6" />
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`} className="font-semibold text-lg hover:text-primary">{item.name}</Link>
                  <p className="text-on-surface-secondary">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center mx-6">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon /></button>
                  <span className="w-12 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon /></button>
                </div>
                <div className="text-lg font-bold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} className="ml-6 text-on-surface-secondary hover:text-red-500">
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
                <div className="flex justify-between mb-2 text-on-surface-secondary">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-4 text-on-surface-secondary">
                    <span>Envío</span>
                    <span>Gratis</span>
                </div>
                <div className="border-t border-gray-200 my-4"></div>
                <div className="flex justify-between text-xl font-bold mb-6">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="w-full text-center bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors block">
                    Proceder al Pago
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
