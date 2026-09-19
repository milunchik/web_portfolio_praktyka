export function parseCommaSeparatedUrls(value?: string): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
}
