"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { LuSearch, LuHouse, LuFileText, LuCode, LuGitBranch, LuWrench, LuMoon, LuSun, LuLink as LinkIcon, LuSend } from "react-icons/lu";
import { siteConfig } from "@/lib/config";
import { posts, tools, snippets } from "@/lib/data";

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, [setOpen]);

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Global Command Menu"
      className="cmdk-dialog"
    >
      <div className="cmdk-header">
        <LuSearch size={18} className="cmdk-search-icon" />
        <Command.Input placeholder="LuSearch blogs, snippets, tools, anything..." />
        <div className="cmdk-esc">ESC</div>
      </div>
      
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Recent searches">
          <Command.Item onSelect={() => runCommand(() => {})}>
            <LuSearch size={14} className="mr-3 opacity-60" />
            mcp
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Writing & Blogs">
          {posts.map((post) => (
            <Command.Item 
              key={post.slug} 
              value={`writing ${post.title} ${post.excerpt}`} 
              onSelect={() => runCommand(() => router.push(`/writing/${post.slug}`))}
            >
              <LuFileText size={14} className="mr-3 opacity-60" />
              {post.title}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Tools">
          {tools.map((tool) => (
            <Command.Item 
              key={tool.slug} 
              value={`tool ${tool.name} ${tool.description}`} 
              onSelect={() => runCommand(() => window.open(tool.link, "_blank"))}
            >
              <LuWrench size={14} className="mr-3 opacity-60" />
              {tool.name}
            </Command.Item>
          ))}
        </Command.Group>

        <Command.Group heading="Snippets">
          {Object.values(snippets).flatMap((category) => 
            category.items.map((item) => (
              <Command.Item 
                key={item.title} 
                value={`snippet ${item.title} ${item.description}`} 
                onSelect={() => runCommand(() => router.push(`/snippets/${category.label.toLowerCase()}`))}
              >
                <LuCode size={14} className="mr-3 opacity-60" />
                {item.title}
              </Command.Item>
            ))
          )}
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => runCommand(() => router.push("/"))}>
            <LuHouse size={14} className="mr-3 opacity-60" />
            Go to LuHouse
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push("/writing"))}>
            <LuFileText size={14} className="mr-3 opacity-60" />
            Go to Blogs
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push("/snippets"))}>
            <LuCode size={14} className="mr-3 opacity-60" />
            Go to Snippets
          </Command.Item>

          <Command.Item onSelect={() => runCommand(() => router.push("/tools"))}>
            <LuWrench size={14} className="mr-3 opacity-60" />
            Go to Tools
          </Command.Item>
          
          <Command.Item onSelect={() => runCommand(() => setTheme(isDark ? "light" : "dark"))}>
            {isDark ? <LuSun size={14} className="mr-3 opacity-60" /> : <LuMoon size={14} className="mr-3 opacity-60" />}
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
          <span className="cmdk-shortcut"><kbd>↑↓</kbd> navigate</span>
          <span className="cmdk-shortcut"><kbd>↵</kbd> open</span>
          <span className="cmdk-shortcut"><kbd>esc</kbd> close</span>
        </div>
        <div className="cmdk-footer-logo">ready</div>
      </div>
    </Command.Dialog>
  );
}
