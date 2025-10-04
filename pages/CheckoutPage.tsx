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
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="md:col-span-3">
          <form onSubmit={handleSubmit}>
            <div className="bg-surface p-6 rounded-lg shadow-md mb-8">
              <h2 className="text-xl font-bold mb-4">Información de Envío</h2>
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-on-surface-secondary">Nombre Completo</label>
                      <input type="text" readOnly value={`${user?.firstName} ${user?.paternalLastName} ${user?.maternalLastName}`} className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-on-surface-secondary">Dirección de Envío</label>
                      <input type="text" readOnly value={user?.address || ''} className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                  </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
                <div className="space-y-4">
                    <div onClick={() => setPaymentMethod('debit')} className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'debit' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                        <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="debit" checked={paymentMethod === 'debit'} onChange={() => {}} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-3 font-medium">Tarjeta de Débito</span>
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
                                    className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
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
                                        className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                                </div>
                                <div className="col-span-2">
                                     <label className="block text-sm font-medium text-on-surface-secondary">CVC</label>
                                    <input
                                        type="text"
                                        name="cvc"
                                        value={cardDetails.cvc}
                                        onChange={handleCardChange}
                                        placeholder="123"
                                        className="mt-1 block w-full bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div onClick={() => setPaymentMethod('mercadopago')} className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'mercadopago' ? 'border-primary ring-2 ring-primary' : 'border-gray-300'}`}>
                         <label className="flex items-center">
                            <input type="radio" name="paymentMethod" value="mercadopago" checked={paymentMethod === 'mercadopago'} onChange={() => {}} className="h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                            <span className="ml-3 font-medium">Mercado Pago</span>
                        </label>
                    </div>
                    {paymentMethod === 'mercadopago' && (
                        <div className="pl-8 mt-4">
                            <p className="text-sm text-on-surface-secondary">Serás redirigido a Mercado Pago para completar tu compra de forma segura.</p>
                        </div>
                    )}
                </div>
            </div>

            <button type="submit" className="w-full mt-8 bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">
                Pagar ${cartTotal.toFixed(2)}
            </button>
          </form>
        </div>
        <div className="md:col-span-2">
            <div className="bg-surface p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-xl font-bold mb-4">Resumen del Carrito</h2>
                <ul className="space-y-4">
                    {cart.map(item => (
                        <li key={item.id} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover mr-4" />
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-on-surface-secondary">Cantidad: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </li>
                    ))}
                </ul>
                <div className="border-t mt-4 pt-4 space-y-2">
                    <div className="flex justify-between text-on-surface-secondary">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between text-on-surface-secondary">
                        <span>Envío</span>
                        <span>Gratis</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
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