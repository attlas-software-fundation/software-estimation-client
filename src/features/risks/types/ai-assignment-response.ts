export type AiAssignment = {
  task_id: string
  task_title: string
  profile_id: string
  profile_name: string
  estimate_hours: number
  hourly_rate: number
  cost: number
}

export type AiAssignmentResponse = {
  algorithm: string
  assignments: AiAssignment[]
  total_cost: number
  nodes_explored: number
  execution_time_ms: number
  optimal_guaranteed: boolean
}
