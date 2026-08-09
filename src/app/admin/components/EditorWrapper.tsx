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
  InsertFrontmatter,
  linkPlugin,
  linkDialogPlugin,
  ListsToggle,
  CodeToggle,
  Separator,
  InsertThematicBreak,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { FC, useRef } from "react";
import { useTheme } from "next-themes";

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
