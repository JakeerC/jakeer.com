import { FC } from "react";
import CodeBlockClient from "../../../components/CodeBlockClient";
import {
  Callout,
  SparkyText,
  MoreInfo,
  SwirlyUnderline,
  HighlightText,
} from "../../../components/mdx";

const SimpleCodeBlock: FC<{ code: string; lang?: string }> = ({
  code,
  lang = "mdx",
}) => {
  // Simulate Shiki output format so CodeBlockClient's CSS works perfectly
  const html = `<pre><code>${code
    .split("\n")
    .map(
      (line) =>
        `<span class="line" style="color:#d4d4d4">${line.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`,
    )
    .join("\n")}</code></pre>`;
  return <CodeBlockClient code={code} lang={lang} html={html} />;
};

export const FormattingHelp: FC = () => {
  return (
    <div className="space-y-6 overflow-y-auto pr-4 h-full pb-20">
      <div>
        <h3
          className="text-lg font-semibold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Custom JSX Components
        </h3>
        <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
          You can use these custom React components directly in your markdown
          content. Alternatively, use the ✦ Insert... dropdown in the editor
          toolbar.
        </p>

        <div className="space-y-4 text-sm">
          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">Callout Block</h4>
            <p className="text-[var(--text-secondary)] mb-4">
              Types: info, warning, success, error. Title is optional.
            </p>
            <div className="mb-4">
              <Callout type="info" title="Pro Tip">
                This is an important note!
              </Callout>
            </div>
            <SimpleCodeBlock
              code={`<Callout type="info" title="Pro Tip">\n  This is an important note!\n</Callout>`}
            />
          </div>
          <div className="space-y-4 text-sm">
            <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
              <h4 className="font-semibold mb-2">Callout Block</h4>
              <p className="text-[var(--text-secondary)] mb-4">
                Types: info, warning, success, error. Title is optional.
              </p>
              <div className="mb-4">
                <Callout type="success" title="Success">
                  This is a Success note!
                </Callout>
              </div>
              <SimpleCodeBlock
                code={`<Callout type="success" title="Success">\n  This is a Success note!\n</Callout>`}
              />
            </div>
          </div>
          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">Sparky Text</h4>
            <p className="text-[var(--text-secondary)] mb-4">
              Animated gradient shimmer effect for inline text.
            </p>
            <div
              className="mb-4 text-base"
              style={{ color: "var(--text-primary)" }}
            >
              This is <SparkyText>magical</SparkyText> text.
            </div>
            <SimpleCodeBlock
              code={`This is <SparkyText>magical</SparkyText> text.`}
            />
          </div>

          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">More Info (Tooltip)</h4>
            <p className="text-[var(--text-secondary)] mb-4">
              Adds an asterisk that reveals a tooltip on hover.
            </p>
            <div
              className="mb-4 text-base"
              style={{ color: "var(--text-primary)" }}
            >
              React uses a{" "}
              <MoreInfo info="Comparing two trees">virtual DOM</MoreInfo> update
              mechanism.
            </div>
            <SimpleCodeBlock
              code={`React uses a <MoreInfo info="Comparing two trees">virtual DOM</MoreInfo> update mechanism.`}
            />
          </div>

          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">Swirly Underline</h4>
            <p className="text-[var(--text-secondary)] mb-4">
              A hand-drawn style wavy underline that animates in.
            </p>
            <div
              className="mb-4 text-base"
              style={{ color: "var(--text-primary)" }}
            >
              Pay attention to <SwirlyUnderline>this part</SwirlyUnderline>.
            </div>
            <SimpleCodeBlock
              code={`Pay attention to <SwirlyUnderline>this part</SwirlyUnderline>.`}
            />
          </div>

          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">Highlight Text</h4>
            <p className="text-[var(--text-secondary)] mb-4">
              Marker highlight effect. Colors: amber (default), blue, green,
              pink.
            </p>
            <div
              className="mb-4 text-base"
              style={{ color: "var(--text-primary)" }}
            >
              Always <HighlightText color="pink">measure</HighlightText> first.
            </div>
            <SimpleCodeBlock
              code={`Always <HighlightText color="pink">measure</HighlightText> first.`}
            />
          </div>
        </div>
      </div>

      <div>
        <h3
          className="text-lg font-semibold mb-2 mt-6"
          style={{ color: "var(--text-primary)" }}
        >
          Standard Markdown
        </h3>

        <div className="space-y-4 text-sm">
          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">Images</h4>
            <p className="text-[var(--text-secondary)] mb-2">
              Use the Add Asset button to upload and copy the URL.
            </p>
            <SimpleCodeBlock
              lang="md"
              code={`![Alt text description](/assets/123-image.png)`}
            />
          </div>

          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">Code Blocks</h4>
            <p className="text-[var(--text-secondary)] mb-2">
              Use three backticks and specify the language.
            </p>
            <SimpleCodeBlock
              lang="md"
              code={"```typescript\nconst greeting = 'Hello World';\n```"}
            />
          </div>

          <div className="border border-[var(--border)] rounded-md p-4 bg-[var(--bg-secondary)]">
            <h4 className="font-semibold mb-2">Links & Formatting</h4>
            <SimpleCodeBlock
              lang="md"
              code={`[Link Text](https://example.com)\n**Bold Text**\n*Italic Text*\n~~Strikethrough~~`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
