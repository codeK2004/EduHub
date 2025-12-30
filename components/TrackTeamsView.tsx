import React from 'react';
// FIX: Corrected import paths to be relative.
import { useSession } from '../hooks/useSession';
import { Project } from '../types';
import Card from './ui/Card';

interface TrackTeamsViewProps {
    onSelectProject: (project: Project) => void;
}

const TrackTeamsView: React.FC<TrackTeamsViewProps> = ({ onSelectProject }) => {
    const { projects, getUsersInTeam } = useSession();

    const teams = Array.from({ length: 30 }, (_, i) => `A${i + 1}`);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Track Teams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(teamId => {
                    const members = getUsersInTeam(teamId);
                    const project = projects.find(p => p.teamId === teamId);
                    if (members.length === 0) return null; // Only show teams with logged-in members

                    const progress = project ? project.progress : 0;

                    return (
                        <Card 
                            key={teamId} 
                            className={`transition-all duration-300 ${!project ? 'opacity-60' : 'cursor-pointer hover:border-indigo-500/50 hover:shadow-2xl'}`}
                            onClick={() => project && onSelectProject(project)}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{teamId}</h3>
                                <span className="text-sm font-semibold bg-slate-200 dark:bg-slate-700 px-3 py-1 rounded-full">{members.length} / 4</span>
                            </div>
                            <div className="mt-4">
                                <p className="font-semibold truncate text-lg h-6">{project ? project.name : 'No project created'}</p>
                                <div className="mt-3">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress</span>
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                                <div className="mt-4 min-h-[5rem]">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Active Members:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {members.map(m => <span key={m.id} className="text-xs bg-slate-100 dark:bg-slate-900/50 px-2 py-1 rounded">{m.name}</span>)}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default TrackTeamsView;