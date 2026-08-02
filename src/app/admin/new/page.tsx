import { createClient } from "@/lib/supabase/server";
import { AdminClient } from "../components/AdminClient";
import { redirect } from "next/navigation";

export default async function NewDraftPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  return <AdminClient />;
}
