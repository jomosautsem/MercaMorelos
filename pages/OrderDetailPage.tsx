import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { orders, cancelOrder } = useAppContext();

    const order = orders.find(o => o.id === orderId);
    
    const handleCancelOrder = () => {
        if (order && window.confirm('Are you sure you want to cancel this order?')) {
            cancelOrder(order.id);
        }
    };

    if (!order) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">Pedido no encontrado</h1>
                <p className="text-on-surface-secondary mb-8">El pedido que buscas no existe o ha sido eliminado.</p>
                <Link to="/orders" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">
                    Volver a Mis Pedidos
                </Link>
            </div>
        );
    }
    
    const { shippingInfo } = order;

    const getStatusColor = (status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado') => {
        switch (status) {
            case 'Procesando': return 'bg-yellow-100 text-yellow-800';
            case 'Enviado': return 'bg-blue-100 text-blue-800';
            case 'Entregado': return 'bg-green-100 text-green-800';
            case 'Cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div>
            <div className="mb-6">
                <Link to="/orders" className="text-sm font-medium text-primary hover:text-primary-focus">
                    &larr; Volver a Mis Pedidos
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">Detalles del Pedido #{order.id}</h1>
            <p className="text-on-surface-secondary mb-8">
                Realizado el {new Date(order.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-surface rounded-lg shadow-md p-6">
                         <h2 className="text-xl font-bold mb-4">Artículos del Pedido</h2>
                        <ul className="divide-y divide-gray-200">
                            {order.items.map(item => (
                                <li key={item.id} className="flex items-center py-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-on-surface-secondary">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-on-surface-secondary">${item.price.toFixed(2)} c/u</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-surface rounded-lg shadow-md p-6">
                         <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                         <div className="space-y-2">
                            <div className="flex justify-between text-on-surface-secondary">
                                <span>Subtotal</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-on-surface-secondary">
                                <span>Envío</span>
                                <span>Gratis</span>
                            </div>
                            <div className="border-t my-2"></div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total del Pedido</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span>Estado</span>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span>Entrega Estimada</span>
                                <span className="text-sm font-medium text-on-surface">
                                    {new Date(order.estimatedDeliveryDate).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                         </div>
                         {order.status === 'Procesando' && (
                             <div className="mt-6">
                                 <button
                                     onClick={handleCancelOrder}
                                     className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                 >
                                     Cancelar Pedido
                                 </button>
                             </div>
                         )}
                     </div>
                     <div className="bg-surface rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Información de Envío</h2>
                        <div className="space-y-1 text-on-surface-secondary">
                            <p className="font-semibold text-on-surface">{`${shippingInfo.firstName} ${shippingInfo.paternalLastName}`}</p>
                            <p>{shippingInfo.address}</p>
                            <p>{shippingInfo.email}</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;