"use client";

import { useState, useEffect } from "react";
import { getAssetsAction } from "../actions";
import { FieldControl } from "../../../components/FieldControl";
import { Button } from "../../../components/Button";

type Asset = {
  name: string;
  id: string;
  updated_at: string;
  url: string;
};

export function AssetList({ onSelect }: { onSelect?: (url: string) => void }) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredAssets(assets);
    } else {
      const lower = search.toLowerCase();
      setFilteredAssets(assets.filter(a => a.name.toLowerCase().includes(lower)));
    }
  }, [search, assets]);

  const loadAssets = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAssetsAction();
      setAssets(data);
      setFilteredAssets(data);
    } catch (e: any) {
      setError(e.message || "Failed to load assets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (url: string) => {
    if (onSelect) {
      onSelect(url);
    } else {
      navigator.clipboard.writeText(`![Image](${url})`);
      alert("Image URL copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <FieldControl
            type="text"
            value={search}
            onChange={setSearch}
            placeholder="Search assets by name..."
          />
        </div>
        <Button variant="outline" onClick={loadAssets} disabled={isLoading}>
          {isLoading ? "..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto min-h-[300px] border rounded p-4 bg-[var(--bg-primary)] border-[var(--border)]">
        {isLoading ? (
          <div className="text-center text-sm py-10" style={{ color: "var(--text-secondary)" }}>
            Loading assets...
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center text-sm py-10" style={{ color: "var(--text-secondary)" }}>
            No assets found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredAssets.map(asset => (
              <div key={asset.id} className="border rounded overflow-hidden flex flex-col hover:border-[var(--accent)] transition-colors group relative bg-[var(--bg-secondary)] border-[var(--border)]">
                <div className="h-24 w-full flex items-center justify-center overflow-hidden bg-black/5 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={asset.url} alt={asset.name} className="object-cover w-full h-full" loading="lazy" />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Button size="sm" onClick={() => handleCopy(asset.url)}>
                      {onSelect ? "Select" : "Copy MD"}
                    </Button>
                  </div>
                </div>
                <div className="p-2 text-xs truncate text-center" title={asset.name} style={{ color: "var(--text-primary)" }}>
                  {asset.name}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
