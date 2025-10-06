import React from 'react';
import { useAppContext } from '../../context/AppContext';

const AdminDashboardPage: React.FC = () => {
    const { user, allProducts, customers, orders } = useAppContext();
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">Bienvenido, {user?.firstName}</h1>
            <p className="text-lg text-on-surface-secondary mb-8">Este es el panel de administración de MercaMorelos.</p>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface-light p-6 rounded-lg shadow-md border-l-4 border-primary">
                    <h2 className="text-xl font-semibold text-on-surface-secondary">Total de Productos</h2>
                    <p className="text-5xl font-extrabold mt-2 text-on-surface">{allProducts.length}</p>
                </div>
                <div className="bg-surface-light p-6 rounded-lg shadow-md border-l-4 border-primary">
                    <h2 className="text-xl font-semibold text-on-surface-secondary">Total de Clientes</h2>
                    <p className="text-5xl font-extrabold mt-2 text-on-surface">{customers.length}</p>
                </div>
                <div className="bg-surface-light p-6 rounded-lg shadow-md border-l-4 border-primary">
                    <h2 className="text-xl font-semibold text-on-surface-secondary">Total de Pedidos</h2>
                    <p className="text-5xl font-extrabold mt-2 text-on-surface">{orders.length}</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;