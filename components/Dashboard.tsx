
import React, { useState, useMemo, useEffect } from 'react';
import Header from './Header';
// FIX: Corrected import paths to be relative.
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';
import ProjectView from './ProjectView';
import TrackTeamsView from './TrackTeamsView';
import CreateProjectModal from './CreateProjectModal';
import Button from './ui/Button';
// FIX: Corrected import path to be relative.
import { Project } from '../types';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { projects, createProject } = useSession();
    
    const [facultySelectedProject, setFacultySelectedProject] = useState<Project | null>(null);
    const [studentSelectedProject, setStudentSelectedProject] = useState<Project | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    // Get all projects for the current user's team
    const userProjects = useMemo(() => {
        if (user?.role === 'student' && user.teamId) {
            return projects.filter(p => p.teamId === user.teamId);
        }
        return [];
    }, [projects, user]);

    // This effect ensures that the local state for the selected project
    // is updated whenever the global projects list changes (e.g., when a leader is assigned).
    useEffect(() => {
        if (facultySelectedProject) {
            const updatedProject = projects.find(p => p.id === facultySelectedProject.id);
            setFacultySelectedProject(updatedProject || null);
        }
        if (studentSelectedProject) {
            const updatedProject = projects.find(p => p.id === studentSelectedProject.id);
            setStudentSelectedProject(updatedProject || null);
        }
    }, [projects, facultySelectedProject?.id, studentSelectedProject?.id]);

    if (!user) return null;

    const handleCreateProject = (name: string, description: string) => {
        createProject({ name, description }, user);
        setCreateModalOpen(false);
    };
    
    const renderStudentContent = () => {
        // If a project is selected, show it
        if (studentSelectedProject) {
            return <ProjectView project={studentSelectedProject} />;
        }

        // Show list of projects or empty state
        if (userProjects.length === 0) {
            return (
                <div className="text-center flex flex-col items-center justify-center h-full">
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold">Welcome, Team {user.teamId}!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6">You don't have any projects yet. Create your first project to get started!</p>
                        <Button onClick={() => setCreateModalOpen(true)}>Create New Project</Button>
                    </div>
                </div>
            );
        }

        // Show list of projects
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Projects</h2>
                    <Button onClick={() => setCreateModalOpen(true)}>Create New Project</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {userProjects.map(project => (
                        <div
                            key={project.id}
                            onClick={() => setStudentSelectedProject(project)}
                            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Progress: {project.progress}%</span>
                                <span className="text-indigo-600 dark:text-indigo-400">View →</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderFacultyContent = () => {
        if (facultySelectedProject) {
            return <ProjectView project={facultySelectedProject} />;
        }
        return <TrackTeamsView onSelectProject={setFacultySelectedProject} />;
    };
    
    const getHeaderTitle = () => {
        if(user.role === 'faculty') {
            return facultySelectedProject ? facultySelectedProject.name : "Teams Dashboard";
        }
        return studentSelectedProject ? studentSelectedProject.name : "My Projects";
    }

    const showBackButton = (user.role === 'faculty' && !!facultySelectedProject) || 
                          (user.role === 'student' && !!studentSelectedProject);

    return (
        <>
            <div className="flex flex-col h-screen">
                <Header 
                    viewTitle={getHeaderTitle()} 
                    showBack={showBackButton} 
                    onBack={() => {
                        if (user.role === 'faculty') {
                            setFacultySelectedProject(null);
                        } else {
                            setStudentSelectedProject(null);
                        }
                    }} 
                />
                <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {user.role === 'student' ? renderStudentContent() : renderFacultyContent()}
                </main>
            </div>
            {isCreateModalOpen && (
                <CreateProjectModal 
                    onClose={() => setCreateModalOpen(false)}
                    onCreate={handleCreateProject}
                />
            )}
        </>
    );
};

export default Dashboard;