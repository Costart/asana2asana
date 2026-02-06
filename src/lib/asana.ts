const ASANA_API_BASE = 'https://app.asana.com/api/1.0'

export interface AsanaWorkspace {
  gid: string
  name: string
}

export interface AsanaProject {
  gid: string
  name: string
  workspace: AsanaWorkspace
}

async function asanaFetch(path: string, token: string) {
  const res = await fetch(`${ASANA_API_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!res.ok) {
    throw new Error(`Asana API error: ${res.status} ${res.statusText}`)
  }
  return res.json()
}

export async function fetchWorkspaces(token: string): Promise<AsanaWorkspace[]> {
  const data = await asanaFetch('/workspaces', token)
  return data.data
}

export async function fetchProjects(token: string, workspaceGid: string): Promise<AsanaProject[]> {
  const data = await asanaFetch(
    `/projects?workspace=${workspaceGid}&opt_fields=name,workspace,workspace.name`,
    token
  )
  return data.data
}

export async function fetchAllProjects(token: string): Promise<AsanaProject[]> {
  const workspaces = await fetchWorkspaces(token)
  const projectsByWorkspace = await Promise.all(
    workspaces.map((ws) => fetchProjects(token, ws.gid))
  )
  return projectsByWorkspace.flat()
}
