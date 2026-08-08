import { createClient } from "@/lib/supabase/server";
import { AdminClient } from "../components/AdminClient";
import { redirect } from "next/navigation";
import { getAdminTopicOptions, getAdminSubtopicMap } from "@/lib/mdx";

export default async function NewDraftPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  return <AdminClient topicOptions={getAdminTopicOptions()} subtopicMap={getAdminSubtopicMap()} />;
}
