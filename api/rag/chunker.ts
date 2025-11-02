export function chunkText(
  text: string,
  maxChars = 800,
  overlap = 150
): string[] {
  const chunks: string[] = [];
  const clean = text?.trim();
  if (!clean) return [];

  // If the text is short, return it directly
  if (clean.length <= maxChars) return [clean];

  let start = 0;
  while (start < clean.length) {
    const end = Math.min(start + maxChars, clean.length);
    const slice = clean.slice(start, end).trim();
    if (slice) chunks.push(slice);

    // Exit cleanly if we reached the end
    if (end >= clean.length) break;

    // Advance by (maxChars - overlap), never below 1
    start += Math.max(1, maxChars - overlap);
  }

  return chunks;
}
