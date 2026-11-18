export type ProjectContingencyRequest = {
  estimatedTime: number
  estimatedCost: number
}

export type ProjectContingencyPayload = ProjectContingencyRequest & {
  projectId: string
}
