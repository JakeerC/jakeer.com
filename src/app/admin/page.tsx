import { createClient } from "@/lib/supabase/server";
import { getDrafts } from "./actions";
import Link from "next/link";
import { LoginForm } from "./components/LoginForm";
import { Button } from "@/components/Button";
import { LuPlus } from "react-icons/lu";

import { DashboardListClient } from "./components/DashboardListClient";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1
            className="font-display font-bold leading-tight mb-8"
            style={{
              fontSize: "clamp(2rem, 5vw, 3rem)",
              color: "var(--text-primary)",
            }}
          >
            Admin Dashboard
          </h1>
          <div
            className="text-center p-10 border rounded-lg"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-secondary)",
            }}
          >
            <h2
              className="text-xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Authentication Required
            </h2>
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Please log in to access the admin panel.
            </p>
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
        <h1
          className="font-display font-bold leading-tight"
          style={{
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "var(--text-primary)",
          }}
        >
          Dashboard
        </h1>
        <div className="flex gap-4">
          <Link href="/admin/assets">
            <Button variant="outline">Assets</Button>
          </Link>
          <Link href="/admin/new">
            <Button>
              <LuPlus size={16} /> New
            </Button>
          </Link>
        </div>
      </div>

      <DashboardListClient initialDrafts={drafts} />
    </div>
  );
}
