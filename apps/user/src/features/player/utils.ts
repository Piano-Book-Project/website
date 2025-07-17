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
  return '/src/assets/img_cover1.jpg';
}
