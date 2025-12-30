
import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import { ChatMessage } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';

interface ChatWindowProps {
    title?: string;
    teamId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ title = "Group Chat", teamId }) => {
    const { user } = useAuth();
    const { chatMessages, sendMessage } = useSession();
    const messages = chatMessages[teamId] || [];
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || !user) return;

        sendMessage(teamId, newMessage, { id: user.id, name: user.name });
        setNewMessage('');
    };

    return (
        <Card className="flex flex-col h-[44rem]">
            <h3 className="text-xl font-semibold mb-4 border-b dark:border-slate-700 pb-3">{title}</h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-4 my-4">
                {messages.length === 0 && (
                    <div className="text-center text-slate-500 pt-16">
                        <p>No messages yet.</p>
                        <p>Start the conversation!</p>
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className={`flex items-end gap-2 ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}>
                       {msg.sender.id !== user?.id && <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0"></div>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${msg.sender.id === user?.id ? 'bg-gradient-to-br from-sky-500 to-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender.id === user?.id ? 'text-sky-100/80' : 'text-slate-500 dark:text-slate-400'} text-right`}>{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="mt-auto flex gap-2 pt-2 border-t dark:border-slate-700">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-grow bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button type="submit" className="bg-gradient-to-r from-sky-500 to-indigo-500 text-white p-2.5 rounded-lg hover:from-sky-600 hover:to-indigo-600 transition-all transform hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009.17 15.17l-1.417-5.667a1 1 0 01.293-.973l5-5a1 1 0 000-1.414l-4.243-4.243z" />
                    </svg>
                </button>
            </form>
        </Card>
    );
};

export default ChatWindow;
