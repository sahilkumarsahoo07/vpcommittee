/**
 * Helper to auto-detect and transform social & video links (Instagram, YouTube, Google Drive, Direct Video)
 * into embeddable URLs that play directly inside the website.
 */

export type MediaType = 'IMAGE' | 'REEL' | 'YOUTUBE' | 'GDRIVE' | 'VIDEO';

export interface ProcessedMedia {
  mediaType: MediaType;
  rawUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
}

export function extractInstagramShortcode(url: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  const match = clean.match(/(?:p|reel|reels|tv|share\/reel|share\/p)\/([A-Za-z0-9_-]+)/i);
  return match ? match[1] : null;
}

export function processMediaUrl(url: string): ProcessedMedia {
  if (!url || !url.trim()) {
    return {
      mediaType: 'IMAGE',
      rawUrl: '',
      embedUrl: '',
      thumbnailUrl: '',
    };
  }

  const cleanUrl = url.trim();
  const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

  // 1. INSTAGRAM REELS & POSTS
  if (cleanUrl.includes('instagram.com') || cleanUrl.includes('instagr.am')) {
    const shortcode = extractInstagramShortcode(cleanUrl);
    const embedUrl = shortcode
      ? `https://www.instagram.com/p/${shortcode}/embed/`
      : cleanUrl.includes('/embed')
      ? cleanUrl
      : 'https://www.instagram.com/p/C-0XpTxy_2A/embed/';

    // Use full backend URL so it works on Netlify (not a relative /api path)
    const thumbnailUrl = shortcode
      ? `${API_BASE}/api/media/proxy-thumbnail?shortcode=${shortcode}`
      : '';

    return {
      mediaType: 'REEL',
      rawUrl: cleanUrl,
      embedUrl,
      thumbnailUrl,
    };
  }

  // 2. YOUTUBE VIDEOS & SHORTS
  if (cleanUrl.includes('youtube.com') || cleanUrl.includes('youtu.be')) {
    let videoId = '';
    if (cleanUrl.includes('youtu.be/')) {
      videoId = cleanUrl.split('youtu.be/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (cleanUrl.includes('/shorts/')) {
      videoId = cleanUrl.split('/shorts/')[1]?.split('?')[0]?.split('/')[0] || '';
    } else if (cleanUrl.includes('v=')) {
      videoId = cleanUrl.split('v=')[1]?.split('&')[0] || '';
    } else if (cleanUrl.includes('/embed/')) {
      videoId = cleanUrl.split('/embed/')[1]?.split('?')[0]?.split('/')[0] || '';
    }

    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1` : cleanUrl;
    const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

    return {
      mediaType: 'YOUTUBE',
      rawUrl: cleanUrl,
      embedUrl,
      thumbnailUrl,
    };
  }

  // 3. GOOGLE DRIVE VIDEOS
  if (cleanUrl.includes('drive.google.com')) {
    let fileId = '';
    const match = cleanUrl.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      fileId = match[1];
    }

    const embedUrl = fileId
      ? `https://drive.google.com/file/d/${fileId}/preview`
      : cleanUrl.replace(/\/view.*/, '/preview');

    return {
      mediaType: 'GDRIVE',
      rawUrl: cleanUrl,
      embedUrl,
      thumbnailUrl: '/assets/mahaprasad.png', // GDrive video cover fallback
    };
  }

  // 4. DIRECT VIDEO FILES (.mp4, .webm, data:video, etc.)
  if (
    /\.(mp4|webm|ogg|mov)$/i.test(cleanUrl) ||
    cleanUrl.startsWith('data:video/')
  ) {
    return {
      mediaType: 'VIDEO',
      rawUrl: cleanUrl,
      embedUrl: cleanUrl,
      thumbnailUrl: '/assets/visarjan.png',
    };
  }

  // 5. DEFAULT TO IMAGE
  return {
    mediaType: 'IMAGE',
    rawUrl: cleanUrl,
    embedUrl: cleanUrl,
    thumbnailUrl: cleanUrl,
  };
}
