
import React from 'react';
// FIX: Corrected import path to be relative.
import { useAuth } from '../hooks/useAuth';
import Button from './ui/Button';

interface HeaderProps {
    viewTitle: string;
    showBack?: boolean;
    onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ viewTitle, showBack = false, onBack }) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-sm px-6 py-4 flex justify-between items-center z-10 border-b border-slate-200 dark:border-slate-800/50 flex-shrink-0">
            <div className="flex items-center gap-6">
                 {showBack && (
                    <Button onClick={onBack} variant="secondary" className="!p-2 rounded-full">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                    </Button>
                )}
                <div>
                    <h1 className="text-2xl font-bold truncate pr-4">{viewTitle}</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back, {user?.name}</p>
                </div>
            </div>
            <div className="flex items-center space-x-6">
                 <span className="text-sm font-medium capitalize bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 px-3 py-1.5 rounded-full">{user?.role}</span>
                <Button onClick={logout} variant="secondary">Logout</Button>
            </div>
        </header>
    );
};

export default Header;