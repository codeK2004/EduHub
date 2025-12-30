import React, { useState } from 'react';
// FIX: Corrected import path to be relative.
import { ProjectFile } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
// FIX: Corrected import path to be relative.
import { getCodeSuggestion } from '../services/geminiService';

const AICodingAssistant: React.FC<{ file: ProjectFile }> = ({ file }) => {
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;

        setIsLoading(true);
        setError(null);
        setResponse('');

        try {
            const result = await getCodeSuggestion(file.content, file.language, question);
            setResponse(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-4">AI Coding Assistant</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Ask a question about the current file (<span className="font-mono bg-slate-200 dark:bg-slate-700/50 px-1 rounded">{file.name}</span>) and get help from our AI assistant.
            </p>
            <form onSubmit={handleAsk}>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., How can I refactor this code to be more efficient? or Explain what this function does."
                    className="w-full h-24 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={isLoading}
                />
                <Button type="submit" disabled={isLoading || !question.trim()} className="mt-3">
                    {isLoading ? 'Thinking...' : 'Ask AI Assistant'}
                </Button>
            </form>
            <div className="mt-6">
                 {isLoading && <div className="flex justify-center py-6"><Spinner /></div>}
                 {error && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{error}</div>}
                 {response && (
                     <div className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg border dark:border-slate-700/50">
                        <pre className="whitespace-pre-wrap font-sans text-sm">{response}</pre>
                     </div>
                 )}
            </div>
        </Card>
    );
};

export default AICodingAssistant;