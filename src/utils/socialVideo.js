export function getVideoType(url = "") {
  const value = String(url).trim().toLowerCase();
  if (!value) return null;
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "youtube";
  if (value.includes("instagram.com")) return "instagram";
  if (value.includes("tiktok.com")) return "tiktok";
  if (value.includes("facebook.com") || value.includes("fb.watch")) return "facebook";
  return "other";
}

export function getYouTubeId(url = "") {
  const match = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return match?.[1] || "";
}

export function getInstagramId(url = "") {
  const match = String(url).match(/instagram\.com\/(?:reel|reels|p|tv)\/([A-Za-z0-9_-]+)/i);
  return match?.[1] || "";
}

/**
 * Thumbnail yang bisa dibuat tanpa request tambahan.
 * YouTube menyediakan thumbnail publik berdasarkan video ID.
 */
export function getSocialThumbnail(url = "") {
  const type = getVideoType(url);
  if (type === "youtube") {
    const id = getYouTubeId(url);
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
  }
  // Instagram/TikTok tidak selalu mengizinkan thumbnail diambil langsung
  // oleh browser. NewsCard akan mencoba oEmbed dan memakai foto berita
  // sebagai fallback jika thumbnail tidak tersedia.
  return "";
}

/**
 * Mencoba mengambil thumbnail/cover dari platform yang menyediakan oEmbed.
 * TikTok secara publik menyediakan thumbnail_url melalui endpoint oEmbed.
 * Instagram dapat gagal karena pembatasan akses; dalam kasus itu caller
 * harus menggunakan fallback (foto berita).
 */
export async function fetchSocialThumbnail(url = "") {
  const type = getVideoType(url);
  if (!url || !type) return "";

  if (type === "tiktok" || type === "instagram") {
    try {
      const endpoint = type === "tiktok"
        ? `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`
        : `https://www.instagram.com/oembed/?url=${encodeURIComponent(url)}`;
      const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
      if (!response.ok) return "";
      const data = await response.json();
      return data?.thumbnail_url || "";
    } catch {
      return "";
    }
  }

  return getSocialThumbnail(url);
}

export function getVideoLabel(url = "") {
  const labels = {
    youtube: "YouTube",
    instagram: "Instagram",
    tiktok: "TikTok",
    facebook: "Facebook",
    other: "Video",
  };
  return labels[getVideoType(url)] || "Video";
}
