import { createClient } from "@/lib/supabase/server";
import { AdminClient } from "./components/AdminClient";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data, error: _error } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <div className="w-full">
      {!user ? (
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
      ) : (
        <AdminClient session={user} />
      )}
    </div>
  );
}

// Inline LoginForm for simplicity
import { LoginForm } from "./components/LoginForm";
