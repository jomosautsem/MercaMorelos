import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CheckoutPage: React.FC = () => {
  const { user, cart, cartTotal, placeOrder } = useAppContext();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('debit');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous error

    if (paymentMethod === 'debit') {
      if (!cardDetails.number.trim() || !cardDetails.expiry.trim() || !cardDetails.cvc.trim()) {
        setError('Por favor, complete todos los campos de la tarjeta.');
        return;
      }
    }

    setIsProcessing(true);
    // In a real app, payment processing would happen here.
    
    // placeOrder now returns a boolean indicating success, await its result
    const orderPlacedSuccessfully = await placeOrder(); 
    
    if (orderPlacedSuccessfully) {
        navigate('/confirmation');
    } else {
        // The error toast is shown from the context
        setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
     return (
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold mb-4">Tu carrito está vacío</h1>
          <p className="text-on-surface-secondary">No puedes proceder al pago sin artículos.</p>
        </div>
      );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight">Finalizar Compra</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="bg-surface p-6 rounded-lg shadow-md border border-border-color mb-8">
              <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-on-surface-secondary">Nombre Completo</label>
                      <input type="text" readOnly value={`${user?.firstName} ${user?.paternalLastName} ${user?.maternalLastName}`} className="mt-1 block w-full bg-surface-light border-border-color rounded-md shadow-sm text-on-surface-secondary" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-on-surface-secondary">Dirección de Envío</label>
                      <input type="text" readOnly value={user?.address || ''} className="mt-1 block w-full bg-surface-light border-border-color rounded-md shadow-sm text-on-surface-secondary" />
                  </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-md border border-border-color">
                <h2 className="text-2xl font-bold mb-4">Método de Pago</h2>
                {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md mb-4">{error}</p>}
                <div className="space-y-4">
                    <div onClick={() => setPaymentMethod('debit')} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'debit' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border-color hover:border-primary/50'}`}>
                        <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="debit" checked={paymentMethod === 'debit'} onChange={() => {}} className="h-4 w-4 text-primary focus:ring-primary border-border-color bg-surface" />
                            <span className="ml-3 font-medium text-on-surface">Tarjeta de Débito</span>
                        </label>
                    </div>
                    {paymentMethod === 'debit' && (
                        <div className="pl-8 space-y-4 mt-4">
                             <div>
                                <label className="block text-sm font-medium text-on-surface-secondary">Número de Tarjeta</label>
                                <input
                                    type="text"
                                    name="number"
                                    value={cardDetails.number}
                                    onChange={handleCardChange}
                                    placeholder="**** **** **** ****"
                                    required={paymentMethod === 'debit'}
                                    className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-on-surface-secondary">Vencimiento</label>
                                    <input
                                        type="text"
                                        name="expiry"
                                        value={cardDetails.expiry}
                                        onChange={handleCardChange}
                                        placeholder="MM/YY"
                                        required={paymentMethod === 'debit'}
                                        className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                                </div>
                                <div className="col-span-2">
                                     <label className="block text-sm font-medium text-on-surface-secondary">CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        value={cardDetails.cvc}
                                        onChange={handleCardChange}
                                        placeholder="123"
                                        required={paymentMethod === 'debit'}
                                        className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div onClick={() => setPaymentMethod('mercadopago')} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'mercadopago' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border-color hover:border-primary/50'}`}>
                         <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="mercadopago" checked={paymentMethod === 'mercadopago'} onChange={() => {}} className="h-4 w-4 text-primary focus:ring-primary border-border-color bg-surface" />
                            <span className="ml-3 font-medium text-on-surface">Mercado Pago</span>
                        </label>
                    </div>
                    {paymentMethod === 'mercadopago' && (
                        <div className="pl-8 mt-4">
                            <p className="text-sm text-on-surface-secondary">Serás redirigido a Mercado Pago para completar tu compra de forma segura.</p>
                        </div>
                    )}
                </div>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full mt-8 bg-primary text-slate-900 font-bold py-4 px-6 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100">
                {isProcessing ? 'Procesando...' : `Pagar $${cartTotal.toFixed(2)}`}
            </button>
          </form>
        </div>
        <div className="lg:col-span-2">
            <div className="bg-surface p-6 rounded-lg shadow-md border border-border-color sticky top-28">
                <h2 className="text-2xl font-bold mb-4">Resumen del Carrito</h2>
                <ul className="space-y-4 max-h-80 overflow-y-auto pr-2">
                    {cart.map(item => (
                        <li key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                <div>
                                    <p className="font-semibold text-on-surface">{item.name}</p>
                                    <p className="text-sm text-on-surface-secondary">Cantidad: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold text-on-surface">${(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
                <div className="border-t border-border-color mt-4 pt-4 space-y-2">
                     <div className="flex justify-between text-on-surface-secondary">
                        <span>Subtotal</span>
                        <span className="font-medium text-on-surface">${cartTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-on-surface-secondary">
                        <span>Envío</span>
                        <span className="font-medium text-primary-focus">Gratis</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-on-surface pt-2">
                        <span>Total</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
