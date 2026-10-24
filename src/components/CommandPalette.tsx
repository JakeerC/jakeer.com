"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import {
  LuSearch,
  LuFileText,
  LuCode,
  LuWrench,
  LuMoon,
  LuSun,
  LuLink as LinkIcon,
  LuBookOpen,
  LuFolderOpen,
} from "react-icons/lu";

import { BiCode } from "react-icons/bi";
import { HiHome } from "react-icons/hi";
import { getSearchData, type SearchResult } from "@/app/actions";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      setError(false);
    }, 0);
    getSearchData()
      .then((data: any) => {
        if (Array.isArray(data?.results)) {
          setResults(data.results);
        } else if (data) {
          const legacy: SearchResult[] = [];
          if (Array.isArray(data.posts)) {
            legacy.push(
              ...data.posts.map((p: any) => ({
                kind: "writing" as const,
                slug: p.slug,
                title: p.title,
                description: p.excerpt || p.description || "",
                href: `/writing/${p.slug}`,
                tags: p.tags || [],
              })),
            );
          }
          if (Array.isArray(data.snippets)) {
            legacy.push(
              ...data.snippets.map((s: any) => ({
                kind: "snippet" as const,
                slug: s.slug || (s.title ? s.title.toLowerCase().replace(/\s+/g, "-") : "snippet"),
                title: s.title,
                description: s.description || "",
                href: s.href || (s.slug ? `/snippets/${(s.category || "general").toLowerCase()}/${s.slug}` : `/snippets/${(s.category || "general").toLowerCase()}`),
                tags: s.tags || [],
                category: s.category || "general",
              })),
            );
          }
          if (Array.isArray(data.tools)) {
            legacy.push(
              ...data.tools.map((t: any) => ({
                kind: "tool" as const,
                slug: t.slug,
                title: t.name || t.title,
                description: t.description || "",
                href: t.link || t.href || "",
                external: true as const,
                link: t.link || t.href || "",
              })),
            );
          }
          setResults(legacy);
        } else {
          setResults([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const runCommand = useCallback(
    (command: () => void) => {
      setOpen(false);
      command();
    },
    [setOpen],
  );

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const isDark = resolvedTheme === "dark";

  const writingResults = results.filter((r) => r.kind === "writing");
  const snippetResults = results.filter((r) => r.kind === "snippet");
  const toolResults = results.filter((r) => r.kind === "tool");
  const noteResults = results.filter((r) => r.kind === "note");
  const projectResults = results.filter((r) => r.kind === "project");

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="cmdk-dialog"
    >
      <div className="cmdk-header">
        <LuSearch size={18} className="cmdk-search-icon" />
        <Command.Input placeholder="Search blogs, snippets, tools, anything..." />
        <div className="cmdk-esc">ESC</div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loading && "Loading search results…"}
        {error && "Failed to load search results. Please try again."}
        {!loading && !error && results.length === 0 && "No results found."}
      </div>

      <Command.List>
        {loading && (
          <Command.Loading>
            <div className="px-4 py-6 text-center text-sm opacity-60">
              Loading…
            </div>
          </Command.Loading>
        )}

        {!loading && error && (
          <div className="px-4 py-6 text-center text-sm opacity-60">
            Failed to load results. Please try again.
          </div>
        )}

        <Command.Group heading="Recent searches">
          <Command.Item onSelect={() => runCommand(() => {})}>
            <LuSearch size={14} className="mr-3 opacity-60" />
            mcp
          </Command.Item>
        </Command.Group>

        {!loading && !error && <Command.Empty>No results found.</Command.Empty>}

        {writingResults.length > 0 && (
          <Command.Group heading="Writing & Blogs">
            {writingResults.map((item) => (
              <Command.Item
                key={item.slug}
                value={`writing ${item.title} ${item.description} ${item.tags.join(" ")}`}
                onSelect={() =>
                  runCommand(() => router.push(item.href))
                }
              >
                <LuFileText size={14} className="mr-3 opacity-60" />
                <span className="flex-1">{item.title}</span>
                {item.description && (
                  <span className="ml-2 text-xs opacity-50 truncate max-w-[200px] hidden sm:block">
                    {item.description}
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        )}

        {snippetResults.length > 0 && (
          <Command.Group heading="Snippets">
            {snippetResults.map((item) => {
              if (item.kind !== "snippet") return null;
              return (
                <Command.Item
                  key={item.slug}
                  value={`snippet ${item.title} ${item.description} ${item.tags.join(" ")}`}
                  onSelect={() =>
                    runCommand(() => router.push(item.href))
                  }
                >
                  <BiCode size={14} className="mr-3 opacity-60" />
                  <span className="flex-1">{item.title}</span>
                  <span className="ml-2 text-xs opacity-50 capitalize">
                    {item.category}
                  </span>
                </Command.Item>
              );
            })}
          </Command.Group>
        )}

        {toolResults.length > 0 && (
          <Command.Group heading="Tools">
            {toolResults.map((item) => {
              if (item.kind !== "tool") return null;
              return (
                <Command.Item
                  key={item.slug}
                  value={`tool ${item.title} ${item.description}`}
                  onSelect={() =>
                    runCommand(() =>
                      window.open(item.href, "_blank"),
                    )
                  }
                >
                  <LuWrench size={14} className="mr-3 opacity-60" />
                  <span className="flex-1">{item.title}</span>
                  <span className="ml-2 text-xs opacity-50">(external)</span>
                </Command.Item>
              );
            })}
          </Command.Group>
        )}

        {noteResults.length > 0 && (
          <Command.Group heading="Notes">
            {noteResults.map((item) => {
              if (item.kind !== "note") return null;
              return (
                <Command.Item
                  key={`${item.topic}/${item.slug}`}
                  value={`note ${item.title} ${item.subtopic} ${item.topic}`}
                  onSelect={() =>
                    runCommand(() => router.push(item.href))
                  }
                >
                  <LuBookOpen size={14} className="mr-3 opacity-60" />
                  <span className="flex-1">{item.title}</span>
                  <span className="ml-2 text-xs opacity-50">{item.subtopic}</span>
                </Command.Item>
              );
            })}
          </Command.Group>
        )}

        {projectResults.length > 0 && (
          <Command.Group heading="Projects">
            {projectResults.map((item) => (
              <Command.Item
                key={item.slug}
                value={`project ${item.title} ${item.description} ${item.tags.join(" ")}`}
                onSelect={() =>
                  runCommand(() => router.push("/projects"))
                }
              >
                <LuFolderOpen size={14} className="mr-3 opacity-60" />
                <span className="flex-1">{item.title}</span>
                {item.tags.length > 0 && (
                  <span className="ml-2 text-xs opacity-50 hidden sm:block">
                    {item.tags.slice(0, 2).join(", ")}
                  </span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        )}

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => runCommand(() => router.push("/"))}>
            <HiHome size={14} className="mr-3 opacity-60" />
            Go to Home
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => router.push("/writing"))}
          >
            <LuFileText size={14} className="mr-3 opacity-60" />
            Go to Blogs
          </Command.Item>
          <Command.Item
            onSelect={() => runCommand(() => router.push("/snippets"))}
          >
            <LuCode size={14} className="mr-3 opacity-60" />
            Go to Snippets
          </Command.Item>

          <Command.Item
            onSelect={() => runCommand(() => router.push("/tools"))}
          >
            <LuWrench size={14} className="mr-3 opacity-60" />
            Go to Tools
          </Command.Item>

          <Command.Item
            onSelect={() =>
              runCommand(() => setTheme(isDark ? "light" : "dark"))
            }
          >
            {isDark ? (
              <LuSun size={14} className="mr-3 opacity-60" />
            ) : (
              <LuMoon size={14} className="mr-3 opacity-60" />
            )}
            Switch to {isDark ? "Light" : "Dark"} Mode
          </Command.Item>
          <Command.Item onSelect={() => runCommand(copyUrl)}>
            <LinkIcon size={14} className="mr-3 opacity-60" />
            Copy Current URL
          </Command.Item>
        </Command.Group>
      </Command.List>

      <div className="cmdk-footer">
        <div className="cmdk-shortcuts">
          <span className="cmdk-shortcut">
            <kbd>↑↓</kbd> navigate
          </span>
          <span className="cmdk-shortcut">
            <kbd>↵</kbd> open
          </span>
          <span className="cmdk-shortcut">
            <kbd>esc</kbd> close
          </span>
        </div>
        <div className="cmdk-footer-logo">ready</div>
      </div>
    </Command.Dialog>
  );
}
