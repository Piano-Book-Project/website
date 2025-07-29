// utils for player feature

// 시간을 MM:SS 형식으로 포맷
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 이미지 URL이 유효한지 확인
export function isValidImageUrl(url: string): boolean {
  return Boolean(url && (url.startsWith('http') || url.startsWith('/')));
}

// 기본 이미지 경로 반환
export function getDefaultImagePath(): string {
  return '/img_cover1.svg';
}

export function getYoutubeThumbnail(youtubeUrl?: string): string | undefined {
  if (!youtubeUrl) return undefined;

  // youtu.be/VIDEO_ID 형태 처리
  const youtuBeMatch = youtubeUrl.match(/youtu\.be\/([^?&#]+)/);
  if (youtuBeMatch) {
    return `https://i.ytimg.com/vi/${youtuBeMatch[1]}/maxresdefault.jpg`;
  }

  // youtube.com/watch?v=VIDEO_ID 형태 처리
  const youtubeMatch = youtubeUrl.match(/[?&]v=([^&#]+)/);
  if (youtubeMatch) {
    return `https://i.ytimg.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
  }

  return undefined;
}
