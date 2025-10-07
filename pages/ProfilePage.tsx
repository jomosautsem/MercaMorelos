
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { User } from '../types';

type UserProfileData = Omit<User, 'id' | 'role' | 'email'>;

const ProfilePage: React.FC = () => {
    const { user, updateProfile, changePassword, error } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState<UserProfileData>({
        firstName: '',
        paternalLastName: '',
        maternalLastName: '',
        address: '',
    });

    const [passwordData, setPasswordData] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName,
                paternalLastName: user.paternalLastName,
                maternalLastName: user.maternalLastName,
                address: user.address,
            });
        }
    }, [user]);
    
    useEffect(() => {
        if(error) {
            setMessage({ type: 'error', text: error });
        }
    }, [error]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        const updatedUser = await updateProfile(formData);
        if (updatedUser) {
            setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
            setIsEditing(false);
        } else {
             setMessage({ type: 'error', text: 'No se pudo actualizar el perfil.' });
        }
        setIsLoading(false);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) {
            setMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        const success = await changePassword(passwordData);
        if (success) {
            setMessage({ type: 'success', text: '¡Contraseña cambiada con éxito!' });
            setPasswordData({ current: '', new: '', confirm: '' });
        } else {
            // Error message is already set by the context hook
        }
        setIsLoading(false);
    };
    
    const FormField: React.FC<{
        name: keyof UserProfileData;
        label: string;
        value: string;
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        disabled?: boolean;
    }> = ({ name, label, value, onChange, disabled }) => (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-on-surface-secondary">{label}</label>
            <input
                type="text"
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="mt-1 block w-full px-3 py-2 bg-surface-light border border-surface-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:bg-surface disabled:text-on-surface-secondary"
            />
        </div>
    );
    
    if (!user) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Mi Perfil</h1>
            {message && (
                <div className={`mb-6 p-4 rounded-md text-sm font-semibold ${message.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {message.text}
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <form onSubmit={handleProfileSubmit} className="bg-surface p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-2xl font-bold">Datos Personales</h2>
                             {!isEditing && (
                                <button type="button" onClick={() => setIsEditing(true)} className="text-sm font-semibold text-primary hover:underline">Editar</button>
                             )}
                        </div>
                        <div className="space-y-4">
                            <FormField name="firstName" label="Nombre" value={formData.firstName} onChange={handleFormChange} disabled={!isEditing} />
                            <FormField name="paternalLastName" label="Apellido Paterno" value={formData.paternalLastName} onChange={handleFormChange} disabled={!isEditing} />
                            <FormField name="maternalLastName" label="Apellido Materno" value={formData.maternalLastName} onChange={handleFormChange} disabled={!isEditing} />
                            <FormField name="address" label="Dirección de Envío" value={formData.address} onChange={handleFormChange} disabled={!isEditing} />
                            <div>
                                <label className="block text-sm font-medium text-on-surface-secondary">Correo Electrónico</label>
                                <input type="email" value={user.email} disabled className="mt-1 block w-full px-3 py-2 bg-surface text-on-surface-secondary border border-surface-light rounded-md shadow-sm"/>
                            </div>
                        </div>
                        {isEditing && (
                            <div className="flex justify-end space-x-4 mt-8">
                                <button type="button" onClick={() => setIsEditing(false)} className="py-2 px-4 border border-surface-light rounded-md shadow-sm text-sm font-medium text-on-surface bg-surface-light hover:bg-surface">Cancelar</button>
                                <button type="submit" disabled={isLoading} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary-focus disabled:opacity-50">
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
                <div>
                     <form onSubmit={handlePasswordSubmit} className="bg-surface p-6 rounded-lg shadow-lg">
                         <h2 className="text-2xl font-bold mb-6">Cambiar Contraseña</h2>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-on-surface-secondary">Contraseña Actual</label>
                                <input type="password" name="current" value={passwordData.current} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 bg-surface-light border border-surface-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-secondary">Nueva Contraseña</label>
                                <input type="password" name="new" value={passwordData.new} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 bg-surface-light border border-surface-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-on-surface-secondary">Confirmar Nueva Contraseña</label>
                                <input type="password" name="confirm" value={passwordData.confirm} onChange={handlePasswordChange} required className="mt-1 block w-full px-3 py-2 bg-surface-light border border-surface-light rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"/>
                            </div>
                         </div>
                         <div className="mt-8">
                             <button type="submit" disabled={isLoading} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-secondary hover:bg-secondary-focus disabled:opacity-50">
                                 {isLoading ? 'Actualizando...' : 'Actualizar Contraseña'}
                             </button>
                         </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
