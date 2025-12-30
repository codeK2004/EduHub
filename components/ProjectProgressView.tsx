import React, { useState } from 'react';
import { Project } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useSession } from '../hooks/useSession';
import Card from './ui/Card';
import Button from './ui/Button';

interface ProjectProgressViewProps {
    project: Project;
}

const ProjectProgressView: React.FC<ProjectProgressViewProps> = ({ project }) => {
    const { user } = useAuth();
    const { addTask, toggleTaskCompletion } = useSession();
    const [newTask, setNewTask] = useState('');

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.trim()) {
            addTask(project.id, newTask.trim());
            setNewTask('');
        }
    };

    return (
        <Card className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Project Progress</h3>
            
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-indigo-700 dark:text-white">Overall Progress</span>
                    <span className="text-sm font-medium text-indigo-700 dark:text-white">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                    <div className="bg-gradient-to-r from-sky-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                </div>
            </div>

            {/* Task List */}
            <div className="mb-6">
                <h4 className="text-xl font-semibold mb-3">Task Checklist</h4>
                <div className="space-y-3">
                    {project.tasks.length === 0 && (
                        <p className="text-slate-500 dark:text-slate-400">No tasks have been added yet.</p>
                    )}
                    {project.tasks.map(task => (
                        <div key={task.id} className="flex items-center p-3 bg-slate-100/70 dark:bg-slate-800/50 rounded-lg">
                            {user?.role === 'student' ? (
                                <input
                                    type="checkbox"
                                    id={task.id}
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(project.id, task.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                            ) : (
                                <div className="w-5 h-5 flex items-center justify-center">
                                    {task.completed ? (
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-slate-400"></div>
                                    )}
                                </div>
                            )}
                            <label htmlFor={task.id} className={`ml-3 text-sm font-medium ${task.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                {task.description}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Task Form for Students */}
            {user?.role === 'student' && (
                <form onSubmit={handleAddTask} className="mt-4 border-t dark:border-slate-700/50 pt-4">
                     <label htmlFor="new-task" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Add a new task</label>
                    <div className="flex gap-2">
                        <input
                            id="new-task"
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="e.g., Implement user authentication"
                            className="flex-grow bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Button type="submit" disabled={!newTask.trim()}>Add Task</Button>
                    </div>
                </form>
            )}
        </Card>
    );
};

export default ProjectProgressView;
