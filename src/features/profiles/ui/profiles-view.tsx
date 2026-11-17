"use client"

import { useState } from "react"
import { IdCardIcon, PlusIcon } from "lucide-react"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { useDebounce, usePagination } from "@/hooks"
import { TABLE_PAGE_SIZE } from "@/lib/pagination"
import {
  FilterOperator,
  type FilterRequest,
  type QueryRequest,
} from "@/types/api"
import { useProfiles } from "../hooks"
import type { Profile, ProfileSearchResponse } from "../types"
import { ProfileFilters } from "./profile-filters"
import { ProfileTable } from "./profile-table"
import { ProfileDialog } from "./profile-dialog"
import { AssignCerDialog } from "./assign-cer-dialog"
import { DeleteProfileDialog } from "./delete-profile-dialog"

const emptyPage: ProfileSearchResponse = {
  profilesResponse: [],
  pageSize: TABLE_PAGE_SIZE,
  pageNumber: 0,
  totalPages: 0,
  totalElements: 0,
  hasNext: false,
  hasPrevious: false,
}

export const ProfilesView = () => {
  const { pageNumber, pageSize, setPageNumber, resetPage } = usePagination()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("")
  const debouncedSearch = useDebounce(searchQuery, 500)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [assignCerProfile, setAssignCerProfile] = useState<Profile | null>(null)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null)

  const filters: FilterRequest[] = []
  if (debouncedSearch.trim().length > 0) {
    filters.push({
      key: "search",
      operator: FilterOperator.LK,
      values: [debouncedSearch.trim()],
    })
  }
  if (selectedRole.trim().length > 0) {
    filters.push({
      key: "role",
      operator: FilterOperator.EQ,
      values: [selectedRole.trim()],
    })
  }

  const queryRequest: QueryRequest = {
    filters,
    pagination: {
      pageNumber,
      pageSize,
      orderBy: "createdAt",
      sortDirection: "DESC",
    },
  }

  const { data, isLoading, isError } = useProfiles(queryRequest)
  const pagination = data || emptyPage
  const profiles = pagination.profilesResponse

  const handleOpenCreate = () => {
    setEditingProfile(null)
    setDialogOpen(true)
  }

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile)
    setDialogOpen(true)
  }

  const handleDelete = (profile: Profile) => {
    setDeletingProfile(profile)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h1 className="text-2xl font-bold tracking-tight">
          Gestión de perfiles técnicos y CER
        </h1>
        <p className="text-muted-foreground text-sm">
          Administra los roles técnicos, niveles de experiencia y costos
          estándar por recurso por hora (CER).
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <ProfileFilters
          searchQuery={searchQuery}
          onSearchChange={(val) => {
            setSearchQuery(val)
            resetPage()
          }}
          selectedRole={selectedRole}
          onRoleChange={(val) => {
            setSelectedRole(val)
            resetPage()
          }}
          actions={
            <Button
              type="button"
              onClick={handleOpenCreate}
              className="shrink-0"
            >
              <PlusIcon />
              Nuevo perfil
            </Button>
          }
        />

        <DataTable
          isLoading={isLoading}
          isError={isError}
          errorMessage="No se pudieron cargar los perfiles técnicos."
          isEmpty={profiles.length === 0}
          emptyIcon={IdCardIcon}
          emptyMessage="No se encontraron perfiles técnicos. Registra el primer perfil técnico."
          pagination={pagination}
          onPageChange={setPageNumber}
        >
          <ProfileTable
            profiles={profiles}
            onEdit={handleEdit}
            onAssignCer={(profile) => setAssignCerProfile(profile)}
            onDelete={handleDelete}
          />
        </DataTable>
      </div>

      <ProfileDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={editingProfile}
      />

      <AssignCerDialog
        open={Boolean(assignCerProfile)}
        onOpenChange={(open) => !open && setAssignCerProfile(null)}
        profile={assignCerProfile}
      />

      <DeleteProfileDialog
        open={Boolean(deletingProfile)}
        onOpenChange={(open) => !open && setDeletingProfile(null)}
        profile={deletingProfile}
      />
    </div>
  )
}
