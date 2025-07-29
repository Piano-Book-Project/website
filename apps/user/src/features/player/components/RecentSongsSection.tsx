import { createTRPCReact } from '@trpc/react-query';
import { FaPlay } from 'react-icons/fa';
import type { AppRouter } from 'schema/src/trpc';
import { usePlayerStore } from '../stores/playerStore';
import type { Song } from '../types';
import { getYoutubeThumbnail } from '../utils';

const trpc = createTRPCReact<AppRouter>();

export default function RecentSongsSection() {
  // const { data: songs } = trpc.song.list.useQuery();
  const playlistCreate = trpc.playlist.create.useMutation();
  const { setCurrentSong } = usePlayerStore();

  // 최근 2주 내 곡만 필터링 (최신순)
  // const recentSongs = useMemo(() => {
  //   if (!songs) return [];
  //   return songs
  //     .filter((s: Song) => isRecent(s.createdAt))
  //     .sort((a: Song, b: Song) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // }, [songs]);
  const recentSongs: Song[] = [
    {
      id: 1,
      title: '더미 곡1',
      artist: {
        id: 1,
        name: '더미 아티스트1',
        category: {
          id: 1,
          code: 'CT-001',
          status: 'active',
          name: 'K-POP',
          order: 1,
          createdAt: '',
          createdBy: '',
          updatedAt: '',
          updatedBy: '',
          isActive: true,
        },
        createdAt: '',
        createdBy: '',
        updatedAt: '',
        updatedBy: '',
        isActive: true,
      },
      createdAt: new Date().toISOString(),
      createdBy: 'dummy',
      updatedAt: new Date().toISOString(),
      updatedBy: 'dummy',
      isActive: true,
      isFeaturedMainVisual: false,
      tags: [],
      hasImage: false,
      hasAttachment: false,
      pdfUrl: '',
      imageUrl: '',
      youtubeUrl: '',
    },
    {
      id: 2,
      title: '더미 곡2',
      artist: {
        id: 2,
        name: '더미 아티스트2',
        category: {
          id: 1,
          code: 'CT-001',
          status: 'active',
          name: 'K-POP',
          order: 1,
          createdAt: '',
          createdBy: '',
          updatedAt: '',
          updatedBy: '',
          isActive: true,
        },
        createdAt: '',
        createdBy: '',
        updatedAt: '',
        updatedBy: '',
        isActive: true,
      },
      createdAt: new Date().toISOString(),
      createdBy: 'dummy',
      updatedAt: new Date().toISOString(),
      updatedBy: 'dummy',
      isActive: true,
      isFeaturedMainVisual: false,
      tags: [],
      hasImage: false,
      hasAttachment: false,
      pdfUrl: '',
      imageUrl: '',
      youtubeUrl: '',
    },
  ];

  const handlePlay = async (song: Song) => {
    await playlistCreate.mutateAsync({
      userId: 1,
      artistId: song.artist.id,
      songId: song.id,
      createdBy: 'dummy',
    });
    setCurrentSong(song);
  };

  return (
    <section className="recent-songs-section">
      <h2 className="recent-songs__title">신규 등록곡</h2>
      <div className="recent-songs__list">
        {recentSongs.map((song: Song) => (
          <div className="recent-song-card" key={song.id}>
            <div className="recent-song-card__thumb-wrap">
              <img
                src={getYoutubeThumbnail(song.youtubeUrl) || song.imageUrl}
                alt={song.title}
                className="recent-song-card__thumb"
              />
              <button className="recent-song-card__play-btn" onClick={() => handlePlay(song)}>
                <FaPlay />
              </button>
            </div>
            <div className="recent-song-card__info">
              <div className="recent-song-card__title">{song.title}</div>
              <div className="recent-song-card__artist">{song.artist?.name}</div>
            </div>
          </div>
        ))}
        {recentSongs.length === 0 && (
          <div className="recent-songs__empty">최근 2주 내 등록된 곡이 없습니다.</div>
        )}
      </div>
    </section>
  );
}
