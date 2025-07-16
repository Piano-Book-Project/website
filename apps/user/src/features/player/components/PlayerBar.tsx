import { useCurrentSong } from '../hooks/useCurrentSong';
import { useState } from 'react';

// 오픈소스 SVG 아이콘들
const MusicIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
  </svg>
);

export default function PlayerBar() {
  // 임시로 songId=1 fetch
  const { data, isLoading, error } = useCurrentSong(1);
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 border-t border-gray-800 text-center">
        Loading...
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 border-t border-gray-800 text-center">
        <span className="text-red-400">No song found</span>
        <div className="text-xs text-gray-500 mt-1">PLAIN FROM: COEXIST</div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 border-t border-gray-800">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {/* 왼쪽: 이미지 및 곡 정보 */}
        <div className="flex items-center space-x-4">
          {/* 앨범 이미지 */}
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
            {!imageError && data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt={`${data.title} cover`}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-600">
                <MusicIcon />
              </div>
            )}
          </div>

          {/* 곡 정보 */}
          <div className="flex flex-col">
            <span className="font-medium text-sm">{data.title}</span>
            <span className="text-xs text-gray-400">{data.artist?.name || '-'}</span>
          </div>
        </div>
        {/* 오른쪽: 비워둠 */}
        <div className="w-32"></div>
      </div>
      {/* 하단 고정 텍스트 */}
      <div className="text-center text-xs text-gray-500 mt-2">PLAIN FROM: COEXIST</div>
    </div>
  );
} 