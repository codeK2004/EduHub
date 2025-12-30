import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';

interface CreateFileModalProps {
    onClose: () => void;
    onCreate: (fileName: string, language: string) => void;
}

const LANGUAGES = ['HTML', 'CSS', 'JavaScript', 'Python', 'TypeScript', 'React (TSX)'];

const CreateFileModal: React.FC<CreateFileModalProps> = ({ onClose, onCreate }) => {
    const [fileName, setFileName] = useState('');
    const [language, setLanguage] = useState(LANGUAGES[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (fileName.trim()) {
            onCreate(fileName, language);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-2xl font-bold mb-4">Create a New File</h2>
                        <div className="mb-4">
                            <label htmlFor="file-name" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">File Name</label>
                            <input
                                id="file-name"
                                type="text"
                                value={fileName}
                                onChange={(e) => setFileName(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="e.g., styles.css, app.tsx"
                                required
                            />
                        </div>
                        <div className="mb-6">
                             <label htmlFor="file-language" className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Language</label>
                             <select
                                id="file-language"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {LANGUAGES.map(lang => (
                                    <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={!fileName.trim()}>Create File</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default CreateFileModal;
