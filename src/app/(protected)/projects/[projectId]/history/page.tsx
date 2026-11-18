import { ProjectHistoryView } from "@/features/projects"

interface ProjectHistoryPageProps {
  params: Promise<{ projectId: string }>
}

const ProjectHistoryPage = async ({ params }: ProjectHistoryPageProps) => {
  const { projectId } = await params

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Historial de cambios de estado
        </h2>
        <p className="text-muted-foreground text-sm">
          Registro cronológico detallado de las transiciones de estado de este
          proyecto.
        </p>
      </div>

      <ProjectHistoryView projectId={projectId} />
    </div>
  )
}

export default ProjectHistoryPage
