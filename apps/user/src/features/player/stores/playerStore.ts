import { create } from 'zustand';
import type { PlayerState, PlayerActions, Song, Artist } from '../types';

// 기본 아티스트 정보 (임시)
const defaultArtist: Artist = {
  id: '1',
  name: 'Hebl',
  image: undefined,
};

// 기본 곡 정보 (img_cover1.jpg 사용)
const defaultSong: Song = {
  id: '1',
  title: 'tr(Ever)',
  artist: defaultArtist,
  image: '/src/assets/img_cover1.jpg',
  duration: 180, // 3분
};

// 플레이어 상태 및 액션을 관리하는 Zustand store
export const usePlayerStore = create<PlayerState & PlayerActions>((set) => ({
  // 초기 상태
  currentSong: defaultSong,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,

  // 액션들
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  next: () => {
    // TODO: 다음 곡 로직 (플레이리스트에서 다음 곡으로)
  },

  previous: () => {
    // TODO: 이전 곡 로직 (플레이리스트에서 이전 곡으로)
  },
}));
