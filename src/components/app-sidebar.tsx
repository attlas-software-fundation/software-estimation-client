"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { usePermissions } from "@/features/auth/hooks/use-permissions"
import { useSession } from "@/features/auth/hooks/use-session"
import { PERMISSIONS, type PermissionCode } from "@/enumeration/permission"
import {
  ChartColumnIcon,
  FolderKanbanIcon,
  FileBarChartIcon,
  IdCardIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

type SidebarItem = {
  title: string
  url: string
  icon: LucideIcon
  permission?: PermissionCode
}

const estimationModules: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: FileBarChartIcon,
  },
  {
    title: "Proyectos",
    url: "/projects",
    icon: FolderKanbanIcon,
    permission: PERMISSIONS.PROJECT_READ,
  },
  {
    title: "Perfiles técnicos (CER)",
    url: "/profiles",
    icon: IdCardIcon,
    permission: PERMISSIONS.PROFILE_READ,
  },
  {
    title: "Reportes del sistema",
    url: "/reports",
    icon: ChartColumnIcon,
    permission: PERMISSIONS.REPORT_READ,
  },
]

const securityModules: SidebarItem[] = [
  {
    title: "Usuarios",
    url: "/users",
    icon: UsersIcon,
    permission: PERMISSIONS.USER_READ,
  },
]

const isActivePath = (pathname: string, url: string) =>
  pathname === url || pathname.startsWith(`${url}/`)

export const AppSidebar = ({ ...props }: React.ComponentProps<"div">) => {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { hasPermission } = usePermissions()

  const visibleEstimation = estimationModules.filter(
    (item) => !item.permission || hasPermission(item.permission)
  )
  const visibleSecurity = securityModules.filter(
    (item) => !item.permission || hasPermission(item.permission)
  )

  const renderItems = (items: SidebarItem[]) =>
    items.map((item) => {
      const Icon = item.icon

      return (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            isActive={isActivePath(pathname, item.url)}
            tooltip={item.title}
            render={<Link href={item.url} />}
          >
            <Icon className="size-4 shrink-0 text-[#03DDAB]" />
            <span className="truncate">{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )
    })

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {visibleEstimation.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Estimación</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(visibleEstimation)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}

        {visibleSecurity.length > 0 ? (
          <SidebarGroup>
            <SidebarGroupLabel>Seguridad</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(visibleSecurity)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>

      <SidebarFooter>
        {session ? <NavUser user={session} /> : null}
      </SidebarFooter>
    </Sidebar>
  )
}
