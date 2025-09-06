import { getUserFromSession } from "@/app/lib/auth-utils"; // You must implement this helper
import { redirect } from "next/navigation";
import AdminPanelClient from "./AdminPanelClient";

// Server Component: Access Control
export default async function AdminPage() {
  const user = await getUserFromSession();

  if (!user || user.role !== "admin") {
    redirect("/");
    return null;
  }

  // Render the client component for UI
  return <AdminPanelClient />;
}