import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

const AdminOrderDetailPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { getOrderDetail } = useAppContext();
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

    if (loading) {
        return <div className="text-center py-20">Cargando detalles del pedido...</div>;
    }

    if (!order) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">Pedido no encontrado</h1>
                <Link to="/admin/orders" className="bg-primary text-background font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">
                    Volver a Pedidos
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
                <Link to="/admin/orders" className="text-sm font-medium text-primary hover:text-primary-focus">
                    &larr; Volver a Todos los Pedidos
                </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Detalles del Pedido #{order.id}</h1>
            <p className="text-on-surface-secondary mb-8">
                Realizado el {new Date(order.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-surface-light rounded-lg shadow-md p-6">
                         <h2 className="text-xl font-bold mb-4">Artículos del Pedido</h2>
                        <ul className="divide-y divide-surface">
                            {order.items.map(item => (
                                <li key={item.id} className="flex items-center py-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover mr-4" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-on-surface">{item.name}</p>
                                        <p className="text-sm text-on-surface-secondary">Cantidad: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-on-surface">${(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-sm text-on-surface-secondary">${item.price.toFixed(2)} c/u</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                     <div className="bg-surface-light rounded-lg shadow-md p-6">
                         <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                         <div className="space-y-3">
                            <div className="flex justify-between text-on-surface-secondary">
                                <span>Subtotal</span>
                                <span className="font-medium text-on-surface">${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-on-surface-secondary">
                                <span>Envío</span>
                                <span className="font-medium text-primary">Gratis</span>
                            </div>
                            <div className="border-t border-surface my-2"></div>
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total del Pedido</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span>Estado</span>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                                    {order.status}
                                </span>
                            </div>
                         </div>
                     </div>
                     <div className="bg-surface-light rounded-lg shadow-md p-6">
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

export default AdminOrderDetailPage;