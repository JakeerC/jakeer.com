"use client";

import { useState } from "react";
import { AssetUploader } from "./AssetUploader";
import { AssetList } from "./AssetList";
import { Button } from "../../../components/Button";

export function AssetManager({ onSelect }: { onSelect?: (url: string) => void }) {
  const [activeTab, setActiveTab] = useState<"upload" | "browse">("browse");

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex space-x-2 border-b pb-2" style={{ borderColor: "var(--border)" }}>
        <Button 
          variant={activeTab === "browse" ? "primary" : "ghost"} 
          size="sm"
          onClick={() => setActiveTab("browse")}
        >
          Browse Assets
        </Button>
        <Button 
          variant={activeTab === "upload" ? "primary" : "ghost"} 
          size="sm"
          onClick={() => setActiveTab("upload")}
        >
          Upload New
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === "browse" ? (
          <AssetList onSelect={onSelect} />
        ) : (
          <AssetUploader onUploadComplete={(url) => {
            if (onSelect) {
              onSelect(url);
            }
            // Switch back to browse after upload if no custom handler
            if (!onSelect) {
              setActiveTab("browse");
            }
          }} />
        )}
      </div>
    </div>
  );
}
