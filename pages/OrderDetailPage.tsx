import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Order } from '../types';

const OrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { getOrderDetail, cancelOrder } = useAppContext();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (orderId) {
                setLoading(true);
                try {
                    const fetchedOrder = await getOrderDetail(orderId);
                    setOrder(fetchedOrder);
                } catch (error) {
                    console.error("Failed to fetch order details:", error);
                    setOrder(null);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchOrderDetails();
    }, [orderId, getOrderDetail]);

    const handleCancelOrder = async () => {
        if (order && window.confirm('¿Estás seguro de que quieres cancelar este pedido?')) {
            await cancelOrder(order.id);
            setOrder(prevOrder => prevOrder ? { ...prevOrder, status: 'Cancelado' } : null);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Cargando detalles del pedido...</div>;
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">Pedido no encontrado</h1>
                <p className="text-on-surface-secondary mb-8">El pedido que buscas no existe o ha sido eliminado.</p>
                <Link to="/orders" className="bg-primary text-background font-bold py-3 px-6 rounded-full hover:bg-primary-focus transition-colors">
                    Volver a Mis Pedidos
                </Link>
            </div>
        );
    }
    
    const { shippingInfo } = order;

    const getStatusClasses = (status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado') => {
        switch (status) {
            case 'Procesando': return 'bg-yellow-500/10 text-yellow-400';
            case 'Enviado': return 'bg-blue-500/10 text-blue-400';
            case 'Entregado': return 'bg-green-500/10 text-green-400';
            case 'Cancelado': return 'bg-red-500/10 text-red-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    return (
        <div>
            <div className="mb-6">
                <Link to="/orders" className="text-sm font-medium text-primary hover:text-primary-focus">
                    &larr; Volver a Mis Pedidos
                </Link>
            </div>
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Detalles del Pedido #{order.id}</h1>
            <p className="text-on-surface-secondary mb-8">
                Realizado el {new Date(order.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-surface rounded-lg shadow-lg p-6">
                         <h2 className="text-2xl font-bold mb-4">Artículos del Pedido</h2>
                        <ul className="divide-y divide-surface-light">
                            {order.items.map(item => (
                                <li key={item.id} className="py-4">
                                    <div className="flex items-center">
                                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-on-surface">{item.name}</p>
                                            <p className="text-sm text-on-surface-secondary">Cantidad: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-on-surface">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-sm text-on-surface-secondary">${item.price.toFixed(2)} c/u</p>
                                        </div>
                                    </div>
                                    {order.status === 'Entregado' && (
                                        <div className="mt-3 text-right">
                                        <Link 
                                            to={`/product/${item.id}`}
                                            className="text-sm font-semibold text-primary hover:text-primary-focus hover:underline"
                                        >
                                            Dejar una opinión
                                        </Link>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-surface rounded-lg shadow-lg p-6">
                         <h2 className="text-2xl font-bold mb-4">Resumen del Pedido</h2>
                         <div className="space-y-3">
                            <div className="flex justify-between text-on-surface-secondary">
                                <span>Subtotal</span>
                                <span className="font-medium text-on-surface">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-on-surface-secondary">
                                <span>Envío</span>
                                <span className="font-medium text-primary">Gratis</span>
                            </div>
                            <div className="border-t border-surface-light my-2"></div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total del Pedido</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-on-surface-secondary">Estado</span>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-on-surface-secondary">Entrega Estimada</span>
                                <span className="text-sm font-medium text-on-surface text-right">
                                    {new Date(order.estimatedDeliveryDate).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>
                         </div>
                         {order.status === 'Procesando' && (
                             <div className="mt-6">
                                 <button
                                     onClick={handleCancelOrder}
                                     className="w-full bg-red-600/20 text-red-400 font-bold py-2 px-4 rounded-lg hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-red-500 transition-colors"
                                 >
                                     Cancelar Pedido
                                 </button>
                             </div>
                         )}
                     </div>
                     <div className="bg-surface rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">Información de Envío</h2>
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