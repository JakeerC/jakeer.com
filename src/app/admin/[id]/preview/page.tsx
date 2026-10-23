import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx/registry";
import Link from "next/link";
import { LuArrowLeft, LuTriangleAlert } from "react-icons/lu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

interface PreviewPageProps {
  readonly params: Promise<{ id: string }>;
}

export default async function DraftPreviewPage({ params }: PreviewPageProps) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin");
  }

  const { data: draft, error } = await supabase
    .from("content_drafts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !draft) {
    return notFound();
  }

  const title = (draft.title as string) || "Untitled";
  const description = (draft.description as string) || "";
  const category = (draft.category as string) || "";
  const markdown = (draft.markdown as string) || "";
  const metadata_obj = (draft.metadata as Record<string, unknown>) || {};

  const mdxError: string | null = !markdown.trim() ? "No content body to preview." : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Preview banner */}
      <div
        className="mb-8 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium border"
        style={{
          background: "var(--surface-raised)",
          borderColor: "var(--accent)",
          color: "var(--text-secondary)",
        }}
      >
        <LuTriangleAlert size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
        <span>
          <strong style={{ color: "var(--accent)" }}>Draft Preview</strong> — this content is not
          publicly indexed or accessible without authentication.
        </span>
      </div>

      {/* Back to editor */}
      <Link
        href={`/admin/${id}`}
        className="inline-flex items-center gap-2 text-sm mb-8 hover:underline underline-offset-4"
        style={{ color: "var(--text-muted)" }}
      >
        <LuArrowLeft size={14} />
        Back to Editor
      </Link>

      {/* Category badge */}
      <div className="mb-4">
        <span
          className="text-xs font-mono px-2 py-1 rounded"
          style={{ background: "var(--surface-raised)", color: "var(--text-muted)" }}
        >
          {category}
        </span>
      </div>

      {/* Title */}
      <h1
        className="font-display font-bold leading-tight mb-4"
        style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--text-primary)" }}
      >
        {title}
      </h1>

      {/* Description */}
      {description && (
        <p className="text-base mb-6 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      )}

      {/* Metadata summary */}
      {Object.keys(metadata_obj).length > 0 && (
        <div
          className="mb-8 p-4 rounded-xl text-sm font-mono border"
          style={{ background: "var(--surface-raised)", borderColor: "var(--border)", color: "var(--text-muted)" }}
        >
          <p className="font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>
            Metadata
          </p>
          {Object.entries(metadata_obj).map(([k, v]) =>
            v && k !== "images" ? (
              <div key={k}>
                <span style={{ color: "var(--accent)" }}>{k}:</span>{" "}
                {Array.isArray(v) ? v.join(", ") : String(v)}
              </div>
            ) : null
          )}
        </div>
      )}

      <div className="border-t mb-8" style={{ borderColor: "var(--border)" }} />

      {/* MDX content or error */}
      {mdxError ? (
        <div
          className="p-6 rounded-xl border text-sm"
          style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--surface-raised)" }}
        >
          {mdxError}
        </div>
      ) : (
        <article className="prose prose-sm md:prose-base" style={{ color: "var(--text-primary)" }}>
          <MDXRemote source={markdown} components={mdxComponents} />
        </article>
      )}

      {/* Bottom nav */}
      <div className="mt-16 pt-8 border-t flex gap-4" style={{ borderColor: "var(--border)" }}>
        <Link
          href={`/admin/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4"
          style={{ color: "var(--accent)" }}
        >
          <LuArrowLeft size={14} />
          Back to Editor
        </Link>
      </div>
    </div>
  );
}
