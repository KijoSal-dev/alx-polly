import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function getUserFromSession() {
  const cookieStore = cookies();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  // If you store roles in user_metadata:
  return {
    id: data.user.id,
    email: data.user.email,
    role: data.user.user_metadata?.role || "user",
  };
}