import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useRef } from 'react';
import { Project, User, Task, ChatMessage, ProjectFile } from '../types';
import { socketService } from '../services/socketService';

interface SessionContextType {
    projects: Project[];
    users: User[];
    chatMessages: Record<string, ChatMessage[]>;
    addUser: (user: User) => void;
    updateUser: (user: User) => void;
    createProject: (projectDetails: { name: string; description: string }, creator: User) => void;
    getUsersInTeam: (teamId: string) => User[];
    assignTeamLeader: (teamId: string, userId: string) => void;
    addTask: (projectId: string, taskDescription: string) => void;
    toggleTaskCompletion: (projectId: string, taskId: string) => void;
    sendMessage: (teamId: string, text: string, sender: { id: string, name: string }) => void;
    addFileToProject: (projectId: string, fileName: string, language: string) => void;
    updateFileContent: (projectId: string, fileId: string, newContent: string) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>({});
    const initializedRef = useRef(false);

    // Initialize Socket.io connection
    useEffect(() => {
        socketService.connect();
        
        // Get initial state from server
        socketService.onInitialState((state) => {
            if (!initializedRef.current) {
                setProjects(state.projects);
                setUsers(state.users);
                setChatMessages(state.chatMessages);
                initializedRef.current = true;
            }
        });

        // Listen for project updates
        socketService.onProjectCreated((project) => {
            setProjects(prev => {
                if (prev.find(p => p.id === project.id)) return prev;
                return [...prev, project];
            });
        });

        socketService.onProjectUpdated((project) => {
            setProjects(prev => prev.map(p => p.id === project.id ? project : p));
        });

        // Listen for user updates
        socketService.onUsersUpdate((updatedUsers) => {
            setUsers(updatedUsers);
        });

        socketService.onUserJoined((newUser) => {
            setUsers(prev => {
                if (prev.find(u => u.id === newUser.id)) return prev;
                return [...prev, newUser];
            });
        });

        // Listen for chat messages
        socketService.onMessageReceived(({ teamId, message }) => {
            setChatMessages(prev => ({
                ...prev,
                [teamId]: [...(prev[teamId] || []), message]
            }));
        });

        // Listen for file updates
        socketService.onFileAdded(({ projectId, file }) => {
            setProjects(prev => prev.map(p => 
                p.id === projectId ? { ...p, files: [...p.files, file] } : p
            ));
        });

        socketService.onFileUpdated(({ projectId, fileId, content }) => {
            setProjects(prev => prev.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        files: p.files.map(f => f.id === fileId ? { ...f, content } : f)
                    };
                }
                return p;
            }));
        });

        // Listen for task updates
        socketService.onTaskAdded(({ projectId, task, progress }) => {
            setProjects(prev => prev.map(p => 
                p.id === projectId 
                    ? { ...p, tasks: [...p.tasks, task], progress } 
                    : p
            ));
        });

        socketService.onTaskToggled(({ projectId, taskId, completed, progress }) => {
            setProjects(prev => prev.map(p => {
                if (p.id === projectId) {
                    return {
                        ...p,
                        tasks: p.tasks.map(t => t.id === taskId ? { ...t, completed } : t),
                        progress
                    };
                }
                return p;
            }));
        });

        return () => {
            socketService.disconnect();
        };
    }, []);

    const addUser = (user: User) => {
        setUsers(prevUsers => {
            if (prevUsers.find(u => u.id === user.id)) return prevUsers;
            const newUsers = [...prevUsers, user];
            // Join socket as user when added
            socketService.joinAsUser(user);
            return newUsers;
        });
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const createProject = (projectDetails: { name: string; description: string }, creator: User) => {
        if (!creator.teamId) return;

        // Allow multiple projects per team - removed restriction
        const newProject: Project = {
            id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            teamId: creator.teamId,
            name: projectDetails.name,
            description: projectDetails.description,
            files: [], // No default files since code hub is removed
            progress: 0,
            tasks: [],
        };
        socketService.createProject(newProject);
    };

    const getUsersInTeam = useCallback((teamId: string): User[] => {
        return users.filter(user => user.teamId?.toLowerCase() === teamId.toLowerCase());
    }, [users]);

    const assignTeamLeader = (teamId: string, userId: string) => {
        const project = projects.find(p => p.teamId === teamId);
        if (project) {
            const updatedProject = { ...project, leaderId: userId };
            socketService.updateProject(updatedProject);
        }
    };

    const addTask = (projectId: string, taskDescription: string) => {
        const newTask: Task = {
            id: `task_${Date.now()}`,
            description: taskDescription,
            completed: false,
        };
        socketService.addTask(projectId, newTask);
    };

    const toggleTaskCompletion = (projectId: string, taskId: string) => {
        socketService.toggleTask(projectId, taskId);
    };

    const sendMessage = (teamId: string, text: string, sender: { id: string, name: string }) => {
        const newMessage: ChatMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            sender,
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        socketService.sendMessage(teamId, newMessage);
    };

    const addFileToProject = (projectId: string, fileName: string, language: string) => {
        let content = '';
        switch (language) {
            case 'HTML':
                content = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>New Page</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <script src="script.js"></script>\n</body>\n</html>`;
                break;
            case 'CSS':
                content = `body {\n  font-family: sans-serif;\n  background-color: #f0f0f0;\n}`;
                break;
            case 'JavaScript':
                content = `console.log('Hello from JavaScript!');`;
                break;
            case 'React (TSX)':
                content = `import React from 'react';\n\nconst MyComponent: React.FC = () => {\n  return <h1>Hello from React!</h1>;\n};\n\nexport default MyComponent;`;
                break;
            case 'Python':
                 content = `# Your Python code goes here\n\nprint("Hello, from Python!")`
                 break;
            default:
                content = `// New ${fileName}`;
        }

        const newFile: ProjectFile = {
            id: `f_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: fileName,
            language,
            content
        };

        socketService.addFile(projectId, newFile);
    };

    const updateFileContent = (projectId: string, fileId: string, newContent: string) => {
        socketService.updateFile(projectId, fileId, newContent);
    };

    return (
        <SessionContext.Provider value={{ 
            projects, 
            users, 
            chatMessages,
            addUser, 
            updateUser, 
            createProject, 
            getUsersInTeam, 
            assignTeamLeader, 
            addTask, 
            toggleTaskCompletion,
            sendMessage,
            addFileToProject,
            updateFileContent
        }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
