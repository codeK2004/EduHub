import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';
import Card from './ui/Card';
import Button from './ui/Button';

const TeamSelectionPage: React.FC = () => {
    const { user, selectTeam } = useAuth();
    const { getUsersInTeam } = useSession();
    const [teamInput, setTeamInput] = useState('');

    const MAX_TEAM_MEMBERS = 4;

    const teamMembers = useMemo(() => {
        return getUsersInTeam(teamInput);
    }, [teamInput, getUsersInTeam]);

    const isValidTeamFormat = /^(A([1-9]|[12][0-9]|30))$/i.test(teamInput);
    const isTeamFull = teamMembers.length >= MAX_TEAM_MEMBERS;
    const canJoin = isValidTeamFormat && !isTeamFull;

    const handleSelectTeam = (e: React.FormEvent) => {
        e.preventDefault();
        if (canJoin) {
            selectTeam(teamInput.toUpperCase());
        }
    };
    
    const getValidationMessage = () => {
        if (!teamInput) return null;
        if (!isValidTeamFormat) {
            return <p className="text-sm text-red-500 mt-2">Invalid format. Please use A1-A30.</p>;
        }
        if (isTeamFull) {
            return <p className="text-sm text-red-500 mt-2">This team is full ({teamMembers.length}/{MAX_TEAM_MEMBERS}).</p>;
        }
        return <p className="text-sm text-green-600 dark:text-green-400 mt-2">This team is available ({teamMembers.length}/{MAX_TEAM_MEMBERS} members).</p>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/50 p-4">
            <Card className="w-full max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Join a Team</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome, {user?.name}! Enter your team name to continue.</p>
                </div>
                <form onSubmit={handleSelectTeam} className="mt-8 space-y-4">
                    <div>
                        <label htmlFor="team-input" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Team Name (e.g., A1, a2, A30)</label>
                        <input
                            id="team-input"
                            type="text"
                            value={teamInput}
                            onChange={(e) => setTeamInput(e.target.value)}
                            className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                            placeholder="A15"
                        />
                        <div className="h-6">
                           {getValidationMessage()}
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={!canJoin}>
                        Join Team & Continue
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default TeamSelectionPage;
