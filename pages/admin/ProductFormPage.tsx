import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';

const ProductFormPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { getProduct, addProduct, updateProduct, collections, addToast } = useAppContext();
    const isEditing = !!productId;
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState<Omit<Product, 'id' | 'averageRating' | 'reviewCount'>>({
        name: '',
        price: 0,
        imageUrl: '',
        category: 'dama',
        collectionId: '',
        description: '',
        stock: 0,
        isArchived: false,
    });

    useEffect(() => {
        if (isEditing) {
            const fetchProduct = async () => {
                // `getProduct` now fetches from all products including archived ones for editing
                const productToEdit = await getProduct(productId);
                if (productToEdit) {
                    setFormData({
                        name: productToEdit.name,
                        price: productToEdit.price,
                        imageUrl: productToEdit.imageUrl,
                        category: productToEdit.category,
                        collectionId: productToEdit.collectionId || '',
                        description: productToEdit.description,
                        stock: productToEdit.stock,
                        isArchived: productToEdit.isArchived,
                    });
                } else {
                    addToast('Producto no encontrado', 'error');
                    navigate('/admin/products');
                }
            };
            fetchProduct();
        }
    }, [isEditing, productId, getProduct, navigate, addToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number | boolean = value;
        if (type === 'number') {
            processedValue = value === '' ? '' : Number(value);
        } else if (type === 'checkbox') {
             processedValue = (e.target as HTMLInputElement).checked;
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock),
            // A product with stock should not be archived unless explicitly set
            isArchived: Number(formData.stock) > 0 ? false : true,
        };

        if (isEditing) {
            await updateProduct({ ...productData, id: productId! });
        } else {
            await addProduct(productData);
        }
        setIsLoading(false);
        navigate('/admin/products');
    };
    
    const collectionsForCategory = collections.filter(c => c.parentCategory === formData.category);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 tracking-tight">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h1>
            <div className="max-w-4xl mx-auto bg-surface-light p-8 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface-secondary">Nombre del Producto</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="price" className="block text-sm font-medium text-on-surface-secondary">Precio</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required step="0.01" min="0" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                       <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-on-surface-secondary">Stock (Cantidad)</label>
                            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-on-surface-secondary">Categoría</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-border-color bg-surface text-on-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                <option value="dama">Dama</option>
                                <option value="nino">Niño</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="collectionId" className="block text-sm font-medium text-on-surface-secondary">Colección (Opcional)</label>
                            <select name="collectionId" id="collectionId" value={formData.collectionId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-border-color bg-surface text-on-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                <option value="">-- Sin colección --</option>
                                {collectionsForCategory.map(col => (
                                    <option key={col.id} value={col.id}>{col.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-on-surface-secondary">Descripción</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>

                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-on-surface-secondary">URL de la Imagen</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required placeholder="https://picsum.photos/400/400" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => navigate('/admin/products')} className="py-2 px-4 border border-border-color rounded-md shadow-sm text-sm font-medium text-on-surface bg-surface hover:bg-surface-light">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-900 bg-primary hover:bg-primary-focus disabled:bg-gray-400">
                            {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormPage;
