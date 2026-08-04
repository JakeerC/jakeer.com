import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "../components/LoginForm";
import { AssetManager } from "../components/AssetManager";
import Link from "next/link";
import { Button } from "@/components/Button";

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="w-full">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h1 className="font-display font-bold leading-tight mb-8" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}>
            Assets
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

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">← Back</Button>
          </Link>
          <h1 className="font-display font-bold leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}>
            Asset Manager
          </h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 h-[600px]">
          <AssetManager />
        </div>
        <div className="border rounded-lg p-6 h-fit" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>Instructions</h3>
          <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li>Upload images (JPG, PNG) or SVG files up to 5MB.</li>
            <li>File names will be automatically slugified for web safety.</li>
            <li>If a file with the same name exists, you will be prompted to overwrite or append a unique suffix.</li>
            <li>Uploaded assets will be stored in the Supabase &apos;assets&apos; bucket.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
