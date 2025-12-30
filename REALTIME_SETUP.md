# Real-Time Setup Guide

This project now supports **real-time collaboration** using WebSockets (Socket.io)!

## 🚀 Quick Start

### Option 1: Run Both Servers Automatically (Recommended)

```bash
npm run dev:all
```

This will start both the backend WebSocket server (port 3001) and the frontend Vite dev server (port 3000) simultaneously.

### Option 2: Run Servers Separately

**Terminal 1 - Backend Server:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```

## 📡 How Real-Time Works

### Features Enabled:
- ✅ **Real-time Chat** - Messages appear instantly for all team members
- ✅ **Live Code Editing** - File changes sync across all users in real-time
- ✅ **Project Updates** - Project creation, task updates sync instantly
- ✅ **User Presence** - See when team members join/leave
- ✅ **Task Management** - Task additions and completions sync in real-time

### Architecture:
- **Backend**: Node.js + Express + Socket.io server (port 3001)
- **Frontend**: React + Socket.io client (port 3000)
- **Communication**: WebSocket connections for bidirectional real-time updates

## 🔧 Configuration

The WebSocket server runs on `http://localhost:3001` by default. The frontend automatically connects to this server when the app loads.

To change the server URL, update `services/socketService.ts`:
```typescript
socketService.connect('http://your-server-url:port');
```

## 🧪 Testing Real-Time Features

1. Open the app in **two different browser windows/tabs**
2. Log in as different users in each window
3. Join the same team
4. Try these features:
   - Send a chat message in one window → See it appear instantly in the other
   - Edit a file in one window → See changes sync in real-time in the other
   - Add a task → See it appear in both windows
   - Complete a task → See progress update in both windows

## 📝 Notes

- The backend server stores data in memory (resets on server restart)
- For production, you should use a database (PostgreSQL, MongoDB, etc.)
- File edits are synced when you click "Save Changes" (not on every keystroke)
- All team members see updates instantly when any member makes changes

## 🐛 Troubleshooting

**Connection Issues:**
- Make sure the backend server is running on port 3001
- Check browser console for connection errors
- Verify firewall isn't blocking WebSocket connections

**Updates Not Syncing:**
- Check that both browser windows are connected (look for connection logs in console)
- Refresh both windows if needed
- Check backend server logs for errors




