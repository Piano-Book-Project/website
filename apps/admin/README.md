# Admin Panel

Next.js-based admin panel for music website management with full CRUD operations and API endpoints.

## 🎛️ Features

### Content Management

- **Category Management**: Create, edit, delete, and reorder categories
- **Artist Management**: Manage artists with category associations
- **Song Management**: Manage songs with artist associations
- **Main Visual Management**: Register content for main visual display
- **Playlist Management**: Track user playlists and song interactions

### Authentication & Security

- **Login System**: Secure authentication with middleware protection
- **Route Protection**: Automatic redirect for unauthenticated users
- **Session Management**: Persistent login state

### API Endpoints

- **tRPC Integration**: Type-safe API calls
- **REST APIs**: User-facing endpoints for external consumption
- **Database Operations**: Full CRUD with Prisma ORM

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: SQLite with Prisma ORM
- **API**: tRPC for type-safe API calls
- **Authentication**: Next.js middleware
- **Styling**: SCSS with modular architecture
- **State Management**: React hooks + tRPC

## 📁 Project Structure

```
apps/admin/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── categories/        # Category management
│   │   ├── main-visual/       # Main visual management
│   │   ├── posts/             # Artist/Song management
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Shared components
│   ├── server/               # Backend logic
│   │   ├── routers/          # tRPC routers
│   │   ├── prisma.ts         # Database client
│   │   └── trpc.ts           # tRPC configuration
│   ├── styles/               # SCSS styles
│   └── utils/                # Utilities
├── prisma/                   # Database schema
├── package.json
└── README.md
```

## 🚀 Development

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push

# Start development server
npm run dev

# Database operations
npx prisma studio    # Database GUI
npx prisma generate  # Regenerate Prisma client
```

## 🎯 Key Features

### Category Management

- **CRUD Operations**: Full create, read, update, delete functionality
- **Order Management**: Drag-and-drop reordering with modal interface
- **Real-time Updates**: Immediate UI updates after operations
- **Validation**: Form validation and error handling

### Artist & Song Management

- **Tabbed Interface**: Separate tabs for Artist and Song management
- **Search & Filter**: Advanced filtering by category, status, creator
- **Chained Dropdowns**: Category → Artist → Song selection
- **Image Upload**: Thumbnail image URL management

### Main Visual Management

- **Content Registration**: Register content for main visual display
- **Display Types**: Support for image, YouTube, and streaming content
- **Live Status Detection**: Real-time streaming status monitoring
- **Category Integration**: Dynamic category-based content management

## 🔧 API Endpoints

### tRPC Routers

```typescript
// Category management
trpc.category.create;
trpc.category.update;
trpc.category.delete;
trpc.category.list;

// Artist management
trpc.artist.create;
trpc.artist.update;
trpc.artist.delete;
trpc.artist.list;

// Song management
trpc.song.create;
trpc.song.update;
trpc.song.delete;
trpc.song.list;

// Main visual management
trpc.mainVisual.create;
trpc.mainVisual.update;
trpc.mainVisual.delete;
trpc.mainVisual.list;
```

### REST API Endpoints

```typescript
// User-facing APIs
GET / api / main - visual / user; // Main visual data
POST / api / playlist / user; // Add song to playlist
POST / api / songs / search; // Search songs
POST / api / crawl - streaming; // Check streaming status
```

## 🗄️ Database Schema

### Core Models

```prisma
model Category {
  id          Int      @id @default(autoincrement())
  name        String
  code        String   @unique
  order       Int      @default(0)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  artists     Artist[]
  mainVisuals MainVisual[]
}

model Artist {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  imageUrl    String?
  categoryId  Int
  category    Category @relation(fields: [categoryId], references: [id])
  songs       Song[]
  mainVisuals MainVisual[]
}

model Song {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  imageUrl    String?
  youtubeUrl  String?
  artistId    Int
  artist      Artist   @relation(fields: [artistId], references: [id])
  mainVisuals MainVisual[]
  playlists   Playlist[]
}

model MainVisual {
  id           Int      @id @default(autoincrement())
  code         String   @unique
  categoryId   Int
  artistId     Int?
  songId       Int?
  displayType  String   // 'image', 'youtube', 'streaming'
  imageUrl     String?
  youtubeUrl   String?
  streamingUrl String?
  isLive       Boolean  @default(false)
  liveStatus   String?  // 'online', 'offline'
  order        Int      @default(0)
  isActive     Boolean  @default(true)
  category     Category @relation(fields: [categoryId], references: [id])
  artist       Artist?  @relation(fields: [artistId], references: [id])
  song         Song?    @relation(fields: [songId], references: [id])
}

model Playlist {
  id        Int      @id @default(autoincrement())
  userId    Int
  artistId  Int
  songId    Int
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  song      Song     @relation(fields: [songId], references: [id])
}
```

## 🎨 UI Components

### Management Pages

- **Category Management**: Table with inline editing and modal reordering
- **Artist Management**: Tabbed interface with search and filter
- **Song Management**: Advanced filtering with chained dropdowns
- **Main Visual Management**: Content registration with live status

### Common Components

- **Header**: Navigation and user information
- **Sidebar**: Menu navigation
- **Modal**: Reusable modal components
- **Forms**: Validated form components
- **Tables**: Sortable and filterable data tables

## 🔐 Authentication

### Login System

```typescript
// Middleware protection
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check authentication
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
}
```

### Session Management

- **Cookie-based**: Persistent authentication
- **Middleware**: Route protection
- **Auto-redirect**: Unauthenticated user handling

## 🎵 Music Features

### Streaming Integration

```typescript
// Live status detection
const checkStreamingStatus = async (url: string) => {
  const response = await fetch(url);
  const html = await response.text();

  const isLive = html.includes('live_information_video_container__E3LbD');
  const isOffline = html.includes('live_information_video_dimmed__Hrmtd');

  return {
    liveStatus: isLive ? 'online' : 'offline',
    isLive: isLive,
  };
};
```

### YouTube Integration

- **URL Parsing**: Support for multiple YouTube URL formats
- **Thumbnail Generation**: Automatic thumbnail extraction
- **Video ID Extraction**: Clean video ID parsing

## 📊 Data Management

### Real-time Updates

- **Optimistic Updates**: Immediate UI feedback
- **Error Handling**: Graceful error recovery
- **Loading States**: User feedback during operations

### Validation

- **Form Validation**: Client-side validation
- **Server Validation**: tRPC input validation
- **Database Constraints**: Prisma schema validation

## 🚀 Performance

### Optimizations

- **Code Splitting**: Route-based code splitting
- **Image Optimization**: Next.js image optimization
- **Caching**: API response caching
- **Lazy Loading**: Component lazy loading

### Monitoring

- **Error Tracking**: Comprehensive error logging
- **Performance Monitoring**: Core Web Vitals tracking
- **Database Monitoring**: Query performance tracking

## 🔮 Future Enhancements

### Planned Features

- [ ] Advanced analytics dashboard
- [ ] Bulk operations
- [ ] Advanced search and filtering
- [ ] User management system
- [ ] Content scheduling
- [ ] Automated testing
- [ ] Performance optimizations
- [ ] Mobile admin interface

### Technical Improvements

- [ ] GraphQL integration
- [ ] Real-time updates (WebSocket)
- [ ] Advanced caching strategies
- [ ] Microservices architecture
- [ ] Container deployment
- [ ] CI/CD pipeline
- [ ] Monitoring and alerting
- [ ] Backup and recovery

## 🐛 Known Issues

- Some console.log statements for debugging
- Minor TypeScript warnings (non-critical)
- Import order warnings (cosmetic)
- Prisma client regeneration needed occasionally

## 📝 Development Guidelines

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Database Guidelines

- **Migrations**: Always use Prisma migrations
- **Seeding**: Use Prisma seed for test data
- **Backup**: Regular database backups
- **Monitoring**: Query performance monitoring

### API Guidelines

- **tRPC**: Use tRPC for internal APIs
- **REST**: Use REST for external APIs
- **Validation**: Always validate inputs
- **Error Handling**: Comprehensive error responses
