export function getImageUrl(images, quality = "500x500") {
  if (!images || !images.length) return null;
  const match = images.find((i) => i.quality === quality);
  return match?.url || images[images.length - 1]?.url || null;
}

const QUALITY_ORDER = ["320kbps", "160kbps", "96kbps", "48kbps", "12kbps"];

export function getDownloadUrl(urls, preferredQuality = "320kbps") {
  if (!urls || !urls.length) return null;
  const exact = urls.find((u) => u.quality === preferredQuality);
  if (exact?.url) return exact.url;
  const prefIdx = QUALITY_ORDER.indexOf(preferredQuality);
  for (let i = prefIdx + 1; i < QUALITY_ORDER.length; i++) {
    const fallback = urls.find((u) => u.quality === QUALITY_ORDER[i]);
    if (fallback?.url) return fallback.url;
  }
  for (let i = prefIdx - 1; i >= 0; i--) {
    const fallback = urls.find((u) => u.quality === QUALITY_ORDER[i]);
    if (fallback?.url) return fallback.url;
  }
  return urls[urls.length - 1]?.url || null;
}

export function getAvailableQualities(urls) {
  if (!urls || !urls.length) return [];
  return urls.filter((u) => u.url).map((u) => u.quality);
}

export function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const s = Number(seconds);
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export function formatCount(count) {
  if (!count) return "";
  const n = Number(count);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function getArtistNames(artists) {
  if (!artists) return "";
  if (typeof artists === "string") return artists;
  const primary = artists.primary || artists.all || [];
  return primary.map((a) => a.name).join(", ");
}
