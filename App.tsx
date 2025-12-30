
import React from 'react';
// FIX: Corrected import paths to be relative.
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { SessionProvider } from './hooks/useSession';
import TeamSelectionPage from './components/TeamSelectionPage';

const AppContent: React.FC = () => {
    const { authStep, user } = useAuth();

    if (authStep === 'login') {
        return <LoginPage />;
    }
    if (authStep === 'team_selection' && user?.role === 'student') {
        return <TeamSelectionPage />;
    }
    if (authStep === 'authenticated' && user) {
        return <Dashboard />;
    }
    
    return <LoginPage />; // Fallback
};

const App: React.FC = () => {
    return (
        <SessionProvider>
            <AuthProvider>
                <div className="bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans">
                    <AppContent />
                </div>
            </AuthProvider>
        </SessionProvider>
    );
};

export default App;