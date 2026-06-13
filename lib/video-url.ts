/** Normalize a pasted competition video URL before validation/submit. */
export function normalizeVideoUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
  }

  let cleaned = trimmed;
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = `https://${cleaned}`;
  }

  try {
    const parsed = new URL(cleaned);
    parsed.hostname = parsed.hostname.toLowerCase();

    if (parsed.hostname === "tiktok.com") {
      parsed.hostname = "www.tiktok.com";
    }

    parsed.search = "";
    parsed.hash = "";

    let path = parsed.pathname.replace(/\/+$/, "") || "/";
    const mobileMatch = path.match(/^\/v\/(\d+)(?:\.html)?$/i);
    if (mobileMatch) {
      path = `/video/${mobileMatch[1]}`;
    }
    parsed.pathname = path;

    return parsed.toString().replace(/\/$/, "");
  } catch {
    return cleaned;
  }
}

export function videoUrlLabel(url: string, fallbackId?: number): string {
  const slug = url.replace(/\/$/, "").split("/").pop();
  if (slug && slug.length <= 28 && !/^\d+$/.test(slug)) {
    return slug;
  }
  return fallbackId ? `Video #${fallbackId}` : "Video";
}

export function displayVideoTitle(video: {
  title?: string | null;
  url: string;
  id?: number;
}): string {
  const title = video.title?.trim();
  if (title) {
    return title.length > 72 ? `${title.slice(0, 69)}…` : title;
  }
  return videoUrlLabel(video.url, video.id);
}
