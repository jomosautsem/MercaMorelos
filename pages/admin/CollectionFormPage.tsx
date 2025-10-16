import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Collection } from '../../types';

const CollectionFormPage: React.FC = () => {
    const { collectionId } = useParams<{ collectionId: string }>();
    const navigate = useNavigate();
    const { collections, addCollection, updateCollection } = useAppContext();
    const isEditing = !!collectionId;
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState<Omit<Collection, 'id'>>({
        name: '',
        icon: '',
        parentCategory: 'dama',
    });

    useEffect(() => {
        if (isEditing) {
            const collectionToEdit = collections.find(c => c.id === collectionId);
            if (collectionToEdit) {
                setFormData(collectionToEdit);
            } else {
                navigate('/admin/collections');
            }
        }
    }, [isEditing, collectionId, collections, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (isEditing) {
            await updateCollection({ ...formData, id: collectionId! });
        } else {
            await addCollection(formData);
        }
        setIsLoading(false);
        navigate('/admin/collections');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 tracking-tight">{isEditing ? 'Editar Colección' : 'Añadir Nueva Colección'}</h1>
            <div className="max-w-xl mx-auto bg-surface-light p-8 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface-secondary">Nombre de la Colección</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="icon" className="block text-sm font-medium text-on-surface-secondary">Icono (Emoji)</label>
                            <input type="text" name="icon" id="icon" value={formData.icon} onChange={handleChange} required maxLength={2} placeholder="Ej: 👗" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                       <div>
                            <label htmlFor="parentCategory" className="block text-sm font-medium text-on-surface-secondary">Categoría Principal</label>
                            <select name="parentCategory" id="parentCategory" value={formData.parentCategory} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-border-color bg-surface text-on-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                <option value="dama">Dama</option>
                                <option value="nino">Niño</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => navigate('/admin/collections')} className="py-2 px-4 border border-border-color rounded-md shadow-sm text-sm font-medium text-on-surface bg-surface hover:bg-surface-light">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-primary hover:bg-primary-focus disabled:bg-gray-400">
                            {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Colección')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CollectionFormPage;