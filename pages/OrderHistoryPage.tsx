import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { TruckIcon } from '../components/icons';

const OrderHistoryPage: React.FC = () => {
    const { orders } = useAppContext();

    const getStatusClasses = (status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado') => {
        switch (status) {
            case 'Procesando': return 'bg-yellow-500/10 text-yellow-400';
            case 'Enviado': return 'bg-blue-500/10 text-blue-400';
            case 'Entregado': return 'bg-green-500/10 text-green-400';
            case 'Cancelado': return 'bg-red-500/10 text-red-400';
            default: return 'bg-gray-500/10 text-gray-400';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4 tracking-tight">No tienes pedidos</h1>
                <p className="text-on-surface-secondary mb-8">Parece que todavía no has realizado ninguna compra.</p>
                <Link to="/" className="bg-primary text-background font-bold py-3 px-8 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20">
                    Empezar a Comprar
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Mi Historial de Pedidos</h1>
            <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
                <ul className="divide-y divide-surface-light">
                    {orders.map(order => (
                        <li key={order.id}>
                            <Link to={`/orders/${order.id}`} className="block hover:bg-surface-light/50 transition-colors duration-200">
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-primary truncate">
                                            Pedido #{order.id}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.status)}`}>
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex sm:flex-col sm:gap-1">
                                            <p className="flex items-center text-sm text-on-surface-secondary">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {new Date(order.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                             <p className="flex items-center text-sm text-on-surface-secondary mt-1 sm:mt-0">
                                                <TruckIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-500" />
                                                Entrega estimada: {new Date(order.estimatedDeliveryDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-on-surface-secondary sm:mt-0">
                                            <p className="font-extrabold text-xl text-on-surface">
                                                ${order.total.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OrderHistoryPage;