import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const OrderConfirmationPage: React.FC = () => {
    const { user } = useAppContext();

    return (
        <div className="text-center py-20 bg-surface rounded-lg shadow-2xl">
            <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-primary/10">
                <svg className="h-12 w-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold text-on-surface tracking-tight">¡Gracias por tu compra!</h1>
            <p className="mt-2 text-lg text-on-surface-secondary max-w-xl mx-auto">
                Hemos recibido tu pedido y lo estamos procesando. Tu moda está en camino.
            </p>
            <div className="mt-8 text-on-surface-secondary max-w-lg mx-auto bg-surface-light p-6 rounded-lg">
                <p>Recibirás una confirmación por correo electrónico en <strong className="text-primary">{user?.email}</strong> en breve.</p>
                <p className="mt-3">Tu pedido será enviado a:</p>
                <p className="font-semibold text-on-surface mt-1">{user?.address}</p>
            </div>
            <div className="mt-10">
                <Link to="/" className="bg-primary text-background font-bold py-3 px-8 rounded-full hover:bg-primary-focus transition-all duration-300 transform hover:scale-105 shadow-lg shadow-primary/20">
                    Volver a la Tienda
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;