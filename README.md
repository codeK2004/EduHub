
# 🚀 EduHub- Acacdemic Collaboration and Innovation

A modern **real-time collaboration platform** built using **WebSockets (Socket.io)** that enables teams to communicate, manage tasks, and collaborate instantly across multiple users.

The application is designed with a scalable architecture and supports live updates without page refreshes.

---

## ✨ Features

### 🔄 Real-Time Collaboration

* **Live Chat** – Messages are delivered instantly to all connected users
* **Live Code Editing** – File changes sync across users in real-time
* **Project Updates** – Project creation and updates are reflected instantly
* **Task Management** – Add, update, and complete tasks collaboratively
* **User Presence** – See when team members join or leave

---

## 🧠 How It Works

### The Architecture Overview

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Frontend         | React + Vite                        |
| Backend          | Node.js + Express                   |
| Real-Time Engine | Socket.io (WebSockets)              |
| State Sync       | Event-based WebSocket communication |
| Data Storage     | In-memory (development)             |

---

## 📡 Real-Time Communication

The app uses **WebSocket-based, bidirectional communication** to ensure all users see updates instantly.

**Default Ports**

* Frontend: `http://localhost:3000`
* Backend (WebSocket Server): `http://localhost:3001`

---

## 🚀 Quick Start

### Option 1: Run Both Servers Automatically (Recommended)

```bash
npm run dev:all
```

Starts:

* Backend WebSocket server (port 3001)
* Frontend Vite development server (port 3000)

---

### Option 2: Run Servers Separately

**Terminal 1 – Backend Server**

```bash
npm run dev:server
```

**Terminal 2 – Frontend Server**

```bash
npm run dev
```

---

## ⚙️ Local Setup

### Prerequisites

* Node.js (v18+ recommended)
* npm

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```
3. Start the application:

   ```bash
   npm run dev
   ```

---

## 🔧 Configuration

By default, the frontend connects to the WebSocket server at:

```
http://localhost:3001
```

To change the server URL, update:

```
services/socketService.ts
```

```ts
socketService.connect('http://your-server-url:port');
```

---

## 🧪 Testing Real-Time Features

1. Open the app in **two different browser windows or tabs**
2. Log in as different users
3. Join the same team/workspace
4. Try:

   * Sending chat messages
   * Editing files
   * Adding tasks
   * Completing tasks
   * Observing join/leave presence updates

All changes should sync instantly.

---

