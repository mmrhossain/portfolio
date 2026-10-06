export interface JSONContent {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JSONContent[];
  marks?: Array<{
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
}

export type RichTextValue = JSONContent | string | null | undefined;

export const EMPTY_DOC: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export function isTiptapDoc(value: unknown): value is JSONContent {
  return Boolean(
    value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (value as JSONContent).type === "doc",
  );
}

function walkText(value: unknown, parts: string[]): void {
  if (typeof value === "string") {
    parts.push(value);
    return;
  }

  if (!value || typeof value !== "object") return;

  const node = value as JSONContent;

  if (typeof node.text === "string") {
    parts.push(node.text);
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      walkText(child, parts);
    }
    if (node.type && node.type !== "text" && node.type !== "doc") {
      parts.push(" ");
    }
  }
}

export function extractRichText(value: RichTextValue | unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value.trim();

  const parts: string[] = [];
  walkText(value, parts);
  return parts.join("").replace(/\s+/g, " ").trim();
}

export function isEmptyRichText(value: RichTextValue | unknown): boolean {
  return extractRichText(value).length === 0;
}

export function toEditorContent(value: RichTextValue | unknown): JSONContent {
  if (isTiptapDoc(value)) return value;

  if (typeof value === "string" && value.trim()) {
    return {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: value }],
        },
      ],
    };
  }

  return EMPTY_DOC;
}
