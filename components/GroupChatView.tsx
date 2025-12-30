import React from 'react';
import ChatWindow from './ChatWindow';

interface GroupChatViewProps {
    teamId: string;
}

const GroupChatView: React.FC<GroupChatViewProps> = ({ teamId }) => {
    return (
        <div className="max-w-4xl mx-auto">
            <ChatWindow title="Team Group Chat" teamId={teamId} />
        </div>
    );
};

export default GroupChatView;
