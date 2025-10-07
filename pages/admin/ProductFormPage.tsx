import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';

type ProductFormData = Omit<Product, 'id' | 'price' | 'stock'> & {
    price: string | number;
    stock: string | number;
};

const ProductFormPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { allProducts, addProduct, updateProduct } = useAppContext();
    const isEditing = !!productId;
    const [isLoading, setIsLoading] = useState(false);
    
    const [formData, setFormData] = useState<ProductFormData>({
        name: '',
        price: '',
        imageUrl: '',
        category: 'dama',
        description: '',
        stock: '',
    });
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (isEditing) {
            const productToEdit = allProducts.find(p => p.id === productId);
            if (productToEdit) {
                setFormData(productToEdit);
                setImagePreview(productToEdit.imageUrl);
            } else {
                navigate('/admin/products');
            }
        }
    }, [isEditing, productId, allProducts, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({ ...prev, imageUrl: result }));
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.imageUrl) {
            alert('Por favor, sube una imagen para el producto.');
            return;
        }
        setIsLoading(true);
        
        const stockValue = parseInt(String(formData.stock), 10) || 0;
        // FIX: Added the 'isArchived' property to satisfy the 'Omit<Product, 'id'>' type.
        // The value is determined by the stock, aligning with backend logic.
        const productDataForApi: Omit<Product, 'id'> = {
            name: formData.name,
            description: formData.description,
            imageUrl: formData.imageUrl,
            category: formData.category,
            price: Number(formData.price) || 0,
            stock: stockValue,
            isArchived: stockValue <= 0,
        };

        if (isEditing) {
            await updateProduct({ ...productDataForApi, id: productId! });
        } else {
            await addProduct(productDataForApi);
        }
        setIsLoading(false);
        navigate('/admin/products');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 tracking-tight">{isEditing ? 'Editar Producto' : 'Añadir Nuevo Producto'}</h1>
            <div className="max-w-3xl mx-auto bg-surface-light p-8 rounded-lg shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface-secondary">Nombre del Producto</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-on-surface-secondary">Descripción</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} required className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-on-surface-secondary">Precio</label>
                            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" placeholder="Ej: 49.99" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                         <div>
                            <label htmlFor="stock" className="block text-sm font-medium text-on-surface-secondary">Stock</label>
                            <input type="number" name="stock" id="stock" value={formData.stock} onChange={handleChange} required min="0" placeholder="Ej: 15" className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface border border-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                            <label htmlFor="category" className="block text-sm font-medium text-on-surface-secondary">Categoría</label>
                            <select name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-surface bg-surface text-on-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                <option value="dama">Dama</option>
                                <option value="nino">Niño</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-on-surface-secondary">Imagen del Producto</label>
                            <div className="mt-1 flex items-center space-x-4">
                                {imagePreview && <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded"/>}
                                <input type="file" id="imageUrl" name="imageUrl" onChange={handleImageChange} accept="image/*" className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={() => navigate('/admin/products')} className="py-2 px-4 border border-surface rounded-md shadow-sm text-sm font-medium text-on-surface bg-surface-light hover:bg-surface">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isLoading} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary-focus disabled:bg-gray-600">
                            {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Producto')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormPage;
