import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminDashboardPage: React.FC = () => {
    const { user, allProducts, customers, orders, archiveProduct } = useAppContext();
    
    const outOfStockProducts = useMemo(() => {
        return allProducts.filter(p => p.stock === 0);
    }, [allProducts]);

    const handleArchive = (productId: string, productName: string) => {
        if (window.confirm(`¿Estás seguro de que quieres archivar el producto "${productName}"? No será visible en la tienda.`)) {
            archiveProduct(productId);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">Bienvenido, {user?.firstName}</h1>
                <p className="text-lg text-on-surface-secondary">Este es el panel de administración de MercaMorelos.</p>
            </div>
            
            {outOfStockProducts.length > 0 && (
                <div className="bg-surface-light p-6 rounded-lg shadow-md border-l-4 border-secondary">
                    <h2 className="text-xl font-semibold text-secondary-focus mb-4">Avisos de Stock: Productos Agotados</h2>
                    <ul className="space-y-3">
                        {outOfStockProducts.map(product => (
                            <li key={product.id} className="flex items-center justify-between p-3 bg-surface rounded-md">
                                <span className="font-medium text-on-surface">{product.name}</span>
                                <div className="flex items-center space-x-3">
                                    <Link to={`/admin/products/edit/${product.id}`} className="font-semibold text-sm text-primary hover:underline">Añadir Stock</Link>
                                    <button onClick={() => handleArchive(product.id, product.name)} className="font-semibold text-sm text-red-500 hover:underline">Archivar</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

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