export function formatViewCount(count: number): string {
  if (count < 1000) return `${count}`;
  if (count < 1_000_000) return `${(count / 1000).toFixed(count >= 10_000 ? 0 : 1)}K`;
  if (count < 1_000_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  return `${(count / 1_000_000_000).toFixed(1)}B`;
}