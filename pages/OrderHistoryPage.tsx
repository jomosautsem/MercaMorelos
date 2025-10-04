import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { TruckIcon } from '../components/icons';

const OrderHistoryPage: React.FC = () => {
    const { orders } = useAppContext();

    const getStatusColor = (status: 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado') => {
        switch (status) {
            case 'Procesando': return 'bg-yellow-100 text-yellow-800';
            case 'Enviado': return 'bg-blue-100 text-blue-800';
            case 'Entregado': return 'bg-green-100 text-green-800';
            case 'Cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (orders.length === 0) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold mb-4">No tienes pedidos</h1>
                <p className="text-on-surface-secondary mb-8">Parece que todavía no has realizado ninguna compra.</p>
                <Link to="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">
                    Empezar a Comprar
                </Link>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Mi Historial de Pedidos</h1>
            <div className="bg-surface rounded-lg shadow-md overflow-hidden">
                <ul className="divide-y divide-gray-200">
                    {orders.map(order => (
                        <li key={order.id}>
                            <Link to={`/orders/${order.id}`} className="block hover:bg-gray-50">
                                <div className="p-4 sm:p-6">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-primary truncate">
                                            Pedido #{order.id}
                                        </p>
                                        <div className="ml-2 flex-shrink-0 flex">
                                            <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex sm:flex-col sm:gap-1">
                                            <p className="flex items-center text-sm text-on-surface-secondary">
                                                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {new Date(order.date).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                             <p className="flex items-center text-sm text-on-surface-secondary mt-1 sm:mt-0">
                                                <TruckIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                                                Entrega estimada: {new Date(order.estimatedDeliveryDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="mt-2 flex items-center text-sm text-on-surface-secondary sm:mt-0">
                                            <p className="font-bold text-lg text-on-surface">
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