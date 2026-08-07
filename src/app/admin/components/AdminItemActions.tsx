"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { LuArchive, LuArchiveRestore, LuTrash, LuLoader } from "react-icons/lu";
import {
  archiveDraftAction,
  unarchiveDraftAction,
  deleteDraftAction,
} from "../actions";

export function AdminItemActions({
  id,
  isArchived,
  onActionComplete,
}: {
  id: string;
  isArchived?: boolean;
  onActionComplete: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleArchive = async () => {
    if (!window.confirm("Are you sure you want to archive this draft?")) return;
    setLoading(true);
    try {
      await archiveDraftAction(id);
      onActionComplete();
    } catch (e) {
      console.error(e);
      alert("Failed to archive");
    } finally {
      setLoading(false);
    }
  };

  const handleUnarchive = async () => {
    if (!window.confirm("Are you sure you want to unarchive this draft?"))
      return;
    setLoading(true);
    try {
      await unarchiveDraftAction(id);
      onActionComplete();
    } catch (e) {
      console.error(e);
      alert("Failed to unarchive");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm("Are you sure you want to permanently delete this draft?")
    )
      return;
    setLoading(true);
    try {
      await deleteDraftAction(id);
      onActionComplete();
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      {isArchived ? (
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnarchive}
          disabled={loading}
        >
          {loading ? (
            <LuLoader className="animate-spin mr-1" size={14} />
          ) : (
            <LuArchiveRestore className="mr-1" size={14} />
          )}{" "}
          Unarchive
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={handleArchive}
          disabled={loading}
        >
          {loading ? (
            <LuLoader className="animate-spin mr-1" size={14} />
          ) : (
            <LuArchive className="mr-1" size={14} />
          )}{" "}
          Archive
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
      >
        {loading ? (
          <LuLoader className="animate-spin mr-1" size={14} />
        ) : (
          <LuTrash className="mr-1" size={14} />
        )}{" "}
        Delete
      </Button>
    </div>
  );
}
