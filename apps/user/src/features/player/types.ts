export interface PlayerState {
  playlist: PlaylistItem[];
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
}

export interface PlayerActions {
  setPlaylist: (playlist: PlaylistItem[]) => void;
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (currentTime: number) => void;
}

export interface Song {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  youtubeUrl?: string;
  hasImage: boolean;
  hasAttachment: boolean;
  pdfUrl?: string;
  isFeaturedMainVisual: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  artist: Artist;
  tags: Tag[];
}

export interface Artist {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  category: Category;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface Category {
  id: number;
  code: string;
  status: string;
  name: string;
  order: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface PlaylistItem {
  id: number;
  userId: number;
  artistId: number;
  songId: number;
  song: Song;
  artist: Artist;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface YouTubePlayer {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  getPlayerState: () => number;
}

export interface YouTubeEvent {
  target: YouTubePlayer;
  data?: number;
}
