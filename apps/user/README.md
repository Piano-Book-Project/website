# User Application

React-based user-facing music application with YouTube integration and playlist management.

## 🎵 Features

### Music Player System
- **YouTube Integration**: Support for both `youtu.be` and `youtube.com` URLs
- **Auto-play**: Immediate playback when songs are added to playlist
- **Mute Control**: Automatic muting for YouTube videos
- **Playlist Management**: Add/remove songs with real-time updates

### Main Visual Section
- **Dynamic Content**: Category-based content switching
- **Multiple Display Types**: Image, YouTube video, streaming content
- **Live Status Detection**: Real-time streaming status monitoring
- **Responsive Design**: Mobile-friendly interface

### Recent Songs Section
- **Song Display**: Show recently added songs with thumbnails
- **Play Integration**: Direct play button for each song
- **Artist Information**: Display artist and category information

## 🛠️ Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: SCSS with modular architecture
- **Icons**: React Icons
- **YouTube**: react-youtube

## 📁 Project Structure

```
apps/user/
├── src/
│   ├── components/           # Shared components
│   │   ├── ErrorBoundary.tsx
│   │   ├── Header.tsx
│   │   └── SideNav.tsx
│   ├── features/
│   │   ├── player/          # Music player feature
│   │   │   ├── components/  # Player components
│   │   │   ├── stores/      # Zustand stores
│   │   │   ├── types.ts     # TypeScript types
│   │   │   └── utils.ts     # Utility functions
│   │   └── playlist/        # Playlist management
│   ├── routes/              # Page components
│   ├── styles/              # SCSS styles
│   └── utils/               # Shared utilities
├── package.json
└── README.md
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 Key Components

### MainVisualSection
- **Purpose**: Display main visual content with category switching
- **Features**: 
  - YouTube video integration with autoplay
  - Image display with fallbacks
  - Category-based content filtering
  - Play button integration with playlist

### PlayerBar
- **Purpose**: Music player controls and current song display
- **Features**:
  - Play/pause controls
  - Volume control
  - Progress tracking
  - Song information display

### RecentSongsSection
- **Purpose**: Display recently added songs
- **Features**:
  - Song thumbnails (YouTube or image)
  - Play button for each song
  - Artist and category information
  - Responsive grid layout

## 🔧 API Integration

### Admin API Calls (Port: 3001)
- `GET /api/main-visual/user` - Fetch main visual data
- `POST /api/playlist/user` - Add song to playlist
- `POST /api/songs/search` - Search songs by artist and title

### State Management
- **Zustand Store**: Global player state management
- **Local State**: Component-specific state
- **API State**: Server state management

## 🎨 Styling

### SCSS Architecture
- **Modular Design**: Feature-based SCSS organization
- **Variables**: Centralized color and spacing variables
- **Mixins**: Reusable style patterns
- **Responsive**: Mobile-first approach

### Key Style Files
- `_main-visual-section.scss` - Main visual styling
- `_player-bar.scss` - Player controls styling
- `_recent-songs-section.scss` - Recent songs grid
- `_global.scss` - Global styles and variables

## 🎵 Player Features

### YouTube Integration
```typescript
// YouTube video configuration
const opts = {
  width: '100%',
  height: '420',
  playerVars: {
    autoplay: 1,
    controls: 0,
    mute: 1,
    loop: 1,
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
    fs: 0,
    disablekb: 1,
    playsinline: 1,
  },
};
```

### Playlist Management
```typescript
// Add song to playlist
const handlePlay = async (song: Song) => {
  const response = await fetch('http://localhost:3001/api/playlist/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: 1,
      artistId: song.artist.id,
      songId: song.id,
    }),
  });
  
  if (response.ok) {
    addSong(song); // Add to Zustand store
  }
};
```

## 🔄 State Management

### Player Store (Zustand)
```typescript
interface PlayerState {
  playlist: PlaylistItem[];
  currentSong: Song | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
}

interface PlayerActions {
  setPlaylist: (playlist: PlaylistItem[]) => void;
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  addSong: (song: Song) => void;
  removeSong: (songId: number) => void;
}
```

## 🐛 Known Issues

- Some console.log statements for debugging
- Minor TypeScript warnings (non-critical)
- YouTube URL parsing edge cases

## 🚀 Performance

### Optimizations
- **Lazy Loading**: Component-based code splitting
- **Memoization**: React.memo for expensive components
- **Debouncing**: API call optimization
- **Image Optimization**: Thumbnail generation

### Monitoring
- Error boundary implementation
- Console logging for debugging
- Performance monitoring ready

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- Touch-friendly controls
- Swipe gestures (planned)
- Adaptive layouts
- Mobile-optimized player

## 🔮 Future Enhancements

### Planned Features
- [ ] Advanced search functionality
- [ ] User preferences system
- [ ] Social sharing features
- [ ] Offline mode support
- [ ] Progressive Web App (PWA)
- [ ] Audio visualization
- [ ] Keyboard shortcuts
- [ ] Playlist sharing

### Technical Improvements
- [ ] Service Worker implementation
- [ ] Advanced caching strategies
- [ ] Performance monitoring
- [ ] A/B testing framework
- [ ] Analytics integration
