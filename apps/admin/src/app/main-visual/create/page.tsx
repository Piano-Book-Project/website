'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { trpc } from '../../../utils/trpc';

export default function MainVisualCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get('edit') === '1';
  const editId = searchParams?.get('id');

  // 메인 비주얼 상세 fetch (수정 모드)
  const { data: mainVisual } = trpc.mainVisual.get.useQuery(
    isEdit && editId ? { id: Number(editId) } : { id: -1 },
    {
      enabled: isEdit && !!editId,
    },
  );

  // 카테고리 리스트 fetch
  const { data: categories = [], isLoading: loadingCategories } = trpc.category.list.useQuery();

  // 아티스트 리스트 fetch
  const { data: artists = [], isLoading: loadingArtists } = trpc.artist.list.useQuery();

  // 노래 리스트 fetch
  const { data: songs = [], isLoading: loadingSongs } = trpc.song.list.useQuery();

  // 메인 비주얼 리스트 fetch (Code 계산용)
  const { data: mainVisuals = [] } = trpc.mainVisual.list.useQuery();

  // 입력값 상태
  const [code, setCode] = useState('');
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [artistId, setArtistId] = useState<number | null>(null);
  const [songId, setSongId] = useState<number | null>(null);
  const [displayType, setDisplayType] = useState<'image' | 'youtube' | 'streaming'>('image');
  const [imageUrl, setImageUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [streamingUrl, setStreamingUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [crawlingStatus, setCrawlingStatus] = useState<'idle' | 'crawling' | 'success' | 'error'>(
    'idle',
  );
  const [liveStatus, setLiveStatus] = useState<'online' | 'offline'>('offline');

  const createMainVisual = trpc.mainVisual?.create?.useMutation();
  const updateMainVisual = trpc.mainVisual?.update?.useMutation();

  // 최초/마지막 생성자/일자 등 동기화
  useEffect(() => {
    if (isEdit && mainVisual) {
      setCode(mainVisual.code || '');
      setCategoryId(mainVisual.categoryId || null);
      setArtistId(mainVisual.artistId || null);
      setSongId(mainVisual.songId || null);
      setDisplayType(mainVisual.displayType || 'image');
      setImageUrl(mainVisual.imageUrl || '');
      setYoutubeUrl(mainVisual.youtubeUrl || '');
      setStreamingUrl(mainVisual.streamingUrl || '');
      setIsActive(mainVisual.isActive ?? true);
      setLiveStatus(mainVisual.liveStatus || 'offline');
    }
  }, [isEdit, mainVisual]);

  // Code 자동 생성
  useEffect(() => {
    if (!isEdit) {
      // No 계산
      const nextNo = mainVisuals.length + 1;

      // Code 계산 (MV-XXX 형식)
      const nextCode = `MV-${String(nextNo).padStart(3, '0')}`;
      setCode(nextCode);
    }
  }, [isEdit, mainVisuals.length]);

  // 선택된 카테고리 정보
  const selectedCategory = categories.find((cat: any) => cat.id === categoryId);
  const isLiveCategory = selectedCategory?.name === 'LIVE';

  // 선택된 카테고리에 따른 아티스트 필터링
  const filteredArtists = artists.filter((artist: any) => artist.categoryId === categoryId);

  // 선택된 아티스트에 따른 노래 필터링
  const filteredSongs = songs.filter((song: any) => song.artistId === artistId);

  // 노래 선택 시 이미지 URL과 유튜브 URL 자동 설정
  useEffect(() => {
    if (songId && !isLiveCategory) {
      const selectedSong = songs.find((song: any) => song.id === songId);
      if (selectedSong) {
        if (selectedSong.imageUrl) {
          setImageUrl(selectedSong.imageUrl);
        }
        if (selectedSong.youtubeUrl) {
          setYoutubeUrl(selectedSong.youtubeUrl);
        }
      }
    }
  }, [songId, isLiveCategory, songs]);

  // 스트리밍 URL 크롤링 함수
  const crawlStreamingStatus = async (url: string) => {
    if (!url.trim()) return;

    setCrawlingStatus('crawling');
    try {
      const response = await fetch('/api/crawl-streaming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (data.success) {
        setLiveStatus(data.liveStatus);
        setCrawlingStatus('success');
      } else {
        setLiveStatus('offline');
        setCrawlingStatus('error');
      }
    } catch (error) {
      console.error('Crawling error:', error);
      setLiveStatus('offline');
      setCrawlingStatus('error');
    }
  };

  // 스트리밍 URL 변경 시 자동 크롤링
  useEffect(() => {
    if (displayType === 'streaming' && streamingUrl.trim()) {
      const timer = setTimeout(() => {
        crawlStreamingStatus(streamingUrl);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [streamingUrl, displayType]);

  const handleSave = async () => {
    if (!code.trim()) return alert('코드를 입력하세요.');
    if (!categoryId) return alert('카테고리를 선택하세요.');

    // LIVE 카테고리가 아닐 때만 아티스트와 노래 검증
    if (!isLiveCategory) {
      if (!artistId) return alert('아티스트를 선택하세요.');
      if (!songId) return alert('노래를 선택하세요.');
    }

    if (displayType === 'image' && !imageUrl.trim()) {
      return alert('이미지 URL을 입력하세요.');
    }
    if (displayType === 'youtube' && !youtubeUrl.trim()) {
      return alert('유튜브 URL을 입력하세요.');
    }
    if (displayType === 'streaming' && !streamingUrl.trim()) {
      return alert('스트리밍 URL을 입력하세요.');
    }

    setLoading(true);
    try {
      const mainVisualData = {
        code,
        categoryId,
        artistId: isLiveCategory ? undefined : artistId || undefined,
        songId: isLiveCategory ? undefined : songId || undefined,
        displayType,
        imageUrl: displayType === 'image' ? imageUrl : '',
        youtubeUrl: displayType === 'youtube' ? youtubeUrl : '',
        streamingUrl: displayType === 'streaming' ? streamingUrl : '',
        isActive,
        liveStatus: displayType === 'streaming' ? liveStatus : 'offline',
      };

      if (isEdit && mainVisual) {
        // 수정 모드
        console.log('Updating main visual with data:', {
          id: mainVisual.id,
          ...mainVisualData,
          updatedBy: 'sysadmin',
        });
        await updateMainVisual.mutateAsync({
          id: mainVisual.id,
          ...mainVisualData,
          updatedBy: 'sysadmin',
        });
      } else {
        // 생성 모드
        console.log('Creating main visual with data:', {
          ...mainVisualData,
          createdBy: 'sysadmin',
        });
        await createMainVisual.mutateAsync({
          ...mainVisualData,
          createdBy: 'sysadmin',
        });
      }

      // 저장 후 메인 비주얼 페이지로 이동
      router.push('/main-visual');
    } catch (error) {
      console.error('Save error:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // No 계산
  const no =
    isEdit && mainVisual ? mainVisual.id : mainVisuals.length > 0 ? mainVisuals.length + 1 : 1;

  return (
    <div style={{ padding: 24 }}>
      <style>{`
        .btn-anim {
          transition:
            background 0.18s,
            color 0.18s,
            opacity 0.18s,
            transform 0.18s;
        }
        .btn-anim:hover,
        .btn-anim:focus {
          opacity: 0.85;
          transform: scale(1.04);
        }
        .btn-anim:active {
          opacity: 0.7;
          transform: scale(0.98);
        }
        .select-anim {
          transition:
            box-shadow 0.18s,
            border-color 0.18s,
            background 0.18s,
            color 0.18s,
            transform 0.18s;
        }
        .select-anim:focus {
          box-shadow: 0 0 0 2px #3379b7;
          border-color: #3379b7;
          background: #232226;
          color: #3379b7;
          transform: scale(1.03);
        }
        .select-anim:hover {
          background: #232226;
          color: #3379b7;
        }
      `}</style>

      {/* Title & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            flex: 1,
            color: '#585858',
            letterSpacing: -1,
          }}
        >
          {isEdit && mainVisual ? `메인비주얼 수정: ${mainVisual.code}` : '메인비주얼 생성'}
        </h2>
        <button
          className="btn-anim"
          style={{
            background: '#3379B7',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            borderRadius: 4,
            padding: '10px 24px',
            marginRight: 8,
          }}
          onClick={handleSave}
          disabled={loading}
        >
          저장
        </button>
        <button
          className="btn-anim"
          style={{
            background: '#B73333',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            border: 'none',
            borderRadius: 4,
            padding: '10px 24px',
          }}
          onClick={() => router.push('/main-visual')}
          disabled={loading}
        >
          취소
        </button>
      </div>

      {/* Form Table */}
      <table
        style={{
          width: '100%',
          background: '#2C2C2C',
          borderCollapse: 'collapse',
          border: '2px solid #212121',
          borderRadius: 8,
          overflow: 'hidden',
          fontSize: 15,
        }}
      >
        <tbody style={{ background: '#2C2C2C', padding: 8 }}>
          <tr>
            <td
              style={{
                width: 180,
                color: '#5B5B5B',
                fontWeight: 600,
                padding: 8,
                background: '#262626',
                border: '1px solid #1A1A1A',
              }}
            >
              No.
            </td>
            <td
              style={{
                color: '#fff',
                fontWeight: 500,
                padding: 8,
                background: '#262626',
                border: '1px solid #1A1A1A',
              }}
            >
              {no}
            </td>
          </tr>
          <tr>
            <td
              style={{
                color: '#5B5B5B',
                fontWeight: 600,
                padding: 8,
                background: '#262626',
                border: '1px solid #1A1A1A',
              }}
            >
              Code
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="MV-001"
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: '100%',
                  outline: 'none',
                }}
              />
            </td>
          </tr>
          <tr>
            <td
              style={{
                color: '#5B5B5B',
                fontWeight: 600,
                padding: 8,
                background: '#262626',
                border: '1px solid #1A1A1A',
              }}
            >
              카테고리
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <select
                className="select-anim"
                value={categoryId || ''}
                onChange={(e) => {
                  setCategoryId(e.target.value ? Number(e.target.value) : null);
                  setArtistId(null);
                  setSongId(null);
                }}
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: '100%',
                  outline: 'none',
                }}
              >
                <option value="">
                  {loadingCategories
                    ? '카테고리 로딩 중...'
                    : categories.length === 0
                      ? '등록된 카테고리가 없습니다'
                      : '카테고리를 선택하세요'}
                </option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          {!isLiveCategory && (
            <tr>
              <td
                style={{
                  color: '#5B5B5B',
                  fontWeight: 600,
                  padding: 8,
                  background: '#262626',
                  border: '1px solid #1A1A1A',
                }}
              >
                아티스트 명
              </td>
              <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
                <select
                  className="select-anim"
                  value={artistId || ''}
                  onChange={(e) => {
                    setArtistId(e.target.value ? Number(e.target.value) : null);
                    setSongId(null);
                  }}
                  disabled={!categoryId}
                  style={{
                    background: categoryId ? '#1C1C1C' : '#2A2A2A',
                    color: categoryId ? '#545454' : '#666',
                    fontWeight: 500,
                    fontSize: 15,
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    width: '100%',
                    outline: 'none',
                  }}
                >
                  <option value="">
                    {loadingArtists
                      ? '아티스트 로딩 중...'
                      : filteredArtists.length === 0
                        ? categoryId
                          ? '해당 카테고리에 아티스트가 없습니다'
                          : '아티스트를 선택하세요'
                        : '아티스트를 선택하세요'}
                  </option>
                  {filteredArtists.map((artist: any) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          )}
          {!isLiveCategory && (
            <tr>
              <td
                style={{
                  color: '#5B5B5B',
                  fontWeight: 600,
                  padding: 8,
                  background: '#262626',
                  border: '1px solid #1A1A1A',
                }}
              >
                노래 명
              </td>
              <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
                <select
                  className="select-anim"
                  value={songId || ''}
                  onChange={(e) => setSongId(e.target.value ? Number(e.target.value) : null)}
                  disabled={!artistId}
                  style={{
                    background: artistId ? '#1C1C1C' : '#2A2A2A',
                    color: artistId ? '#545454' : '#666',
                    fontWeight: 500,
                    fontSize: 15,
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    width: '100%',
                    outline: 'none',
                  }}
                >
                  <option value="">
                    {loadingSongs
                      ? '노래 로딩 중...'
                      : filteredSongs.length === 0
                        ? artistId
                          ? '해당 아티스트에 노래가 없습니다'
                          : '노래를 선택하세요'
                        : '노래를 선택하세요'}
                  </option>
                  {filteredSongs.map((song: any) => (
                    <option key={song.id} value={song.id}>
                      {song.title}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          )}
          <tr>
            <td
              style={{
                color: '#5B5B5B',
                fontWeight: 600,
                padding: 8,
                background: '#262626',
                border: '1px solid #1A1A1A',
              }}
            >
              표기 유형
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <select
                className="select-anim"
                value={displayType}
                onChange={(e) =>
                  setDisplayType(e.target.value as 'image' | 'youtube' | 'streaming')
                }
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: '100%',
                  outline: 'none',
                }}
              >
                <option value="image">이미지</option>
                <option value="youtube">유튜브</option>
                <option value="streaming">스트리밍</option>
              </select>
            </td>
          </tr>
          {displayType === 'image' && (
            <tr>
              <td
                style={{
                  color: '#5B5B5B',
                  fontWeight: 600,
                  padding: 8,
                  background: '#262626',
                  border: '1px solid #1A1A1A',
                }}
              >
                이미지 URL
              </td>
              <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  style={{
                    background: '#1C1C1C',
                    color: '#545454',
                    fontWeight: 500,
                    fontSize: 15,
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    width: '100%',
                    outline: 'none',
                  }}
                />
              </td>
            </tr>
          )}
          {displayType === 'youtube' && (
            <tr>
              <td
                style={{
                  color: '#5B5B5B',
                  fontWeight: 600,
                  padding: 8,
                  background: '#262626',
                  border: '1px solid #1A1A1A',
                }}
              >
                유튜브 URL
              </td>
              <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{
                    background: '#1C1C1C',
                    color: '#545454',
                    fontWeight: 500,
                    fontSize: 15,
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    width: '100%',
                    outline: 'none',
                  }}
                />
              </td>
            </tr>
          )}
          {displayType === 'streaming' && (
            <>
              <tr>
                <td
                  style={{
                    color: '#5B5B5B',
                    fontWeight: 600,
                    padding: 8,
                    background: '#262626',
                    border: '1px solid #1A1A1A',
                  }}
                >
                  스트리밍 URL
                </td>
                <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
                  <input
                    type="url"
                    value={streamingUrl}
                    onChange={(e) => setStreamingUrl(e.target.value)}
                    placeholder="https://example.com/streaming"
                    style={{
                      background: '#1C1C1C',
                      color: '#545454',
                      fontWeight: 500,
                      fontSize: 15,
                      border: 'none',
                      borderRadius: 4,
                      padding: '8px 16px',
                      width: '100%',
                      outline: 'none',
                    }}
                  />
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    color: '#5B5B5B',
                    fontWeight: 600,
                    padding: 8,
                    background: '#262626',
                    border: '1px solid #1A1A1A',
                  }}
                >
                  라이브 상태
                </td>
                <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span
                      style={{
                        color: liveStatus === 'online' ? '#4CAF50' : '#FF5722',
                        fontWeight: 600,
                        fontSize: 15,
                      }}
                    >
                      {liveStatus === 'online' ? '온라인' : '오프라인'}
                    </span>
                    {crawlingStatus === 'crawling' && (
                      <span style={{ color: '#FFC107', fontSize: 12 }}>크롤링 중...</span>
                    )}
                    {crawlingStatus === 'success' && (
                      <span style={{ color: '#4CAF50', fontSize: 12 }}>✓ 크롤링 완료</span>
                    )}
                    {crawlingStatus === 'error' && (
                      <span style={{ color: '#FF5722', fontSize: 12 }}>✗ 크롤링 실패</span>
                    )}
                  </div>
                </td>
              </tr>
            </>
          )}
          <tr>
            <td
              style={{
                color: '#5B5B5B',
                fontWeight: 600,
                padding: 8,
                background: '#262626',
                border: '1px solid #1A1A1A',
              }}
            >
              상태
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <select
                className="select-anim"
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  outline: 'none',
                }}
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
