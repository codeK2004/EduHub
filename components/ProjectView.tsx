import React, { useState } from 'react';
// FIX: Corrected import paths to be relative.
import { Project } from '../types';
import ProjectOverview from './ProjectOverview';
import PaperGeneratorView from './PaperGeneratorView';
import FacultyFeedbackView from './FacultyFeedbackView';
import GroupChatView from './GroupChatView';
// FIX: Corrected import path to be relative.
import { useAuth } from '../hooks/useAuth';
import ProjectProgressView from './ProjectProgressView';
import TeamSyncView from './TeamSyncView';

interface ProjectViewProps {
    project: Project;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project }) => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');

    const studentTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'progress', label: 'Progress' },
        { id: 'chat', label: 'Group Chat' },
        { id: 'sync', label: 'Team Sync' },
        { id: 'paper', label: 'Paper Generator' },
    ];
    
    const facultyTabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'progress', label: 'Progress' },
        { id: 'feedback', label: 'Feedback Channel' },
        { id: 'sync', label: 'Team Sync' },
    ];
    
    const tabs = user?.role === 'student' ? studentTabs : facultyTabs;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <ProjectOverview project={project} />;
            case 'progress':
                return <ProjectProgressView project={project} />;
            case 'chat':
                return <GroupChatView teamId={project.teamId} />; // Student only
            case 'paper':
                return <PaperGeneratorView project={project} />;
            case 'feedback':
                return <FacultyFeedbackView teamId={project.teamId} />; // Faculty only
            case 'sync':
                return <TeamSyncView project={project} />;
            default:
                return null;
        }
    };

    return (
        <div>
            <div className="mb-6 border-b border-slate-300 dark:border-slate-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div>
                {renderTabContent()}
            </div>
        </div>
    );
};

export default ProjectView;
