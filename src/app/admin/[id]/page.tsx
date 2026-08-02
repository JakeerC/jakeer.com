import { createClient } from "@/lib/supabase/server";
import { AdminClient } from "../components/AdminClient";
import { redirect } from "next/navigation";
import { getDraftById } from "../actions";

export default async function EditDraftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  let initialData = null;
  try {
    initialData = await getDraftById(id);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Failed to fetch draft:", e);
    redirect("/admin");
  }

  return <AdminClient initialData={initialData} />;
}
