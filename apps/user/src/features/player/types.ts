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
  addSong: (song: Song) => void;
  removeSong: (songId: number) => void;
}

export interface Song {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
  hasImage: boolean;
  hasAttachment: boolean;
  pdfUrl: string | null;
  artistId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  isFeaturedMainVisual: boolean;
  tags: Tag[];
  artist: Artist;
}

export interface Artist {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  categoryId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  category: Category;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  order: number;
  code: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface Tag {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

// YouTube Player Options
export interface YouTubePlayerOptions {
  width: string;
  height: string;
  playerVars: {
    autoplay: number;
    controls: number;
    mute: number;
    loop: number;
    playlist: string;
    modestbranding: number;
    rel: number;
    showinfo: number;
    fs: number;
    disablekb: number;
    playsinline: number;
  };
}

// YouTube Player Event Handlers
export interface YouTubePlayerEventHandlers {
  onReady?: (event: any) => void;
  onEnd?: (event: any) => void;
  onError?: (event: any) => void;
  onStateChange?: (event: any) => void;
}
