import { ReportsView } from "@/features/reports"

type ReportsPageProps = {
  params: Promise<{ projectId: string }>
}

const ProjectReportsPage = async ({ params }: ReportsPageProps) => {
  const { projectId } = await params
  return <ReportsView projectId={projectId} />
}

export default ProjectReportsPage
