import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { EnvelopeIcon } from '../../components/icons';

const AdminCustomersPage: React.FC = () => {
    const { customers, deleteCustomer } = useAppContext();

    const handleDelete = (customerId: string, customerName: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar al cliente "${customerName}"? Esta acción no se puede deshacer.`)) {
            deleteCustomer(customerId);
        }
    };
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 tracking-tight">Clientes Registrados</h1>
            <div className="bg-surface-light rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-on-surface-secondary">
                    <thead className="text-xs text-on-surface-secondary uppercase bg-surface">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Correo Electrónico</th>
                            <th scope="col" className="px-6 py-3">Dirección</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} className="border-b border-surface hover:bg-surface">
                                <th scope="row" className="px-6 py-4 font-medium text-on-surface whitespace-nowrap">
                                    {`${customer.firstName} ${customer.paternalLastName}`}
                                </th>
                                <td className="px-6 py-4">{customer.email}</td>
                                <td className="px-6 py-4">{customer.address}</td>
                                <td className="px-6 py-4 flex items-center space-x-4">
                                    <Link
                                        to={`/admin/chat/${customer.id}`}
                                        className="font-medium text-primary hover:underline flex items-center"
                                    >
                                        <EnvelopeIcon className="w-5 h-5 mr-1" />
                                        Contactar
                                    </Link>
                                    <button onClick={() => handleDelete(customer.id, `${customer.firstName} ${customer.paternalLastName}`)} className="font-medium text-red-500 hover:underline">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCustomersPage;