import React, { useState } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { Project, User } from '../types';
import { generateIEEEResearchPaper } from '../services/geminiService';

interface PaperGeneratorProps {
    project: Project;
    teamMembers: User[];
}

const PaperGenerator: React.FC<PaperGeneratorProps> = ({ project, teamMembers }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPaper, setGeneratedPaper] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedPaper('');

        try {
            const result = await generateIEEEResearchPaper(project, teamMembers);
            setGeneratedPaper(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-xl font-semibold">AI Paper Generator (IEEE Style)</h3>
                <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? 'Generating...' : 'Generate Abstract & Intro'}
                </Button>
            </div>
            {isLoading && <div className="flex justify-center py-10"><Spinner /></div>}
            {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border border-red-500/30">{error}</div>}
            {generatedPaper && (
                <div className="prose prose-slate dark:prose-invert max-w-none mt-4 p-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg border dark:border-slate-700/50">
                    <pre className="whitespace-pre-wrap font-sans text-sm">{generatedPaper}</pre>
                </div>
            )}
            {!isLoading && !generatedPaper && !error && (
                 <div className="text-center py-10 px-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <div className="inline-block p-4 bg-gradient-to-br from-sky-500/20 to-indigo-500/20 rounded-full mx-auto animate-pulse">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h4 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">Ready to Generate?</h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Click the button to generate a research paper abstract and introduction using Gemini AI.</p>
                </div>
            )}
        </Card>
    );
};

export default PaperGenerator;
