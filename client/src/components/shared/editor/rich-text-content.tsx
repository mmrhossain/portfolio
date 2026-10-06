import {
  extractRichText,
  isEmptyRichText,
  isTiptapDoc,
  type JSONContent,
  type RichTextValue,
} from "@/lib/rich-text";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

interface RichTextContentProps {
  value: RichTextValue | unknown;
  className?: string;
  compact?: boolean;
}

function getAlignClass(attrs?: Record<string, unknown>) {
  const align = attrs?.textAlign;
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  if (align === "justify") return "text-justify";
  return undefined;
}

function renderMarks(text: string, marks?: JSONContent["marks"]) {
  if (!marks?.length) return text;

  return marks.reduce<ReactNode>((acc, mark) => {
    if (mark.type === "bold") return <strong>{acc}</strong>;
    if (mark.type === "italic") return <em>{acc}</em>;
    if (mark.type === "underline") return <u>{acc}</u>;
    if (mark.type === "strike") return <s>{acc}</s>;
    if (mark.type === "code") {
      return (
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground whitespace-pre-wrap break-words">
          {acc}
        </code>
      );
    }
    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
      if (!href) return acc;
      const isInternal = href.startsWith("/");
      if (isInternal) {
        return (
          <Link href={href} className="underline underline-offset-2">
            {acc}
          </Link>
        );
      }
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          {acc}
        </a>
      );
    }
    return acc;
  }, text);
}

function renderNodes(nodes?: JSONContent[]): ReactNode {
  if (!nodes?.length) return null;
  return nodes.map((node, index) => (
    <NodeView key={`${node.type ?? "node"}-${index}`} node={node} />
  ));
}

function NodeView({ node }: { node: JSONContent }) {
  const children = renderNodes(node.content);
  const alignClass = getAlignClass(node.attrs);

  switch (node.type) {
    case "doc":
      return <>{children}</>;
    case "paragraph":
      return <p className={alignClass}>{children ?? <br />}</p>;
    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const className = cn("font-display tracking-tight", alignClass);
      if (level === 1) return <h1 className={className}>{children}</h1>;
      if (level === 3) return <h3 className={className}>{children}</h3>;
      return <h2 className={className}>{children}</h2>;
    }
    case "bulletList":
      return <ul>{children}</ul>;
    case "orderedList":
      return <ol>{children}</ol>;
    case "listItem":
      return <li>{children}</li>;
    case "blockquote":
      return <blockquote>{children}</blockquote>;
    case "codeBlock": {
      // Directly extract text content from node children to preserve newlines and tree formatting
      const codeText = node.content?.map((n) => n.text ?? "").join("") ?? extractRichText(node);
      return (
        <pre className="bg-muted text-foreground rounded-xl p-4 overflow-x-auto whitespace-pre font-mono text-sm leading-relaxed">
          <code>{codeText}</code>
        </pre>
      );
    }
    case "horizontalRule":
      return <hr />;
    case "hardBreak":
      return <br />;
    case "text":
      return <>{renderMarks(node.text ?? "", node.marks)}</>;
    default:
      return children ? <>{children}</> : null;
  }
}

export function RichTextContent({ value, className, compact = false }: RichTextContentProps) {
  if (isEmptyRichText(value)) return null;

  if (!isTiptapDoc(value)) {
    const text = extractRichText(value);
    return (
      <p
        className={cn(
          "text-sm leading-relaxed text-muted-foreground sm:text-base",
          compact && "line-clamp-2",
          className
        )}
      >
        {text}
      </p>
    );
  }

  if (compact) {
    return (
      <p
        className={cn(
          "line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:text-base",
          className
        )}
      >
        {extractRichText(value)}
      </p>
    );
  }

  return (
    <div
      className={cn(
        "prose prose-neutral max-w-none min-w-0 break-words dark:prose-invert prose-headings:font-display prose-p:leading-relaxed",
        className
      )}
    >
      <NodeView node={value} />
    </div>
  );
}
