import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface CreateProjectModalProps {
    onClose: () => void;
    onCreate: (name: string, description: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && description.trim()) {
            onCreate(name, description);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold mb-4">Create a New Project</h2>
                        <div className="mb-4">
                            <label htmlFor="project-name" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Project Name</label>
                            <input
                                id="project-name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., AI-Powered Research Assistant"
                                required
                            />
                        </div>
                        <div className="mb-6">
                             <label htmlFor="project-desc" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Project Description</label>
                            <textarea
                                id="project-desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full h-28 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Briefly describe what your project is about."
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={!name.trim() || !description.trim()}>Create Project</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateProjectModal;
