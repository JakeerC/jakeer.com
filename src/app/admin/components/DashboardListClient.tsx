"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import Link from "next/link";
import { LuPen, LuRefreshCw } from "react-icons/lu";
import { AdminItemActions } from "./AdminItemActions";
import { getDrafts, syncDraftsAction } from "../actions";

export function DashboardListClient({ initialDrafts }: { initialDrafts: any[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchDrafts = async (archived: boolean) => {
    setLoading(true);
    try {
      const data = await getDrafts(archived);
      setDrafts(data || []);
    } catch (e) {
      console.error("Failed to fetch drafts", e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleArchived = () => {
    const nextState = !showArchived;
    setShowArchived(nextState);
    fetchDrafts(nextState);
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await syncDraftsAction();
      await fetchDrafts(showArchived);
    } catch (e) {
      console.error("Failed to sync", e);
    } finally {
      setLoading(false);
    }
  };

  const handleActionComplete = () => {
    fetchDrafts(showArchived);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2 mb-4">
        <Button variant="outline" size="sm" onClick={handleToggleArchived} disabled={loading}>
          {showArchived ? "Hide Archived" : "Show Archived"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          <LuRefreshCw size={14} className={loading ? "animate-spin mr-1" : "mr-1"} /> Sync & Refresh
        </Button>
      </div>

      {drafts.length === 0 ? (
        <div
          className="p-8 text-center border rounded-lg"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {showArchived ? "No archived drafts found." : "No pending drafts. Create a new one!"}
          </p>
        </div>
      ) : (
        drafts.map((draft) => (
          <div
            key={draft.id}
            className="p-4 border rounded-lg flex items-center justify-between hover:bg-black/5 transition-colors"
            style={{ borderColor: "var(--border)" }}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-primary)",
                  }}
                >
                  {draft.category}
                </span>
                <h3
                  className="font-bold text-lg"
                  style={{ color: "var(--text-primary)" }}
                >
                  {draft.title}
                </h3>
              </div>
              {draft.description && (
                <p
                  className="text-sm line-clamp-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {draft.description}
                </p>
              )}
              <div
                className="text-xs mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Last updated: {new Date(draft.updated_at).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className="text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: draft.pr_number ? "#fef08a" : "#e5e7eb",
                  color: "#1f2937",
                }}
              >
                {draft.pr_number ? `PR #${draft.pr_number}` : "Draft"}
              </span>
              <Link href={`/admin/${draft.id}`}>
                <Button variant="outline" size="sm">
                  <LuPen className="mr-1" size={14} /> Edit
                </Button>
              </Link>
              <AdminItemActions
                id={draft.id}
                isArchived={draft.is_archived}
                onActionComplete={handleActionComplete}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
}
