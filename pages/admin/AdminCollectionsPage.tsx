import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminCollectionsPage: React.FC = () => {
    const { collections, deleteCollection } = useAppContext();

    const handleDelete = (collectionId: string, collectionName: string) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la colección "${collectionName}"? Los productos de esta colección quedarán sin asignar.`)) {
            deleteCollection(collectionId);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Gestionar Colecciones</h1>
                <Link
                    to="/admin/collections/new"
                    className="bg-primary text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-primary-focus transition-colors"
                >
                    Añadir Colección
                </Link>
            </div>
            <div className="bg-surface rounded-lg shadow-md overflow-x-auto border border-border-color">
                <table className="w-full text-sm text-left text-on-surface-secondary">
                    <thead className="text-xs text-on-surface-secondary uppercase bg-surface-light">
                        <tr>
                            <th scope="col" className="px-6 py-3">Icono</th>
                            <th scope="col" className="px-6 py-3">Nombre</th>
                            <th scope="col" className="px-6 py-3">Categoría Principal</th>
                            <th scope="col" className="px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections.map(collection => (
                            <tr key={collection.id} className="border-b border-border-color hover:bg-surface-light">
                                <td className="px-6 py-4 text-2xl">{collection.icon}</td>
                                <th scope="row" className="px-6 py-4 font-medium text-on-surface whitespace-nowrap">
                                    {collection.name}
                                </th>
                                <td className="px-6 py-4 capitalize">{collection.parentCategory}</td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <Link to={`/admin/collections/edit/${collection.id}`} className="font-medium text-primary-focus hover:underline">Editar</Link>
                                    <button onClick={() => handleDelete(collection.id, collection.name)} className="font-medium text-red-600 hover:underline">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCollectionsPage;