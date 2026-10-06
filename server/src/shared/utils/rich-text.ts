export type RichTextValue = string | Record<string, unknown> | null | undefined;

function walkText(value: unknown, parts: string[]): void {
  if (typeof value === "string") {
    parts.push(value);
    return;
  }

  if (!value || typeof value !== "object") return;

  const node = value as {
    text?: unknown;
    content?: unknown;
    type?: unknown;
  };

  if (typeof node.text === "string") {
    parts.push(node.text);
  }

  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      walkText(child, parts);
    }
    if (typeof node.type === "string" && node.type !== "text" && node.type !== "doc") {
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

export function wordCount(value: RichTextValue | unknown): number {
  const text = extractRichText(value);
  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}
