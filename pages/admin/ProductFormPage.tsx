import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';

const ProductFormPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { collections, addProduct, updateProduct, getProduct, addToast } = useAppContext();
    const isEditing = !!productId;
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    
    const initialFormData: Omit<Product, 'id' | 'averageRating' | 'reviewCount'> = {
        name: '',
        price: 0,
        imageUrl: '',
        category: 'dama',
        collectionId: '',
        description: '',
        stock: 0,
        isArchived: false
    };

    const [formData, setFormData] = useState<Omit<Product, 'id' | 'averageRating' | 'reviewCount'>>(initialFormData);

    useEffect(() => {
        if (isEditing) {
            const fetchProduct = async () => {
                const productToEdit = await getProduct(productId);
                if (productToEdit) {
                    setFormData(productToEdit);
                } else {
                    addToast('Producto no encontrado.', 'error');
                    navigate('/admin/products');
                }
            };
            fetchProduct();
        } else {
             // On "new product" page, default to the first collection if available
            const defaultCollection = collections.find(c => c.parentCategory === 'dama') || collections[0];
            if (defaultCollection) {
                setFormData(prev => ({ ...prev, collectionId: defaultCollection.id }));
            }
        }
    }, [isEditing, productId, getProduct, navigate, collections, addToast]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        let processedValue: string | number = value;
        if (type === 'number') {
            processedValue = value === '' ? '' : Number(value);
        }

        setFormData(prev => ({ ...prev, [name]: processedValue }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        const productData = {
            ...formData,
            price: Number(formData.price),
            stock: Number(formData.stock)
        };

        if (isEditing) {
            await updateProduct({ ...productData, id: productId! });
            navigate('/admin/products');
        } else {
            const success = await addProduct(productData);
            if (success) {
                setShowConfirmationModal(true);
            }
        }
        
        setIsLoading(false);
    };

    const handleAddAnother = () => {
        setFormData(initialFormData); // Reset the form
        setShowConfirmationModal(false);
    };

    const handleReturnToList = () => {
        setShowConfirmationModal(false);
        navigate('/admin/products');
    };

    const filteredCollections = collections.filter(c => c.parentCategory === formData.category);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 tracking-tight">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h1>
            <div className="max-w-4xl mx-auto bg-surface-light p-8 rounded-lg shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-on-surface-secondary">Nombre del Producto</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-on-surface-secondary">Precio</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>

                     <div>
                        <label className="block text-sm font-medium text-on-surface-secondary">Imagen del Producto</label>
                        <div className="mt-1 flex items-center space-x-4">
                            {formData.imageUrl && (
                                <img src={formData.imageUrl} alt="Vista previa" className="w-24 h-24 object-cover rounded-md bg-surface border border-border-color" />
                            )}
                            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 bg-surface text-on-surface-secondary border border-border-color rounded-md shadow-sm text-sm font-medium hover:bg-surface-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-light focus:ring-primary"
                            >
                                Elegir archivo
                            </button>
                            <span className="text-sm text-on-surface-secondary truncate">{fileInputRef.current?.files?.[0]?.name}</span>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-on-surface-secondary">Descripción</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-on-surface-secondary">Stock</label>
                            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                       <div>
                            <label htmlFor="category" className="block text-sm font-medium text-on-surface-secondary">Categoría Principal</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-border-color bg-surface text-on-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                <option value="dama">Dama</option>
                                <option value="nino">Niño</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="collectionId" className="block text-sm font-medium text-on-surface-secondary">Colección</label>
                            <select name="collectionId" id="collectionId" value={formData.collectionId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-border-color bg-surface text-on-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                <option value="">-- Selecciona una colección --</option>
                                {filteredCollections.map(collection => (
                                    <option key={collection.id} value={collection.id}>{collection.name}</option>
                                ))}
                            </select>
                        </div>
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

            {showConfirmationModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-surface p-8 rounded-lg shadow-2xl max-w-sm w-full text-center">
                        <h2 className="text-2xl font-bold mb-4">¡Éxito!</h2>
                        <p className="text-on-surface-secondary mb-8">El producto ha sido creado correctamente. ¿Qué te gustaría hacer ahora?</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={handleAddAnother} className="flex-1 py-2 px-4 border border-primary rounded-md text-sm font-medium text-primary-focus bg-primary/10 hover:bg-primary/20">
                                Añadir otro producto
                            </button>
                            <button onClick={handleReturnToList} className="flex-1 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-slate-900 bg-primary hover:bg-primary-focus">
                                Volver a la lista
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFormPage;