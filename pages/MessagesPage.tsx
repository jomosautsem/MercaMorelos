import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';

const MessagesPage: React.FC = () => {
    const { user, messages, sendMessage, markMessagesAsRead } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const ADMIN_ID = 'admin-user';

    useEffect(() => {
        markMessagesAsRead(ADMIN_ID);
    }, [markMessagesAsRead]);

    const conversation = useMemo(() => {
        if (!user) return [];
        // FIX: The filter now correctly identifies messages from any admin by their role,
        // rather than relying on a hardcoded and incorrect ID. This ensures messages
        // sent by the admin appear in the customer's chat window.
        return messages
            .filter(msg => (msg.fromId === user.id) || (msg.toId === user.id && msg.from === 'admin'))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, user]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage, ADMIN_ID);
            setNewMessage('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-extrabold mb-6 tracking-tight">Mis Mensajes</h1>
            <div className="flex flex-col h-[calc(100vh-16rem)] bg-surface rounded-lg shadow-2xl">
                <div className="p-4 border-b border-surface-light">
                    <h2 className="text-xl font-bold">Chat con Soporte</h2>
                    <p className="text-sm text-on-surface-secondary">Aquí puedes comunicarte con nuestro equipo.</p>
                </div>
                <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                     {conversation.map(msg => (
                        <div key={msg.id} className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow ${msg.from === 'customer' ? 'bg-primary text-background' : 'bg-surface-light text-on-surface'}`}>
                                <p>{msg.text}</p>
                                <p className="text-xs opacity-75 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </div>
                        </div>
                    ))}
                    {conversation.length === 0 && (
                        <p className="text-center text-on-surface-secondary pt-10">No tienes mensajes. ¡Envía uno para empezar!</p>
                    )}
                </div>
                <div className="p-4 border-t border-surface-light">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            className="flex-1 px-4 py-2.5 bg-surface-light text-on-surface border border-surface-light rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                        <button type="submit" className="py-2 px-6 border border-transparent rounded-full shadow-sm text-sm font-bold text-background bg-primary hover:bg-primary-focus">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;