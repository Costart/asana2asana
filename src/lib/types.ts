// Skill criteria - the learned classification model
export interface SkillCriteria {
  summary: string
  includePatterns: {
    themes: string[]
    keywords: string[]
    taskCharacteristics: string[]
  }
  excludePatterns: {
    themes: string[]
    keywords: string[]
    taskCharacteristics: string[]
  }
  confidenceThreshold: number
  learnedRules: string[]
}

// Database row types
export interface Connection {
  id: string
  user_id: string
  from_project_gid: string
  from_project_name: string
  to_project_gid: string
  to_project_name: string
  last_polled_at: string | null
  created_at: string
}

export interface Skill {
  id: string
  connection_id: string
  version: number
  criteria: SkillCriteria
  created_at: string
}

export type CandidateStatus = 'pending' | 'approved' | 'rejected' | 'moved'

export interface TaskCandidate {
  id: string
  connection_id: string
  task_gid: string
  task_name: string
  task_notes: string | null
  ai_score: number
  ai_reasoning: string
  status: CandidateStatus
  user_comment: string | null
  reviewed_at: string | null
  created_at: string
}

// Asana task shape returned from API
export interface AsanaTask {
  gid: string
  name: string
  notes: string
  completed: boolean
  tags: { gid: string; name: string }[]
  assignee: { gid: string; name: string } | null
  created_at: string
}

// AI evaluation result
export interface TaskEvaluation {
  task_gid: string
  score: number
  reasoning: string
}

// API request/response types
export interface CreateConnectionRequest {
  fromProject: { gid: string; name: string }
  toProject: { gid: string; name: string }
}

export interface ReviewRequest {
  action: 'approve' | 'reject'
  comment?: string
}
