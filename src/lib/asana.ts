const ASANA_API_BASE = "https://app.asana.com/api/1.0";

export interface AsanaWorkspace {
  gid: string;
  name: string;
}

export interface AsanaProject {
  gid: string;
  name: string;
  workspace: AsanaWorkspace;
}

async function asanaFetch(path: string, token: string) {
  const res = await fetch(`${ASANA_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Asana API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchWorkspaces(
  token: string,
): Promise<AsanaWorkspace[]> {
  const data = await asanaFetch("/workspaces", token);
  return data.data;
}

export async function fetchProjects(
  token: string,
  workspaceGid: string,
): Promise<AsanaProject[]> {
  const data = await asanaFetch(
    `/projects?workspace=${workspaceGid}&opt_fields=name,workspace,workspace.name`,
    token,
  );
  return data.data;
}

export async function fetchAllProjects(token: string): Promise<AsanaProject[]> {
  const workspaces = await fetchWorkspaces(token);
  const projectsByWorkspace = await Promise.all(
    workspaces.map((ws) => fetchProjects(token, ws.gid)),
  );
  return projectsByWorkspace.flat();
}

export interface AsanaTask {
  gid: string;
  name: string;
  notes: string;
  completed: boolean;
  tags: { gid: string; name: string }[];
  assignee: { gid: string; name: string } | null;
  created_at: string;
}

export async function fetchProjectTasks(
  token: string,
  projectGid: string,
  limit = 100,
): Promise<AsanaTask[]> {
  const data = await asanaFetch(
    `/projects/${projectGid}/tasks?opt_fields=name,notes,completed,tags,tags.name,assignee,assignee.name,created_at&limit=${limit}`,
    token,
  );
  return data.data;
}

export async function fetchTask(
  token: string,
  taskGid: string,
): Promise<AsanaTask> {
  const data = await asanaFetch(
    `/tasks/${taskGid}?opt_fields=name,notes,completed,tags,tags.name,assignee,assignee.name,created_at`,
    token,
  );
  return data.data;
}

export async function addTaskToProject(
  token: string,
  taskGid: string,
  projectGid: string,
): Promise<void> {
  const res = await fetch(`${ASANA_API_BASE}/tasks/${taskGid}/addProject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: { project: projectGid } }),
  });
  if (!res.ok) {
    throw new Error(`Asana API error: ${res.status} ${res.statusText}`);
  }
}
