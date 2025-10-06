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

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, payment processing would happen here.
    
    // placeOrder now returns a boolean indicating success, await its result
    const orderPlacedSuccessfully = await placeOrder(); 
    
    if (orderPlacedSuccessfully) {
        navigate('/confirmation');
    }
    // If not successful, an alert is shown from within placeOrder
    // and the user remains on the page to adjust their cart.
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
    <div>
      <h1 className="text-4xl font-extrabold mb-10 text-center tracking-tight">Finalizar Compra</h1>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="bg-surface p-6 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-on-surface-secondary">Nombre Completo</label>
                      <input type="text" readOnly value={`${user?.firstName} ${user?.paternalLastName} ${user?.maternalLastName}`} className="mt-1 block w-full bg-surface-light border-surface-light rounded-md shadow-sm text-on-surface" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-on-surface-secondary">Dirección de Envío</label>
                      <input type="text" readOnly value={user?.address || ''} className="mt-1 block w-full bg-surface-light border-surface-light rounded-md shadow-sm text-on-surface" />
                  </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Método de Pago</h2>
                <div className="space-y-4">
                    <div onClick={() => setPaymentMethod('debit')} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'debit' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-surface-light hover:border-primary/50'}`}>
                        <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="debit" checked={paymentMethod === 'debit'} onChange={() => {}} className="h-4 w-4 text-primary focus:ring-primary border-surface-light bg-surface" />
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
                                    className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-surface-light rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
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
                                        className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-surface-light rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                                </div>
                                <div className="col-span-2">
                                     <label className="block text-sm font-medium text-on-surface-secondary">CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        value={cardDetails.cvc}
                                        onChange={handleCardChange}
                                        placeholder="123"
                                        className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-surface-light rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div onClick={() => setPaymentMethod('mercadopago')} className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === 'mercadopago' ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-surface-light hover:border-primary/50'}`}>
                         <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="mercadopago" checked={paymentMethod === 'mercadopago'} onChange={() => {}} className="h-4 w-4 text-primary focus:ring-primary border-surface-light bg-surface" />
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

            <button type="submit" className="w-full mt-8 bg-primary text-background font-bold py-4 px-6 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20">
                Pagar ${cartTotal.toFixed(2)}
            </button>
          </form>
        </div>
        <div className="lg:col-span-2">
            <div className="bg-surface p-6 rounded-lg shadow-lg sticky top-28">
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
                <div className="border-t border-surface-light mt-4 pt-4 space-y-2">
                     <div className="flex justify-between text-on-surface-secondary">
                        <span>Subtotal</span>
                        <span className="font-medium text-on-surface">${cartTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-on-surface-secondary">
                        <span>Envío</span>
                        <span className="font-medium text-primary">Gratis</span>
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