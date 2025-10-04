
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const OrderConfirmationPage: React.FC = () => {
    const { user } = useAppContext();

    return (
        <div className="text-center py-20 bg-surface rounded-lg shadow-lg">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="mt-4 text-4xl font-extrabold text-on-surface">¡Gracias por tu compra!</h1>
            <p className="mt-2 text-lg text-on-surface-secondary">
                Hemos recibido tu pedido y lo estamos procesando.
            </p>
            <div className="mt-6 text-on-surface-secondary max-w-lg mx-auto">
                <p>Recibirás una confirmación por correo electrónico en <strong>{user?.email}</strong> en breve.</p>
                <p className="mt-2">Tu pedido será enviado a:</p>
                <p className="font-medium text-on-surface">{user?.address}</p>
            </div>
            <div className="mt-8">
                <Link to="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-focus transition-colors">
                    Volver a la Tienda
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
