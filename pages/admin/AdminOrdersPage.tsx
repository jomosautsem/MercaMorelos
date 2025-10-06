import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

const AdminOrdersPage: React.FC = () => {
    const { orders, updateOrderStatus } = useAppContext();

    const handleStatusChange = (orderId: string, status: Order['status']) => {
        updateOrderStatus(orderId, status);
    };

    const getStatusClasses = (status: Order['status']) => {
        switch (status) {
            case 'Procesando': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Enviado': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'Entregado': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Cancelado': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 tracking-tight">Gestionar Pedidos</h1>
            <div className="bg-surface-light rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-on-surface-secondary">
                    <thead className="text-xs text-on-surface-secondary uppercase bg-surface">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID Pedido</th>
                            <th scope="col" className="px-6 py-3">Cliente</th>
                            <th scope="col" className="px-6 py-3">Fecha</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Estado</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b border-surface hover:bg-surface">
                                <th scope="row" className="px-6 py-4 font-medium text-on-surface whitespace-nowrap">
                                    #{order.id}
                                </th>
                                <td className="px-6 py-4">{`${order.shippingInfo.firstName} ${order.shippingInfo.paternalLastName}`}</td>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        className={`p-1 rounded-md text-xs border focus:ring-1 focus:ring-primary ${getStatusClasses(order.status)}`}
                                    >
                                        <option className="bg-surface text-on-surface" value="Procesando">Procesando</option>
                                        <option className="bg-surface text-on-surface" value="Enviado">Enviado</option>
                                        <option className="bg-surface text-on-surface" value="Entregado">Entregado</option>
                                        <option className="bg-surface text-on-surface" value="Cancelado">Cancelado</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <Link to={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">Ver Detalles</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrdersPage;