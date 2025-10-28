import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const UpdatePasswordPage: React.FC = () => {
    const { updateUserPassword, isAuthenticated, logout } = useAppContext();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // This page should only be accessible when the user is in a 'password recovery' state.
        // The `isAuthenticated` flag from context will be true in this specific case.
        if (!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        setError('');
        setIsLoading(true);
        const { error: updateError } = await updateUserPassword(password);
        if (updateError) {
            setError('El enlace de restablecimiento no es válido o ha expirado. Por favor, solicita uno nuevo.');
            setIsLoading(false);
        } else {
            // Password updated successfully. Log the user out so they can log in with the new password.
            await logout();
            navigate('/auth');
        }
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-10">
            <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-lg border border-border-color">
                <h2 className="text-3xl font-bold text-center mb-6 tracking-tight">Crea una Nueva Contraseña</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-600 text-sm text-center bg-red-100 p-3 rounded-md">{error}</p>}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-on-surface-secondary">Nueva Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-on-surface-secondary">Confirmar Nueva Contraseña</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-slate-900 bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary disabled:bg-gray-400 shadow-primary/30 hover:shadow-lg hover:shadow-primary/40"
                        >
                            {isLoading ? 'Guardando...' : 'Establecer Nueva Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePasswordPage;