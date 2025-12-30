import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Card from './ui/Card';
import Button from './ui/Button';

const LoginPage: React.FC = () => {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'student' | 'faculty'>('student');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && email.trim() && password.trim()) {
            login(name, email, password, role);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/50">
            <Card className="w-full max-w-sm">
                <div className="text-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-5.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                    <h1 className="text-3xl font-bold mt-4">EDUHUB</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Login or Sign Up to continue</p>
                </div>
                <form onSubmit={handleLogin} className="mt-8 space-y-6">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., Alice Johnson"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="e.g., alice@example.com"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Your Role</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${role === 'student' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-slate-300 dark:border-slate-700'}`}>
                                <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="sr-only" />
                                <span>Student</span>
                            </label>
                            <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${role === 'faculty' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-700 dark:text-indigo-300' : 'border-slate-300 dark:border-slate-700'}`}>
                                <input type="radio" name="role" value="faculty" checked={role === 'faculty'} onChange={() => setRole('faculty')} className="sr-only" />
                                <span>Faculty</span>
                            </label>
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={!name.trim() || !email.trim() || !password.trim()}>
                        Login / Sign Up
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default LoginPage;