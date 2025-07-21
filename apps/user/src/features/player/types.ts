// types for player feature
export interface Artist {
  id: string;
  name: string;
  image?: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
}

export interface PlayerActions {
  setCurrentSong: (song: Song | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
}

export interface Song {
  id: string;
  title: string;
  artist: Artist;
  image?: string;
  duration?: number;
}
