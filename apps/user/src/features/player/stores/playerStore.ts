import { create } from 'zustand';
import type { PlayerState, PlayerActions, PlaylistItem } from '../types';

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  playlist: [],
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,

  fetchPlaylist: async () => {
    // 컴포넌트에서 useQuery로 받아온 데이터를 setPlaylist로 넘겨야 함
    // 이 함수는 더 이상 직접 API를 호출하지 않음
    // (호환성 위해 남겨둠)
  },
  setPlaylist: (playlist: PlaylistItem[]) => {
    set({ playlist });
    if (playlist.length > 0) {
      set({ currentSong: playlist[0].song });
    } else {
      set({ currentSong: null });
    }
  },
  setCurrentSong: (song) => set({ currentSong: song }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (currentTime) => set({ currentTime }),

  play: async () => {
    set({ isPlaying: true });
  },
  pause: async () => {
    set({ isPlaying: false });
  },

  next: async () => {
    const { currentSong, playlist } = get();
    if (!currentSong || playlist.length === 0) return;
    if (playlist.length === 1) {
      set({ currentSong: playlist[0].song });
      return;
    }
    // next는 컴포넌트에서 API로 받아온 값을 setCurrentSong으로 넘겨야 함
  },

  previous: async () => {
    const { currentSong, playlist } = get();
    if (!currentSong || playlist.length === 0) return;
    if (playlist.length === 1) {
      set({ currentSong: playlist[0].song });
      return;
    }
    // previous도 컴포넌트에서 API로 받아온 값을 setCurrentSong으로 넘겨야 함
  },
  addSong: async (song: any) => {
    const { playlist } = get();
    const newPlaylist = [
      ...playlist,
      {
        id: Date.now(),
        userId: 1,
        artistId: song.artist.id,
        songId: song.id,
        song,
        artist: song.artist,
        createdAt: new Date().toISOString(),
        createdBy: 'user',
        updatedAt: new Date().toISOString(),
        updatedBy: 'user',
        isActive: true,
      },
    ];
    set({ playlist: newPlaylist, currentSong: song });
  },
  removeSong: async (songId: number) => {
    const { playlist } = get();
    const newPlaylist = playlist.filter((item) => item.song.id !== songId);
    set({ playlist: newPlaylist });
  },
}));
