"use client";

import { useState } from "react";
import { LuCopy, LuCheck, LuWrapText } from "react-icons/lu";

export default function CodeBlockClient({ code, lang, html }: { code: string; lang: string; html: string }) {
  const [copied, setCopied] = useState(false);
  const [isWrapped, setIsWrapped] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border group" style={{ borderColor: "var(--border)" }}>
      {/* Mac window header */}
      <div 
        className="flex items-end justify-between px-4 pt-2 border-b" 
        style={{ 
          background: "var(--surface-raised)", 
          borderColor: "var(--border)" 
        }}
      >
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div 
            className="text-[13px] font-medium font-mono lowercase tracking-wide border-b-2 pb-2 px-1" 
            style={{ 
              color: "var(--text-primary)",
              borderColor: "var(--text-primary)",
              marginBottom: "-1px"
            }}
          >
            {lang}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1.5">
           <button
             onClick={() => setIsWrapped(!isWrapped)}
             className="p-1.5 rounded-md transition-all cursor-pointer"
             style={{
               background: isWrapped ? "var(--border-strong)" : "var(--surface)",
               border: "1px solid var(--border-strong)",
               color: isWrapped ? "var(--text-primary)" : "var(--text-muted)",
             }}
             aria-label="Wrap text"
             title="Wrap text"
           >
             <LuWrapText size={14} />
           </button>
           <button
             onClick={copy}
             className="p-1.5 rounded-md transition-all cursor-pointer"
             style={{
               background: "var(--surface)",
               border: "1px solid var(--border-strong)",
               color: copied ? "#22c55e" : "var(--text-muted)",
             }}
             aria-label="LuCopy code"
             title="LuCopy code"
           >
             {copied ? <LuCheck size={14} /> : <LuCopy size={14} />}
           </button>
        </div>
      </div>
      <div 
        style={{ 
          background: "#0d1117", 
        }}
      >
        <div 
          className={`p-4 overflow-x-auto text-sm font-mono [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0 [&>pre]:!font-mono [&>pre]:!border-0 [&>pre]:!rounded-none [&_code]:[counter-reset:line] [&_.line::before]:[counter-increment:line] [&_.line::before]:[content:counter(line)] [&_.line::before]:inline-block [&_.line::before]:w-6 [&_.line::before]:mr-4 [&_.line::before]:text-right [&_.line::before]:text-[#4b5563] ${
            isWrapped ? "[&>pre]:!whitespace-pre-wrap [&>pre]:!break-words" : "[&>pre]:!whitespace-pre"
          }`}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}
