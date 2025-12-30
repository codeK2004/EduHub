export interface User {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'faculty';
    teamId?: string; // Students will have a teamId after selection
}

export interface ProjectFile {
    id: string;
    name: string;
    language: string;
    content: string;
}

export interface Task {
    id: string;
    description: string;
    completed: boolean;
}

export interface Project {
    id: string;
    teamId: string;
    name: string;
    description: string;
    files: ProjectFile[];
    leaderId?: string; // To assign a team leader
    progress: number;
    tasks: Task[];
}

export interface ChatMessage {
    id: string;
    sender: { id: string, name: string };
    text: string;
    timestamp: string;
}