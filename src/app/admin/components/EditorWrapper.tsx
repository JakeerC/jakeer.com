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
  linkDialogPlugin
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { FC, useRef } from "react";
import { useTheme } from "next-themes";

interface EditorProps {
  markdown: string;
  onChange: (markdown: string) => void;
  imageUploadHandler: (image: File) => Promise<string>;
}

export const Editor: FC<EditorProps> = ({ markdown, onChange, imageUploadHandler }) => {
  const ref = useRef<MDXEditorMethods>(null);
  const { resolvedTheme } = useTheme();

  return (
    <div className="border rounded-md overflow-hidden" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
      <MDXEditor
        ref={ref}
        markdown={markdown}
        onChange={onChange}
        className={resolvedTheme === 'dark' ? 'dark-theme' : 'light-theme'} 
        contentEditableClassName="prose max-w-none p-4"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: 'ts' }),
          codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', ts: 'TypeScript', tsx: 'React', css: 'CSS', md: 'Markdown', html: 'HTML' } }),
          imagePlugin({ imageUploadHandler }),
          tablePlugin(),
          frontmatterPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'Diff unavailable' }),
          toolbarPlugin({
            toolbarContents: () => (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertFrontmatter />
                <InsertCodeBlock />
              </DiffSourceToggleWrapper>
            )
          })
        ]}
      />
      <style jsx global>{`
        .mdxeditor {
          font-family: inherit;
        }
        .mdxeditor-toolbar {
          background: transparent !important;
        }
      `}</style>
    </div>
  );
};

export default Editor;
