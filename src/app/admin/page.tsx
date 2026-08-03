import { createClient } from "@/lib/supabase/server";
import { getDrafts } from "./actions";
import Link from "next/link";
import { LoginForm } from "./components/LoginForm";
import { Button } from "@/components/Button";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="font-display font-bold leading-tight mb-8" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}>
            Admin Dashboard
          </h1>
          <div className="text-center p-10 border rounded-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>Authentication Required</h2>
            <p className="mb-6 text-sm" style={{ color: "var(--text-secondary)" }}>Please log in to access the admin panel.</p>
            <LoginForm />
          </div>
        </div>
      </div>
    );
  }

  let drafts: any[] = [];
  try {
    drafts = await getDrafts();
  } catch (e) {
    console.error("Failed to load drafts:", e);
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}>
          Dashboard
        </h1>
        <div className="flex gap-4">
          <Link href="/admin/assets">
            <Button variant="outline">Assets</Button>
          </Link>
          <Link href="/admin/new">
            <Button>New Post</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {drafts.length === 0 ? (
          <div className="p-8 text-center border rounded-lg" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No pending drafts. Create a new one!</p>
          </div>
        ) : (
          drafts.map((draft) => (
            <div key={draft.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-black/5 transition-colors" style={{ borderColor: "var(--border)" }}>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>
                    {draft.category}
                  </span>
                  <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>{draft.title}</h3>
                </div>
                {draft.description && (
                  <p className="text-sm line-clamp-1" style={{ color: "var(--text-secondary)" }}>{draft.description}</p>
                )}
                <div className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
                  Last updated: {new Date(draft.updated_at).toLocaleString()}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ backgroundColor: draft.pr_number ? "#fef08a" : "#e5e7eb", color: "#1f2937" }}>
                  {draft.pr_number ? `PR #${draft.pr_number}` : 'Draft'}
                </span>
                <Link href={`/admin/${draft.id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
