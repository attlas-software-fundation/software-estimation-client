import { redirect } from "next/navigation"

const ProtectedIndexPage = () => {
  redirect("/dashboard")
}

export default ProtectedIndexPage
