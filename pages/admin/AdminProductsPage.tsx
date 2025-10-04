import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminProductsPage: React.FC = () => {
    const { allProducts, deleteProduct } = useAppContext();

    const handleDelete = (productId: string, productName: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
            deleteProduct(productId);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestionar Productos</h1>
                <Link
                    to="/admin/products/new"
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors"
                >
                    Añadir Producto
                </Link>
            </div>
            <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
                        {allProducts.map(product => (
                            <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded"/>
                                </td>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {product.name}
                                </th>
                                <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                                <td className="px-6 py-4">{product.stock}</td>
                                <td className="px-6 py-4 capitalize">{product.category}</td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <Link to={`/admin/products/edit/${product.id}`} className="font-medium text-primary hover:underline">Editar</Link>
                                    <button onClick={() => handleDelete(product.id, product.name)} className="font-medium text-red-600 hover:underline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProductsPage;
