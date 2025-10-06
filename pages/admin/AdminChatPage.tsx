import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const AdminChatPage: React.FC = () => {
    const { customerId } = useParams<{ customerId: string }>();
    const { customers, messages, sendMessage, user } = useAppContext();
    const [newMessage, setNewMessage] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const customer = useMemo(() => customers.find(c => c.id === customerId), [customers, customerId]);

    const conversation = useMemo(() => {
        if (!customerId) return [];
        return messages
            .filter(msg => (msg.fromId === user?.id && msg.toId === customerId) || (msg.fromId === customerId && msg.toId === user?.id))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [messages, customerId, user]);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [conversation]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() && customerId) {
            sendMessage(newMessage, customerId);
            setNewMessage('');
        }
    };

    if (!customer) {
        return (
            <div>
                <h1 className="text-2xl font-bold">Cliente no encontrado</h1>
                <Link to="/admin/customers" className="text-primary hover:underline mt-4 inline-block">Volver a Clientes</Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-surface-light rounded-lg shadow-md">
            <div className="p-4 border-b border-surface">
                <h1 className="text-xl font-bold">Chat con {customer.firstName} {customer.paternalLastName}</h1>
                <Link to="/admin/customers" className="text-sm text-primary hover:underline">&larr; Volver a Clientes</Link>
            </div>
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                {conversation.map(msg => (
                    <div key={msg.id} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.from === 'admin' ? 'bg-primary text-background' : 'bg-surface text-on-surface'}`}>
                            <p>{msg.text}</p>
                            <p className="text-xs opacity-75 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))}
                 {conversation.length === 0 && (
                    <p className="text-center text-on-surface-secondary">Inicia la conversación.</p>
                )}
            </div>
            <div className="p-4 border-t border-surface">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe tu mensaje..."
                        className="flex-1 px-3 py-2 bg-surface text-on-surface border border-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <button type="submit" className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-background bg-primary hover:bg-primary-focus">
                        Enviar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminChatPage;