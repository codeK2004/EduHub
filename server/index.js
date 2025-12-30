import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_FILE = join(__dirname, 'data.json');

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Load data from file if it exists
function loadData() {
  try {
    if (existsSync(DATA_FILE)) {
      const fileData = readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(fileData);
      console.log('📂 Loaded persistent data from file');
      return {
        projects: data.projects || [],
        users: data.users || [],
        chatMessages: data.chatMessages || {},
        onlineUsers: new Map() // Always start with empty online users
      };
    }
  } catch (error) {
    console.error('⚠️ Error loading data file:', error.message);
    console.log('🆕 Starting with empty data');
  }
  return {
    projects: [],
    users: [],
    chatMessages: {},
    onlineUsers: new Map()
  };
}

// Save data to file
function saveData() {
  try {
    const dataToSave = {
      projects: state.projects,
      users: state.users,
      chatMessages: state.chatMessages,
      lastSaved: new Date().toISOString()
    };
    writeFileSync(DATA_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
    console.log('💾 Data saved to file');
  } catch (error) {
    console.error('⚠️ Error saving data file:', error.message);
  }
}

// Persistent storage - data persists across server restarts
const state = loadData();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // User joins
  socket.on('user:join', (user) => {
    state.onlineUsers.set(socket.id, user);
    if (!state.users.find(u => u.id === user.id)) {
      state.users.push(user);
      saveData(); // Save to file when new user is added
    }
    socket.broadcast.emit('user:joined', user);
    io.emit('state:users', state.users);
    console.log('User joined:', user.name);
  });

  // Handle user logout - keep data but mark user as offline
  socket.on('user:logout', (userId) => {
    // Remove user from online users (but keep in users list for persistence)
    for (const [socketId, user] of state.onlineUsers.entries()) {
      if (user.id === userId) {
        state.onlineUsers.delete(socketId);
        break;
      }
    }
    // Keep user in users list so they can log back in and see their data
    io.emit('state:users', state.users);
    console.log('User logged out (data preserved):', userId);
  });

  // User leaves
  socket.on('disconnect', () => {
    const user = state.onlineUsers.get(socket.id);
    if (user) {
      state.onlineUsers.delete(socket.id);
      socket.broadcast.emit('user:left', user);
      console.log('User left:', user.name);
      // Note: Data persists even when users disconnect
    }
  });

  // Send initial state to newly connected client
  socket.emit('state:initial', {
    projects: state.projects,
    users: state.users,
    chatMessages: state.chatMessages
  });

  // Project operations
  socket.on('project:create', (projectData) => {
    const project = {
      ...projectData,
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    state.projects.push(project);
    saveData(); // Save to file
    io.emit('project:created', project);
    console.log('Project created:', project.name);
  });

  socket.on('project:update', (project) => {
    const index = state.projects.findIndex(p => p.id === project.id);
    if (index !== -1) {
      state.projects[index] = project;
      saveData(); // Save to file
      socket.broadcast.emit('project:updated', project);
      console.log('Project updated:', project.name);
    }
  });

  // Chat operations
  socket.on('message:send', (messageData) => {
    const { teamId, message } = messageData;
    if (!state.chatMessages[teamId]) {
      state.chatMessages[teamId] = [];
    }
    state.chatMessages[teamId].push(message);
    saveData(); // Save to file
    io.emit('message:received', { teamId, message });
    console.log('Message sent in team:', teamId, 'by:', message.sender.name);
  });

  // File operations
  socket.on('file:add', (fileData) => {
    const { projectId, file } = fileData;
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      project.files.push(file);
      saveData(); // Save to file
      io.emit('file:added', { projectId, file });
      console.log('File added:', file.name);
    }
  });

  socket.on('file:update', (fileData) => {
    const { projectId, fileId, content } = fileData;
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      const file = project.files.find(f => f.id === fileId);
      if (file) {
        file.content = content;
        saveData(); // Save to file
        socket.broadcast.emit('file:updated', { projectId, fileId, content });
        console.log('File updated:', file.name);
      }
    }
  });

  // Task operations
  socket.on('task:add', (taskData) => {
    const { projectId, task } = taskData;
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      project.tasks.push(task);
      const completedTasks = project.tasks.filter(t => t.completed).length;
      project.progress = project.tasks.length > 0 
        ? Math.round((completedTasks / project.tasks.length) * 100) 
        : 0;
      saveData(); // Save to file
      io.emit('task:added', { projectId, task, progress: project.progress });
      console.log('Task added to project:', projectId);
    }
  });

  socket.on('task:toggle', (taskData) => {
    const { projectId, taskId } = taskData;
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      const task = project.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        const completedTasks = project.tasks.filter(t => t.completed).length;
        project.progress = project.tasks.length > 0 
          ? Math.round((completedTasks / project.tasks.length) * 100) 
          : 0;
        saveData(); // Save to file
        io.emit('task:toggled', { projectId, taskId, completed: task.completed, progress: project.progress });
        console.log('Task toggled:', taskId);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Real-time server running on http://localhost:${PORT}`);
  console.log(`💾 File-based persistence enabled`);
  console.log(`   Data file: ${DATA_FILE}`);
  console.log(`   Your work will survive server restarts!`);
  
  // Show data summary
  const projectCount = state.projects.length;
  const userCount = state.users.length;
  const messageCount = Object.values(state.chatMessages).reduce((sum, msgs) => sum + msgs.length, 0);
  if (projectCount > 0 || userCount > 0 || messageCount > 0) {
    console.log(`📊 Loaded: ${projectCount} projects, ${userCount} users, ${messageCount} messages`);
  }
});

