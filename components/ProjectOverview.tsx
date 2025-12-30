import React from 'react';
import { Project, User } from '../types';
import { useSession } from '../hooks/useSession';
import { useAuth } from '../hooks/useAuth';
import Card from './ui/Card';
import Button from './ui/Button';

interface ProjectOverviewProps {
    project: Project;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ project }) => {
    const { user } = useAuth();
    const { getUsersInTeam, assignTeamLeader } = useSession();
    const teamMembers = getUsersInTeam(project.teamId);
    const minMembers = 2;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-500 dark:from-slate-200 dark:to-slate-400">{project.name}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{project.description}</p>
            </Card>
            <Card className="h-fit">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Team {project.teamId}</h3>
                    <span className="font-bold text-slate-600 dark:text-slate-300">{teamMembers.length} / 4 Members</span>
                </div>

                {teamMembers.length < minMembers && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-100/70 dark:bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-sm">
                        <b>Warning:</b> This team has fewer than the minimum of {minMembers} members.
                    </div>
                )}

                <ul className="space-y-3">
                    {teamMembers.map((member: User) => (
                        <li key={member.id} className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-200 to-indigo-200 dark:from-sky-800 dark:to-indigo-800 flex-shrink-0 flex items-center justify-center font-bold text-indigo-800 dark:text-indigo-200">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold">{member.name}</p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{member.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                {project.leaderId === member.id && (
                                    <span className="text-xs font-bold uppercase bg-amber-200 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 px-2 py-1 rounded-md">Leader</span>
                                )}
                                {user?.role === 'faculty' && project.leaderId !== member.id && (
                                    <Button variant="secondary" className="!py-1 !px-2.5 !text-xs" onClick={() => assignTeamLeader(project.teamId, member.id)}>
                                        Make Leader
                                    </Button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

export default ProjectOverview;