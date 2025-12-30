import React from 'react';
import { Project } from '../types';
import PaperGenerator from './PaperGenerator';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';

interface PaperGeneratorViewProps {
    project: Project;
}

const PaperGeneratorView: React.FC<PaperGeneratorViewProps> = ({ project }) => {
    const { user } = useAuth();
    const { getUsersInTeam } = useSession();
    const teamMembers = getUsersInTeam(project.teamId);
    
    return (
         <div className="max-w-4xl mx-auto">
            {user?.role === 'student' &&
                <div className="mb-6 p-4 rounded-lg bg-sky-100/70 dark:bg-sky-500/10 border border-sky-500/20 text-sky-800 dark:text-sky-300">
                    <h4 className="font-semibold">For Students</h4>
                    <p className="text-sm mt-1">You can generate new paper content based on your project's current state. This is a powerful tool to help you get started on your research paper.</p>
                </div>
            }
             {user?.role === 'faculty' &&
                <div className="mb-6 p-4 rounded-lg bg-indigo-100/70 dark:bg-indigo-500/10 border border-indigo-500/20 text-indigo-800 dark:text-indigo-300">
                    <h4 className="font-semibold">For Faculty</h4>
                    <p className="text-sm mt-1">You can view the paper generation tool. The generated content is based on the team's project description and code files. You cannot generate new content from this view.</p>
                </div>
            }
            <PaperGenerator project={project} teamMembers={teamMembers} />
        </div>
    );
};

export default PaperGeneratorView;
