import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const VerifyEmailPage: React.FC = () => {
    const { isAuthenticated } = useAppContext();
    const location = useLocation();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    
    // The actual verification is handled by the onAuthStateChange listener in AppContext.
    // This component just reacts to the auth state and URL params for user feedback.
    useEffect(() => {
        const hash = location.hash;
        // Supabase redirects with `#error=...` on failure.
        if (hash.includes('error')) {
            setStatus('error');
            return;
        }

        // If the listener has already authenticated the user, it's a success.
        if (isAuthenticated) {
            setStatus('success');
            return;
        }

        // If after a delay, the user is still not authenticated, assume an error.
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                setStatus('error');
            }
        }, 5000); // 5-second timeout

        return () => clearTimeout(timer);

    }, [isAuthenticated, location]);

    const getErrorMessage = () => {
        // You can add more specific error messages based on Supabase error codes in the URL if needed.
        return 'El enlace de verificación no es válido, ha expirado o ya ha sido utilizado.';
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center py-20">
            <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-lg border border-border-color text-center">
                {status === 'loading' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Verificando tu correo...</h2>
                        <p className="text-on-surface-secondary">Por favor, espera un momento.</p>
                        <div className="mt-6 w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin mx-auto"></div>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-green-600">¡Cuenta Verificada!</h2>
                        <p className="text-on-surface-secondary mb-6">Tu correo electrónico ha sido verificado con éxito.</p>
                        <Link to="/auth" className="bg-primary text-slate-900 font-bold py-2 px-6 rounded-full hover:bg-primary-focus transition-transform hover:scale-105 inline-block">
                            Ir a Iniciar Sesión
                        </Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2 className="text-2xl font-bold mb-4 text-red-600">Error de Verificación</h2>
                        <p className="text-on-surface-secondary mb-6">{getErrorMessage()}</p>
                        <Link to="/auth" className="font-medium text-primary-focus hover:text-amber-600">
                            Volver a la página de inicio de sesión
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;