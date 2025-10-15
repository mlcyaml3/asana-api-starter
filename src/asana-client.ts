import axios, { AxiosInstance } from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export interface Task {
  gid: string;
  name: string;
  notes?: string;
  completed: boolean;
  assignee?: string;
  due_on?: string;
  projects: string[];
}

export interface Project {
  gid: string;
  name: string;
  notes?: string;
  color?: string;
  workspace: string;
}

export class AsanaClient {
  private client: AxiosInstance;
  private workspaceId: string;

  constructor(accessToken: string, workspaceId: string) {
    this.workspaceId = workspaceId;
    this.client = axios.create({
      baseURL: 'https://app.asana.com/api/1.0',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Tasks
  async getTasks(projectId?: string): Promise<Task[]> {
    const params = projectId ? { project: projectId } : {};
    const response = await this.client.get('/tasks', { params });
    return response.data.data;
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    const response = await this.client.post('/tasks', {
      data: {
        name: task.name,
        notes: task.notes,
        projects: task.projects || [],
        workspace: this.workspaceId,
        ...task,
      },
    });
    return response.data.data;
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    const response = await this.client.put(`/tasks/${taskId}`, {
      data: updates,
    });
    return response.data.data;
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.client.delete(`/tasks/${taskId}`);
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const response = await this.client.get('/projects', {
      params: { workspace: this.workspaceId },
    });
    return response.data.data;
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const response = await this.client.post('/projects', {
      data: {
        name: project.name,
        notes: project.notes,
        color: project.color,
        workspace: this.workspaceId,
      },
    });
    return response.data.data;
  }

  // Workspaces
  async getWorkspaces(): Promise<any[]> {
    const response = await this.client.get('/workspaces');
    return response.data.data;
  }

  // Webhooks
  async createWebhook(resourceId: string, targetUrl: string): Promise<any> {
    const response = await this.client.post('/webhooks', {
      data: {
        resource: resourceId,
        target: targetUrl,
        filters: [{
          resource_type: 'task',
          action: 'changed',
        }],
      },
    });
    return response.data.data;
  }
}

// Usage example
export async function exampleUsage() {
  const client = new AsanaClient(
    process.env.ASANA_ACCESS_TOKEN!,
    process.env.ASANA_WORKSPACE_ID!
  );

  try {
    // Get all projects
    const projects = await client.getProjects();
    console.log('Projects:', projects);

    // Create a new task
    const task = await client.createTask({
      name: 'New task from API',
      notes: 'This task was created using the Asana API',
      projects: [projects[0].gid],
    });

    console.log('Created task:', task);
  } catch (error) {
    console.error('Error:', error);
  }
}