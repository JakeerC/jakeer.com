"use client";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  imagePlugin,
  InsertImage,
  codeBlockPlugin,
  InsertCodeBlock,
  codeMirrorPlugin,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  tablePlugin,
  InsertTable,
  frontmatterPlugin,
  linkPlugin,
  linkDialogPlugin,
  ListsToggle,
  CodeToggle,
  Separator,
  InsertThematicBreak,
  jsxPlugin,
  type JsxComponentDescriptor,
  type JsxEditorProps,
  GenericJsxEditor,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { FC, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

// ---------------------------------------------------------------------------
// JSX Component Descriptors for Custom MDX Components
// ---------------------------------------------------------------------------

const CalloutEditor: FC<JsxEditorProps> = ({ mdastNode, descriptor }) => {
  return (
    <GenericJsxEditor mdastNode={mdastNode} descriptor={descriptor} />
  );
};

const InlineEditor: FC<JsxEditorProps> = ({ mdastNode, descriptor }) => {
  return (
    <GenericJsxEditor mdastNode={mdastNode} descriptor={descriptor} />
  );
};

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
  {
    name: "Callout",
    kind: "flow",
    props: [
      { name: "type", type: "string", required: true },
      { name: "title", type: "string", required: false },
    ],
    hasChildren: true,
    Editor: CalloutEditor,
  },
  {
    name: "SparkyText",
    kind: "text",
    props: [],
    hasChildren: true,
    Editor: InlineEditor,
  },
  {
    name: "MoreInfo",
    kind: "text",
    props: [{ name: "info", type: "string", required: true }],
    hasChildren: true,
    Editor: InlineEditor,
  },
  {
    name: "SwirlyUnderline",
    kind: "text",
    props: [],
    hasChildren: true,
    Editor: InlineEditor,
  },
  {
    name: "HighlightText",
    kind: "text",
    props: [{ name: "color", type: "string", required: false }],
    hasChildren: true,
    Editor: InlineEditor,
  },
];

// ---------------------------------------------------------------------------
// Custom Toolbar Button — Insert Custom Component
// ---------------------------------------------------------------------------

import { usePublisher } from "@mdxeditor/editor";
import { insertJsx$ } from "@mdxeditor/editor";

const InsertCalloutButton: FC = () => {
  const insertJsx = usePublisher(insertJsx$);

  const insertCallout = useCallback(
    (type: string) => {
      insertJsx({
        kind: "flow",
        name: "Callout",
        props: { type },
        children: [{ type: "paragraph", children: [{ type: "text", value: "Your content here..." }] }],
      });
    },
    [insertJsx]
  );

  const insertInline = useCallback(
    (name: string, props: Record<string, string> = {}) => {
      insertJsx({
        kind: "text",
        name,
        props,
        children: [{ type: "text", value: "text" }],
      });
    },
    [insertJsx]
  );

  return (
    <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
      <select
        title="Insert custom component"
        onChange={(e) => {
          const value = e.target.value;
          if (!value) return;

          if (value.startsWith("callout-")) {
            insertCallout(value.replace("callout-", ""));
          } else if (value === "SparkyText") {
            insertInline("SparkyText");
          } else if (value === "MoreInfo") {
            insertInline("MoreInfo", { info: "Additional information here" });
          } else if (value === "SwirlyUnderline") {
            insertInline("SwirlyUnderline");
          } else if (value === "HighlightText") {
            insertInline("HighlightText", { color: "amber" });
          }

          e.target.value = "";
        }}
        style={{
          fontSize: "0.75rem",
          padding: "4px 6px",
          borderRadius: "4px",
          border: "1px solid var(--border, #ccc)",
          background: "transparent",
          color: "inherit",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <option value="">✦ Insert…</option>
        <optgroup label="Callouts">
          <option value="callout-info">ℹ️ Info</option>
          <option value="callout-warning">⚠️ Warning</option>
          <option value="callout-success">✅ Success</option>
          <option value="callout-error">🚨 Error</option>
        </optgroup>
        <optgroup label="Text Effects">
          <option value="SparkyText">✨ Sparky Text</option>
          <option value="MoreInfo">※ More Info</option>
          <option value="SwirlyUnderline">〰️ Swirly Underline</option>
          <option value="HighlightText">🖍️ Highlight</option>
        </optgroup>
      </select>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Editor Component
// ---------------------------------------------------------------------------

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  imageUploadHandler: (image: File) => Promise<string>;
}

export const Editor: FC<EditorProps> = ({
  markdown,
  onChange,
  imageUploadHandler,
}) => {
  const ref = useRef<MDXEditorMethods>(null);
  const { resolvedTheme } = useTheme();

  return (
    <div
      className="border rounded-md"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <MDXEditor
        ref={ref}
        markdown={markdown}
        onChange={onChange}
        className={`min-h-[300px] prose max-w-none ${resolvedTheme === "dark" ? "dark-theme dark-editor prose-invert" : "light-theme"}`}
        contentEditableClassName="p-4 outline-none"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "ts" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: "JavaScript",
              ts: "TypeScript",
              tsx: "React",
              css: "CSS",
              md: "Markdown",
              html: "HTML",
              env: "Env",
              shell: "Shell",
              txt: "Text",
              java: "Java",
              python: "Python",
              c: "C",
              json: "JSON",
              mermaid: "Mermaid",
              yml: "YAML",
              sql: "SQL",
              toml: "TOML",
            },
          }),
          imagePlugin({ imageUploadHandler }),
          tablePlugin(),
          frontmatterPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          jsxPlugin({ jsxComponentDescriptors }),
          diffSourcePlugin({
            viewMode: "rich-text",
            diffMarkdown: "Diff unavailable",
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <div
                  className="flex flex-wrap items-center gap-1 w-full p-2 border-b"
                  style={{ borderColor: "var(--border)" }}
                >
                  <UndoRedo />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <BlockTypeSelect />
                  <Separator />
                  <CreateLink />
                  <InsertImage />
                  <InsertTable />
                  <InsertThematicBreak />
                  <InsertCodeBlock />
                  <Separator />
                  <InsertCalloutButton />
                </div>
              </DiffSourceToggleWrapper>
            ),
          }),
        ]}
      />
      <style jsx global>{`
        .mdxeditor {
          font-family: inherit;
        }
        .mdxeditor-toolbar {
          position: sticky !important;
          top: 50 !important;
          z-index: 50 !important;
          background-color: var(--bg-secondary) !important;
        }

        /* Dark Mode Overrides */
        .dark .dark-editor .mdxeditor {
          background-color: var(--surface) !important;
          color: var(--text-primary) !important;
        }

        .dark .dark-editor .cm-editor {
          background-color: #1e1e1e !important;
          color: #d4d4d4 !important;
        }

        .dark .dark-editor .cm-gutters {
          background-color: #1e1e1e !important;
          color: #858585 !important;
          border-right-color: #404040 !important;
        }

        .dark .dark-editor .cm-activeLine,
        .dark .dark-editor .cm-activeLineGutter {
          background-color: #2c2c2c !important;
        }

        .dark .dark-editor [class*="diffSource"],
        .dark .dark-editor [data-lexical-decorator] {
          background-color: #1e1e1e !important;
          color: #d4d4d4 !important;
        }

        .dark .dark-editor .mdxeditor-toolbar {
          background-color: var(--bg-secondary) !important;
          border-bottom: 1px solid var(--border) !important;
        }
      `}</style>
    </div>
  );
};

export default Editor;
