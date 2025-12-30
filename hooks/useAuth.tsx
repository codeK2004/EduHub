import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '../types';
import { useSession } from './useSession';
import { socketService } from '../services/socketService';

type AuthStep = 'login' | 'team_selection' | 'authenticated';

interface AuthContextType {
    user: User | null;
    authStep: AuthStep;
    login: (name: string, email: string, password: string, role: 'student' | 'faculty') => void;
    logout: () => void;
    selectTeam: (teamId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authStep, setAuthStep] = useState<AuthStep>('login');
    const { addUser, updateUser, users } = useSession();

    const login = (name: string, email: string, password: string, role: 'student' | 'faculty') => {
        // Password is not validated in this prototype
        const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (existingUser) {
            // User exists, log them in
            setUser(existingUser);
            if (existingUser.role === 'student' && !existingUser.teamId) {
                setAuthStep('team_selection');
            } else {
                setAuthStep('authenticated');
            }
            return;
        }

        // New user, sign them up
        const newUser: User = {
            id: `user_${Date.now()}`,
            email,
            name: name,
            role,
        };
        
        addUser(newUser); // Add to global session
        setUser(newUser);

        if (role === 'student') {
            setAuthStep('team_selection');
        } else {
            setAuthStep('authenticated');
        }
    };

    const logout = () => {
        // Notify server user is logging out (but keep their data)
        if (user) {
            socketService.logoutUser(user.id);
        }
        // Clear local state only (server keeps the data)
        setUser(null);
        setAuthStep('login');
    };

    const selectTeam = (teamId: string) => {
        if (user && user.role === 'student') {
            const updatedUser = { ...user, teamId };
            setUser(updatedUser);
            updateUser(updatedUser); // Update user in global session
            setAuthStep('authenticated');
        }
    };

    return (
        <AuthContext.Provider value={{ user, authStep, login, logout, selectTeam }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};