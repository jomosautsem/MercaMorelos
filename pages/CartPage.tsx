import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { TrashIcon, PlusIcon, MinusIcon } from '../components/icons';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useAppContext();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="py-20">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">Tu carrito está vacío</h1>
            <p className="text-on-surface-secondary mb-8 max-w-md mx-auto">Parece que no has añadido nada a tu carrito todavía. Explora nuestras colecciones.</p>
            <Link to="/" className="bg-primary text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30">
            Continuar Comprando
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Tu Carrito ({cartCount} {cartCount > 1 ? 'artículos' : 'artículo'})</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-surface rounded-lg shadow-md p-6 border border-border-color">
          <ul className="divide-y divide-border-color">
            {cart.map(item => (
              <li key={item.id} className="flex items-center py-6">
                <img src={item.imageUrl} alt={item.name} className="w-28 h-28 rounded-md object-cover mr-6" />
                <div className="flex-grow">
                  <Link to={`/product/${item.id}`} className="font-bold text-lg hover:text-primary-focus transition-colors">{item.name}</Link>
                  <p className="text-on-surface-secondary">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center mx-6">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 rounded-full bg-surface-light hover:bg-border-color transition-colors"><MinusIcon /></button>
                  <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 rounded-full bg-surface-light hover:bg-border-color transition-colors"><PlusIcon /></button>
                </div>
                <div className="text-lg font-bold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)} className="ml-6 text-on-surface-secondary hover:text-red-500 transition-colors">
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-1">
            <div className="bg-surface rounded-lg shadow-md p-6 sticky top-28 border border-border-color">
                <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
                <div className="space-y-3">
                    <div className="flex justify-between text-on-surface-secondary">
                        <span>Subtotal</span>
                        <span className="font-medium text-on-surface">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-on-surface-secondary">
                        <span>Envío</span>
                        <span className="font-medium text-primary-focus">Gratis</span>
                    </div>
                </div>
                <div className="border-t border-border-color my-6"></div>
                <div className="flex justify-between text-xl font-extrabold mb-8">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                </div>
                <Link to="/checkout" className="w-full text-center bg-primary text-slate-900 font-bold py-3 px-6 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 block">
                    Proceder al Pago
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;