# Music Website Project

A monorepo music website project with admin panel and user-facing application.

## 🏗️ Project Structure

```
website-1/
├── apps/
│   ├── admin/          # Next.js Admin Panel (Port: 3001)
│   └── user/           # React User App (Port: 5173)
├── packages/
│   ├── schema/         # Shared TypeScript types
│   ├── styles/         # Shared SCSS styles
│   ├── ui/            # Shared UI components
│   └── utils/         # Shared utilities
└── README.md
```

## 🚀 Features

### Admin Panel (`/admin`)

- **Category Management**: Create, edit, delete, and reorder categories
- **Artist Management**: Manage artists with category associations
- **Song Management**: Manage songs with artist associations
- **Main Visual Management**: Register content for main visual display
- **Playlist Management**: Track user playlists and song interactions
- **Authentication**: Secure login system with middleware protection

### User Application (`/`)

- **Main Visual Section**: Dynamic category-based content display
- **Music Player**: YouTube integration with autoplay and mute
- **Playlist System**: Add songs to playlist with immediate playback
- **Recent Songs**: Display recently added songs
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Technology Stack

### Frontend

- **Admin**: Next.js 14, TypeScript, tRPC, Prisma
- **User**: React 18, TypeScript, Vite, Zustand
- **Styling**: SCSS with modular architecture

### Backend

- **Database**: SQLite with Prisma ORM
- **API**: tRPC for type-safe API calls
- **Authentication**: Next.js middleware

### Development Tools

- **Package Manager**: npm workspaces
- **Linting**: ESLint + Prettier
- **Type Safety**: TypeScript strict mode

## 🎵 Music Features

### Player System

- **YouTube Integration**: Support for both `youtu.be` and `youtube.com` URLs
- **Auto-play**: Immediate playback when songs are added to playlist
- **Mute Control**: Automatic muting for YouTube videos
- **Playlist Management**: Add/remove songs with real-time updates

### Content Management

- **Category-based Display**: Dynamic content switching by category
- **Live Status Detection**: Streaming status monitoring
- **Image/Video Support**: Multiple display types (image, YouTube, streaming)

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd website-1

# Install dependencies
npm install

# Set up database
cd apps/admin
npx prisma generate
npx prisma db push

# Start development servers
npm run dev
```

## 🚀 Development

```bash
# Start all applications
npm run dev

# Start individual applications
npm run dev:admin    # Admin panel (Port: 3001)
npm run dev:user     # User app (Port: 5173)

# Database operations
cd apps/admin
npx prisma studio    # Database GUI
npx prisma generate  # Regenerate Prisma client
```

## 🔧 API Endpoints

### Admin API (Port: 3001)

- `GET /api/main-visual/user` - Main visual data for user app
- `POST /api/playlist/user` - Add song to user playlist
- `POST /api/songs/search` - Search songs by artist and title
- `POST /api/crawl-streaming` - Check streaming live status

### User API (Port: 5173)

- All user-facing functionality through React components

## 🎯 Current Status

### ✅ Completed Features

- [x] Admin panel with full CRUD operations
- [x] User application with music player
- [x] YouTube integration with autoplay
- [x] Playlist management system
- [x] Real-time database synchronization
- [x] Responsive design implementation
- [x] Authentication system
- [x] Category-based content management

### 🔄 In Progress

- [ ] Enhanced error handling
- [ ] Performance optimizations
- [ ] Additional player features

### 📋 Planned Features

- [ ] Advanced search functionality
- [ ] User preferences system
- [ ] Social sharing features
- [ ] Analytics dashboard

## 🐛 Known Issues

- Some console.log statements remain for debugging
- Minor TypeScript warnings (non-critical)
- Import order warnings (cosmetic)

## 📝 License

This project is proprietary and confidential.

## 🤝 Contributing

Please follow the established coding standards and commit guidelines.
