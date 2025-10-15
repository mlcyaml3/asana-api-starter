# Asana API Starter

TypeScript client for Asana API with task and project management capabilities.

## Features

- ✅ TypeScript client for Asana API
- ✅ Task management (CRUD operations)
- ✅ Project management
- ✅ Webhook support
- ✅ Type-safe interfaces
- ✅ Error handling

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`
2. Add your Asana Personal Access Token
3. Set your Workspace ID

```bash
cp .env.example .env
```

## Usage

```typescript
import { AsanaClient } from './src/asana-client';

const client = new AsanaClient(
  process.env.ASANA_ACCESS_TOKEN!,
  process.env.ASANA_WORKSPACE_ID!
);

// Get all projects
const projects = await client.getProjects();

// Create a task
const task = await client.createTask({
  name: 'New task',
  notes: 'Task description',
  projects: [projects[0].gid]
});

console.log('Created task:', task);
```

## API Methods

### Tasks
- `getTasks(projectId?)` - Get all tasks
- `createTask(task)` - Create new task
- `updateTask(taskId, updates)` - Update task
- `deleteTask(taskId)` - Delete task

### Projects
- `getProjects()` - Get all projects
- `createProject(project)` - Create new project

### Workspaces
- `getWorkspaces()` - Get all workspaces

### Webhooks
- `createWebhook(resourceId, targetUrl)` - Create webhook

## Development

```bash
npm run dev    # Development mode
npm run build  # Build for production
npm start      # Run production version
```

## License

MIT
