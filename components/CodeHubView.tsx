import React, { useState, useEffect } from 'react';
import { Project, ProjectFile } from '../types';
import Card from './ui/Card';
import CodeEditor from './CodeEditor';
import AICodingAssistant from './AICodingAssistant';
import Button from './ui/Button';
import CreateFileModal from './CreateFileModal';
import { useSession } from '../hooks/useSession';

interface CodeHubViewProps {
    project: Project;
}

const CodeHubView: React.FC<CodeHubViewProps> = ({ project }) => {
    const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(project.files[0] || null);
    const [activeTab, setActiveTab] = useState('editor');
    const [isCreateFileModalOpen, setCreateFileModalOpen] = useState(false);
    const { addFileToProject, updateFileContent } = useSession();

    useEffect(() => {
        if (selectedFile) {
            const updatedFile = project.files.find(f => f.id === selectedFile.id);
            setSelectedFile(updatedFile || project.files[0] || null);
        } else {
            setSelectedFile(project.files[0] || null);
        }
    }, [project.files]);

    const handleCreateFile = (fileName: string, language: string) => {
        addFileToProject(project.id, fileName, language);
        setCreateFileModalOpen(false);
    };

    const handleSaveFile = (newContent: string) => {
        if (selectedFile) {
            updateFileContent(project.id, selectedFile.id, newContent);
        }
    };
    
    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-1 h-fit">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Project Files</h3>
                        <Button variant="secondary" className="!py-1 !px-2.5 !text-xs" onClick={() => setCreateFileModalOpen(true)}>New File</Button>
                    </div>
                    <ul>
                        {project.files.map(file => (
                            <li key={file.id}>
                                <button
                                    onClick={() => setSelectedFile(file)}
                                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                                        selectedFile?.id === file.id
                                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                                            : 'hover:bg-slate-200/70 dark:hover:bg-slate-700/50'
                                    }`}
                                >
                                    {file.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </Card>

                <div className="lg:col-span-3">
                    { !selectedFile ? (
                        <Card>This project has no files. Click 'New File' to get started.</Card>
                    ) : (
                        <>
                            <div className="mb-4 border-b border-slate-300 dark:border-slate-700">
                                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                    <button
                                        onClick={() => setActiveTab('editor')}
                                        className={`${ activeTab === 'editor' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                                    >
                                        Code Editor
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('assistant')}
                                        className={`${ activeTab === 'assistant' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}
                                    >
                                    AI Assistant
                                    </button>
                                </nav>
                            </div>
                            <div>
                                {activeTab === 'editor' && <CodeEditor file={selectedFile} onSave={handleSaveFile} />}
                                {activeTab === 'assistant' && <AICodingAssistant file={selectedFile} />}
                            </div>
                        </>
                    )}
                </div>
            </div>
            {isCreateFileModalOpen && (
                <CreateFileModal
                    onClose={() => setCreateFileModalOpen(false)}
                    onCreate={handleCreateFile}
                />
            )}
        </>
    );
};

export default CodeHubView;
