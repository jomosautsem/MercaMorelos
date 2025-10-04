
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Order } from '../../types';

const AdminOrdersPage: React.FC = () => {
    const { orders, updateOrderStatus } = useAppContext();

    const handleStatusChange = (orderId: string, status: Order['status']) => {
        updateOrderStatus(orderId, status);
    };

    const getStatusColor = (status: Order['status']) => {
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
            <h1 className="text-3xl font-bold mb-6">Gestionar Pedidos</h1>
            <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    #{order.id}
                                </th>
                                <td className="px-6 py-4">{`${order.shippingInfo.firstName} ${order.shippingInfo.paternalLastName}`}</td>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        className={`p-1 rounded-md text-xs border-none focus:ring-0 ${getStatusColor(order.status)}`}
                                    >
                                        <option value="Procesando">Procesando</option>
                                        <option value="Enviado">Enviado</option>
                                        <option value="Entregado">Entregado</option>
                                        <option value="Cancelado">Cancelado</option>
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