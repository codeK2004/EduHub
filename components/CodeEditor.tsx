import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import { ProjectFile } from '../types';
import Button from './ui/Button';

interface CodeEditorProps {
    file: ProjectFile;
    onSave: (newContent: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, onSave }) => {
    const [code, setCode] = useState(file.content);
    const [output, setOutput] = useState<{ type: 'iframe' | 'log' | 'message', content: string } | null>(null);
    const [isSaved, setIsSaved] = useState(true);

    useEffect(() => {
        setCode(file.content);
        setOutput(null); // Clear output when file changes
        setIsSaved(true);
    }, [file]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);
        setIsSaved(false);
    };

    const handleSave = () => {
        onSave(code);
        setIsSaved(true);
    };

    const handleRunCode = () => {
        setOutput(null); // Clear previous output
        switch (file.language) {
            case 'HTML':
                setOutput({ type: 'iframe', content: code });
                break;
            case 'JavaScript': {
                const logs: string[] = [];
                const originalConsoleLog = console.log;
                console.log = (...args) => {
                    logs.push(args.map(arg => {
                        try {
                            return typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
                        } catch {
                            return 'Unserializable Object';
                        }
                    }).join(' '));
                };

                try {
                    // eslint-disable-next-line no-eval
                    eval(code);
                    const logContent = logs.join('\n');
                    setOutput({ type: 'log', content: logContent || 'Execution finished with no console output.' });
                } catch (error: any) {
                    setOutput({ type: 'log', content: `Error: ${error.message}` });
                } finally {
                    console.log = originalConsoleLog;
                }
                break;
            }
            case 'Python':
                 // This is a simulation
                if (code.includes('print("Hello, World!")')) {
                    setOutput({ type: 'log', content: 'Hello, World!' });
                } else {
                     setOutput({ type: 'message', content: `Simulated run for ${file.name}. Output will appear here.` });
                }
                break;
            case 'React (TSX)':
                setOutput({ type: 'message', content: 'Running React (TSX) requires a build step and is not supported in this simulation environment.' });
                break;
            case 'CSS':
                 setOutput({ type: 'message', content: 'CSS files cannot be run directly. They are applied when an HTML file is run.' });
                 break;
            default:
                setOutput({ type: 'message', content: `Live execution for ${file.language} is not supported.` });
        }
    };

    return (
        <Card>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold">{file.name}</h3>
                    <span className="text-sm bg-slate-200 dark:bg-slate-700/50 px-2 py-1 rounded">{file.language}</span>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaved} variant={isSaved ? 'secondary' : 'primary'}>
                        {isSaved ? 'Saved' : 'Save Changes'}
                    </Button>
                    <Button variant="secondary" onClick={handleRunCode}>Run Code</Button>
                </div>
            </div>
            <div className="bg-slate-900/80 rounded-lg font-mono text-sm overflow-x-auto border border-slate-700/50">
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    className="w-full h-64 bg-transparent text-slate-200 border-none focus:outline-none resize-y p-4 selection:bg-indigo-500/50"
                    spellCheck="false"
                />
            </div>
             <p className="text-xs text-slate-500 mt-2">Note: This is a basic text editor. A real implementation would use a library like Monaco or CodeMirror for syntax highlighting and collaborative features.</p>
            {output && (
                <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Output</h4>
                    <div className="bg-slate-900/80 rounded-lg p-4 font-mono text-sm border border-slate-700/50 max-h-60 overflow-y-auto">
                        {output.type === 'iframe' && (
                            <iframe
                                srcDoc={output.content}
                                title="Code Output"
                                className="w-full h-48 bg-white border-none"
                                sandbox="allow-scripts"
                            />
                        )}
                        {output.type === 'log' && (
                            <pre className="text-slate-200 whitespace-pre-wrap">{output.content}</pre>
                        )}
                         {output.type === 'message' && (
                            <p className="text-slate-400">{output.content}</p>
                        )}
                    </div>
                </div>
            )}
        </Card>
    );
};

export default CodeEditor;
