"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Command } from "cmdk";
import { 
  Search, 
  Home, 
  FileText, 
  Code, 
  GitBranch, 
  Wrench, 
  Moon, 
  Sun,
  Link as LinkIcon,
  Send
} from "lucide-react";
import { siteConfig } from "@/lib/config";

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
        <Search size={18} className="cmdk-search-icon" />
        <Command.Input placeholder="Search blogs, snippets, tools, anything..." />
        <div className="cmdk-esc">ESC</div>
      </div>
      
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Recent searches">
          <Command.Item onSelect={() => runCommand(() => {})}>
            <Search size={14} className="mr-3 opacity-60" />
            mcp
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => runCommand(() => router.push("/"))}>
            <Home size={14} className="mr-3 opacity-60" />
            Go to Home
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push("/writing"))}>
            <FileText size={14} className="mr-3 opacity-60" />
            Go to Blogs
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push("/snippets"))}>
            <Code size={14} className="mr-3 opacity-60" />
            Go to Snippets
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push("/notes"))}>
            <GitBranch size={14} className="mr-3 opacity-60" />
            Go to System Design Notes
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push("/tools"))}>
            <Wrench size={14} className="mr-3 opacity-60" />
            Go to Tools
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => router.push("/snippets"))}>
             <Send size={14} className="mr-3 opacity-60" />
             Submit a Snippet
          </Command.Item>
          
          <Command.Item onSelect={() => runCommand(() => setTheme(isDark ? "light" : "dark"))}>
            {isDark ? <Sun size={14} className="mr-3 opacity-60" /> : <Moon size={14} className="mr-3 opacity-60" />}
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
