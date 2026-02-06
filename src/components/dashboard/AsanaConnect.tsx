'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface AsanaProject {
  gid: string
  name: string
  workspace: { gid: string; name: string }
}

export function AsanaConnect({ isConnected }: { isConnected: boolean }) {
  const [projects, setProjects] = useState<AsanaProject[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fromProject, setFromProject] = useState('')
  const [toProject, setToProject] = useState('')

  useEffect(() => {
    if (!isConnected) return

    setLoading(true)
    fetch('/api/asana/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch projects')
        return res.json()
      })
      .then((data) => setProjects(data.projects))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [isConnected])

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Connect to Asana</CardTitle>
          <CardDescription>
            Link your Asana account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/api/asana/authorize">
            <Button>Connect to Asana</Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asana Projects</CardTitle>
          <CardDescription>Loading your projects...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading projects from Asana...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Asana Projects</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <a href="/api/asana/authorize">
            <Button variant="outline">Reconnect to Asana</Button>
          </a>
        </CardContent>
      </Card>
    )
  }

  // Group projects by workspace
  const workspaces = projects.reduce<Record<string, { name: string; projects: AsanaProject[] }>>(
    (acc, project) => {
      const wsGid = project.workspace?.gid ?? 'unknown'
      if (!acc[wsGid]) {
        acc[wsGid] = { name: project.workspace?.name ?? 'Workspace', projects: [] }
      }
      acc[wsGid].projects.push(project)
      return acc
    },
    {}
  )

  return (
    <Card className="md:col-span-2 lg:col-span-3">
      <CardHeader>
        <CardTitle>Asana Projects</CardTitle>
        <CardDescription>
          Select the source and destination projects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="from-project" className="block text-sm font-medium text-gray-700 mb-2">
              From Project
            </label>
            <select
              id="from-project"
              value={fromProject}
              onChange={(e) => setFromProject(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a project...</option>
              {Object.entries(workspaces).map(([wsGid, ws]) => (
                <optgroup key={wsGid} label={ws.name}>
                  {ws.projects.map((p) => (
                    <option key={p.gid} value={p.gid} disabled={p.gid === toProject}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="to-project" className="block text-sm font-medium text-gray-700 mb-2">
              To Project
            </label>
            <select
              id="to-project"
              value={toProject}
              onChange={(e) => setToProject(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select a project...</option>
              {Object.entries(workspaces).map(([wsGid, ws]) => (
                <optgroup key={wsGid} label={ws.name}>
                  {ws.projects.map((p) => (
                    <option key={p.gid} value={p.gid} disabled={p.gid === fromProject}>
                      {p.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        {fromProject && toProject && (
          <div className="mt-4 rounded-md bg-blue-50 p-3 text-sm text-blue-700">
            Ready to sync from <strong>{projects.find((p) => p.gid === fromProject)?.name}</strong> to{' '}
            <strong>{projects.find((p) => p.gid === toProject)?.name}</strong>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
