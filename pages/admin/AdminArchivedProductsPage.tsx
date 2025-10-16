import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';

const AdminArchivedProductsPage: React.FC = () => {
    const { archivedProducts, deleteProductPermanently, updateProduct, loading } = useAppContext();
    const [productToRestore, setProductToRestore] = useState<Product | null>(null);
    const [newStock, setNewStock] = useState('');

    const handleDelete = (productId: string, productName: string) => {
        const confirmationMessage = `¡ACCIÓN IRREVERSIBLE!\n\n¿Estás seguro de que quieres eliminar PERMANENTEMENTE el producto "${productName}"? Esta acción no se puede deshacer.\n\nEl producto será eliminado de la tienda y del catálogo, pero permanecerá en el historial de pedidos existentes para mantener la integridad de los registros.`;
        if (window.confirm(confirmationMessage)) {
            deleteProductPermanently(productId);
        }
    };

    const handleOpenRestoreModal = (product: Product) => {
        setProductToRestore(product);
        setNewStock('');
    };

    const handleCloseRestoreModal = () => {
        setProductToRestore(null);
    };

    const handleRestoreSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const stockValue = parseInt(newStock, 10);
        if (!productToRestore || isNaN(stockValue) || stockValue <= 0) {
            alert('Por favor, ingrese una cantidad de stock válida y mayor que cero.');
            return;
        }

        const updatedProductData = {
            ...productToRestore,
            stock: stockValue,
        };

        await updateProduct(updatedProductData);
        handleCloseRestoreModal();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Productos Archivados</h1>
                 <Link
                    to="/admin/products"
                    className="text-sm font-semibold text-primary-focus hover:underline"
                >
                    &larr; Volver a Productos Activos
                </Link>
            </div>
            {archivedProducts.length > 0 ? (
                <div className="bg-surface rounded-lg shadow-md overflow-x-auto border border-border-color">
                    <table className="w-full text-sm text-left text-on-surface-secondary">
                        <thead className="text-xs text-on-surface-secondary uppercase bg-surface-light">
                            <tr>
                                <th scope="col" className="px-6 py-3">Imagen</th>
                                <th scope="col" className="px-6 py-3">Nombre</th>
                                <th scope="col" className="px-6 py-3">Precio</th>
                                <th scope="col" className="px-6 py-3">Stock</th>
                                <th scope="col" className="px-6 py-3">Categoría</th>
                                <th scope="col" className="px-6 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {archivedProducts.map(product => (
                                <tr key={product.id} className="border-b border-border-color hover:bg-surface-light">
                                    <td className="px-6 py-4">
                                        <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded"/>
                                    </td>
                                    <th scope="row" className="px-6 py-4 font-medium text-on-surface whitespace-nowrap">
                                        <Link to={`/admin/products/edit/${product.id}`} className="hover:underline hover:text-primary-focus transition-colors">
                                            {product.name}
                                        </Link>
                                    </th>
                                    <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 font-bold text-red-500">{product.stock}</td>
                                    <td className="px-6 py-4 capitalize">{product.category}</td>
                                    <td className="px-6 py-4 flex items-center space-x-3">
                                        <button onClick={() => handleOpenRestoreModal(product)} className="font-medium text-primary-focus hover:underline">Restaurar</button>
                                        <button onClick={() => handleDelete(product.id, product.name)} className="font-medium text-red-600 hover:underline">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                 <div className="text-center py-16 bg-surface-light rounded-lg border border-border-color">
                    <p className="text-lg text-on-surface-secondary">No hay productos archivados.</p>
                </div>
            )}

            {productToRestore && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300" aria-modal="true" role="dialog">
                    <div className="bg-surface p-8 rounded-lg shadow-2xl max-w-md w-full transform transition-all duration-300 border border-border-color">
                        <h2 className="text-2xl font-bold mb-4 text-on-surface">Restaurar Producto</h2>
                        <p className="mb-6 text-on-surface-secondary">Vas a restaurar el producto: <strong className="text-primary-focus">{productToRestore.name}</strong>. Al añadir stock, volverá a estar visible en la tienda.</p>
                        <form onSubmit={handleRestoreSubmit}>
                            <label htmlFor="stock" className="block text-sm font-medium text-on-surface-secondary mb-2">
                                Nueva cantidad en Stock
                            </label>
                            <input
                                type="number"
                                id="stock"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                                className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="Ej: 10"
                                min="1"
                                required
                                autoFocus
                            />
                            <div className="mt-8 flex justify-end space-x-4">
                                <button type="button" onClick={handleCloseRestoreModal} className="py-2 px-5 border border-border-color rounded-md shadow-sm text-sm font-semibold text-on-surface bg-surface-light hover:bg-border-color transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={loading} className="py-2 px-5 border border-transparent rounded-md shadow-sm text-sm font-semibold text-slate-900 bg-primary hover:bg-primary-focus disabled:bg-gray-400 transition-colors">
                                    {loading ? 'Restaurando...' : 'Añadir y Restaurar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminArchivedProductsPage;