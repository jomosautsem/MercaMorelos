
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
        return messages
            .filter(msg => (msg.fromId === user.id && msg.toId === ADMIN_ID) || (msg.fromId === ADMIN_ID && msg.toId === user.id))
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
            <h1 className="text-3xl font-bold mb-6">Mis Mensajes</h1>
            <div className="flex flex-col h-[calc(100vh-14rem)] bg-surface rounded-lg shadow-md">
                <div className="p-4 border-b">
                    <h2 className="text-xl font-bold">Chat con Soporte</h2>
                    <p className="text-sm text-on-surface-secondary">Aquí puedes comunicarte con nuestro equipo.</p>
                </div>
                <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                     {conversation.map(msg => (
                        <div key={msg.id} className={`flex ${msg.from === 'customer' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.from === 'customer' ? 'bg-primary text-white' : 'bg-gray-200 text-on-surface'}`}>
                                <p>{msg.text}</p>
                                <p className="text-xs opacity-75 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                            </div>
                        </div>
                    ))}
                    {conversation.length === 0 && (
                        <p className="text-center text-on-surface-secondary">No tienes mensajes. ¡Envía uno para empezar!</p>
                    )}
                </div>
                <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Escribe tu respuesta..."
                            className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                        <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;
