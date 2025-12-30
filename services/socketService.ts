import { io, Socket } from 'socket.io-client';
import { Project, User, ChatMessage, Task, ProjectFile } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(serverUrl: string = 'http://localhost:3001') {
    if (this.socket?.connected) {
      return;
    }

    try {
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        timeout: 5000
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to real-time server');
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from real-time server');
      });

      this.socket.on('connect_error', (error) => {
        console.warn('⚠️ Could not connect to real-time server. App will work in offline mode:', error.message);
      });
    } catch (error) {
      console.warn('⚠️ Failed to initialize socket connection. App will work in offline mode:', error);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // User operations
  joinAsUser(user: User) {
    this.socket?.emit('user:join', user);
  }

  logoutUser(userId: string) {
    this.socket?.emit('user:logout', userId);
  }

  onUserJoined(callback: (user: User) => void) {
    this.socket?.on('user:joined', callback);
  }

  onUserLeft(callback: (user: User) => void) {
    this.socket?.on('user:left', callback);
  }

  // State synchronization
  onInitialState(callback: (state: { projects: Project[], users: User[], chatMessages: Record<string, ChatMessage[]> }) => void) {
    this.socket?.on('state:initial', callback);
  }

  onUsersUpdate(callback: (users: User[]) => void) {
    this.socket?.on('state:users', callback);
  }

  // Project operations
  createProject(projectData: Omit<Project, 'id'>) {
    this.socket?.emit('project:create', projectData);
  }

  onProjectCreated(callback: (project: Project) => void) {
    this.socket?.on('project:created', callback);
  }

  updateProject(project: Project) {
    this.socket?.emit('project:update', project);
  }

  onProjectUpdated(callback: (project: Project) => void) {
    this.socket?.on('project:updated', callback);
  }

  // Chat operations
  sendMessage(teamId: string, message: ChatMessage) {
    this.socket?.emit('message:send', { teamId, message });
  }

  onMessageReceived(callback: (data: { teamId: string, message: ChatMessage }) => void) {
    this.socket?.on('message:received', callback);
  }

  // File operations
  addFile(projectId: string, file: ProjectFile) {
    this.socket?.emit('file:add', { projectId, file });
  }

  onFileAdded(callback: (data: { projectId: string, file: ProjectFile }) => void) {
    this.socket?.on('file:added', callback);
  }

  updateFile(projectId: string, fileId: string, content: string) {
    this.socket?.emit('file:update', { projectId, fileId, content });
  }

  onFileUpdated(callback: (data: { projectId: string, fileId: string, content: string }) => void) {
    this.socket?.on('file:updated', callback);
  }

  // Task operations
  addTask(projectId: string, task: Task) {
    this.socket?.emit('task:add', { projectId, task });
  }

  onTaskAdded(callback: (data: { projectId: string, task: Task, progress: number }) => void) {
    this.socket?.on('task:added', callback);
  }

  toggleTask(projectId: string, taskId: string) {
    this.socket?.emit('task:toggle', { projectId, taskId });
  }

  onTaskToggled(callback: (data: { projectId: string, taskId: string, completed: boolean, progress: number }) => void) {
    this.socket?.on('task:toggled', callback);
  }

  // Cleanup
  removeAllListeners(event: string) {
    this.socket?.removeAllListeners(event);
  }
}

export const socketService = new SocketService();

