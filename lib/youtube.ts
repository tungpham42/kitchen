const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const THUMB_HOST = "https://i.ytimg.com/vi";

/** Extracts the video ID from common YouTube link formats (watch, youtu.be, embed, shorts, live). */
export function extractYouTubeId(rawUrl?: string | null): string | null {
  const value = rawUrl?.trim();
  if (!value) return null;
  try {
    const url = new URL(
      /^https?:\/\//i.test(value) ? value : `https://${value}`,
    );
    const host = url.hostname.replace(/^(www|m|music)\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = url.pathname.split("/")[1] ?? null;
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname === "/watch") id = url.searchParams.get("v");
      else {
        const [, kind, videoId] = url.pathname.split("/");
        if (["embed", "shorts", "live", "v"].includes(kind))
          id = videoId ?? null;
      }
    }
    return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function youtubeEmbedUrl(rawUrl?: string | null): string | null {
  const id = extractYouTubeId(rawUrl);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** The highest-quality thumbnail (may 404 for some videos) and a fallback thumbnail that always exists. */
export function youtubeThumbnailCandidates(rawUrl?: string | null): string[] {
  const id = extractYouTubeId(rawUrl);
  return id
    ? [`${THUMB_HOST}/${id}/maxresdefault.jpg`, `${THUMB_HOST}/${id}/hqdefault.jpg`]
    : [];
}

/** Used in the form: first checks whether the video has a maxres thumbnail, otherwise falls back to hqdefault. */
export function resolveYouTubeThumbnail(videoId: string): Promise<string> {
  const base = `${THUMB_HOST}/${videoId}`;
  const fallback = `${base}/hqdefault.jpg`;
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () =>
      // YouTube returns a 120x90 placeholder image when there is no maxres
      resolve(img.naturalWidth > 120 ? `${base}/maxresdefault.jpg` : fallback);
    img.onerror = () => resolve(fallback);
    img.src = `${base}/maxresdefault.jpg`;
  });
}
