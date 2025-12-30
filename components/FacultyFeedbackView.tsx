

import React from 'react';
import ChatWindow from './ChatWindow';

interface FacultyFeedbackViewProps {
    teamId: string;
}

const FacultyFeedbackView: React.FC<FacultyFeedbackViewProps> = ({ teamId }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <ChatWindow title="Project Feedback Channel" teamId={teamId} />
        </div>
    );
};

export default FacultyFeedbackView;
