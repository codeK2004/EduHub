import React, { useState } from 'react';
import { ChatMessage, Project } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { getMeetingSuggestions, summarizeChatHistory } from '../services/geminiService';
import { useSession } from '../hooks/useSession';

interface TeamSyncViewProps {
    project: Project;
}

const TeamSyncView: React.FC<TeamSyncViewProps> = ({ project }) => {
    const { chatMessages, getUsersInTeam } = useSession();
    const teamMembers = getUsersInTeam(project.teamId);
    
    // State for Meeting Scheduler
    const [meetingQuery, setMeetingQuery] = useState('');
    const [isScheduling, setIsScheduling] = useState(false);
    const [scheduleResult, setScheduleResult] = useState('');
    const [scheduleError, setScheduleError] = useState<string | null>(null);

    // State for Chat Summarizer
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [summaryResult, setSummaryResult] = useState('');
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const handleScheduleMeeting = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!meetingQuery.trim()) return;

        setIsScheduling(true);
        setScheduleResult('');
        setScheduleError(null);

        try {
            const result = await getMeetingSuggestions(meetingQuery, teamMembers);
            setScheduleResult(result);
        } catch (err: any) {
            setScheduleError(err.message || 'An unknown error occurred.');
        } finally {
            setIsScheduling(false);
        }
    };
    
    const handleSummarizeChat = async () => {
        setIsSummarizing(true);
        setSummaryResult('');
        setSummaryError(null);
        
        const messagesToSummarize: ChatMessage[] = (chatMessages[project.teamId] || []).slice(-20);

        if (messagesToSummarize.length === 0) {
            setSummaryResult("There are no recent messages in the chat to summarize.");
            setIsSummarizing(false);
            return;
        }

        try {
            const result = await summarizeChatHistory(messagesToSummarize);
            setSummaryResult(result);
        } catch (err: any) {
            setSummaryError(err.message || 'An unknown error occurred.');
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Meeting Scheduler */}
            <Card>
                <h3 className="text-xl font-semibold mb-2">AI Meeting Scheduler</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Describe the meeting you want to schedule in plain English. The AI will extract the details.
                </p>
                <form onSubmit={handleScheduleMeeting}>
                    <textarea
                        value={meetingQuery}
                        onChange={(e) => setMeetingQuery(e.target.value)}
                        placeholder="e.g., Let's find a 45 minute slot for a project review next week. I'm busy on Tuesday morning."
                        className="w-full h-24 bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={isScheduling}
                    />
                    <Button type="submit" disabled={isScheduling || !meetingQuery.trim()} className="mt-3">
                        {isScheduling ? 'Finding Times...' : 'Find Meeting Times'}
                    </Button>
                </form>
                <div className="mt-6">
                    {isScheduling && <div className="flex justify-center py-6"><Spinner /></div>}
                    {scheduleError && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{scheduleError}</div>}
                    {scheduleResult && (
                        <div className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg border dark:border-slate-700/50">
                            <pre className="whitespace-pre-wrap font-sans text-sm">{scheduleResult}</pre>
                        </div>
                    )}
                </div>
            </Card>

            {/* AI Chat Summarizer */}
            <Card>
                <h3 className="text-xl font-semibold mb-2">AI Chat Summarizer</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Generate a summary and action items from your team's most recent chat conversations.
                </p>
                <Button onClick={handleSummarizeChat} disabled={isSummarizing}>
                    {isSummarizing ? 'Summarizing...' : 'Summarize Recent Chat'}
                </Button>
                <div className="mt-6">
                    {isSummarizing && <div className="flex justify-center py-6"><Spinner /></div>}
                    {summaryError && <div className="text-red-500 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">{summaryError}</div>}
                    {summaryResult && (
                        <div className="prose prose-slate dark:prose-invert max-w-none p-4 bg-slate-100 dark:bg-slate-900/70 rounded-lg border dark:border-slate-700/50 max-h-96 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-sans text-sm">{summaryResult}</pre>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default TeamSyncView;
