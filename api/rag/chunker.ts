export function chunkText(
  text: string,
  maxChars = 800,
  overlap = 150
): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    const end = Math.min(i + maxChars, text.length);
    const slice = text.slice(i, end).trim();
    if (slice) chunks.push(slice);
    i = end - overlap;
    if (i >= text.length) break;
  }
  return chunks;
}
