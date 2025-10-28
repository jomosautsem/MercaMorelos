import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const ForgotPasswordPage: React.FC = () => {
    const { forgotPassword } = useAppContext();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');
        const success = await forgotPassword(email);
        if (success) {
            setMessage('Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña. Revisa tu bandeja de entrada.');
        } else {
            // Error toast is handled by context, but we can set a generic message here too
             setMessage('Ocurrió un error. Por favor, inténtalo de nuevo.');
        }
        setIsLoading(false);
        setEmail('');
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-10">
            <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-lg border border-border-color">
                <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">Restablecer Contraseña</h2>
                <p className="text-center text-on-surface-secondary mb-6">Ingresa tu correo y te enviaremos un enlace para recuperar tu cuenta.</p>
                {message ? (
                    <div className="text-center bg-green-100 text-green-800 p-4 rounded-md mb-6">
                        <p>{message}</p>
                        <Link to="/auth" className="font-bold underline mt-2 inline-block">Volver a Iniciar Sesión</Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-on-surface-secondary">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="mt-1 block w-full px-4 py-2.5 bg-surface-light text-on-surface border border-border-color rounded-md shadow-sm placeholder-on-surface-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="tu@correo.com"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-slate-900 bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary disabled:bg-gray-400 shadow-primary/30 hover:shadow-lg hover:shadow-primary/40"
                            >
                                {isLoading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}
                            </button>
                        </div>
                    </form>
                )}
                 <p className="mt-6 text-center text-sm text-on-surface-secondary">
                    ¿Recordaste tu contraseña?
                    <Link to="/auth" className="font-medium text-primary-focus hover:text-amber-600 ml-1">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
