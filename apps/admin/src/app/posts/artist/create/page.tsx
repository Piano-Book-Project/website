'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { trpc } from '../../../../utils/trpc';

export default function ArtistCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get('edit') === '1';
  const editId = searchParams?.get('id');
  const editName = searchParams?.get('name') || '';

  // 아티스트 상세 fetch (수정 모드)
  const {
    data: artist,
    isLoading: loadingArtist,
    error: errorArtist,
  } = trpc.artist.get.useQuery(isEdit && editId ? { id: Number(editId) } : { id: -1 }, {
    enabled: isEdit && !!editId,
  });

  // 카테고리 리스트 fetch (카테고리 선택용)
  const { data: categories = [] } = trpc.category.list.useQuery();

  // 아티스트 리스트 fetch (No 계산용)
  const { data: artists = [] } = trpc.artist.list.useQuery();

  // 입력값 상태
  const [name, setName] = React.useState(editName);
  const [description, setDescription] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const [categoryId, setCategoryId] = React.useState<number | null>(null);
  const [isActive, setIsActive] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const createArtist = trpc.artist.create.useMutation();
  const updateArtist = trpc.artist.update.useMutation();

  // 최초/마지막 생성자/일자, 곡수 등 동기화
  React.useEffect(() => {
    if (isEdit && artist) {
      setName(artist.name || '');
      setDescription(artist.description || '');
      setImageUrl(artist.imageUrl || '');
      setCategoryId(artist.categoryId || null);
      setIsActive(artist.isActive ?? true);
    }
  }, [isEdit, artist]);

  // No, 곡수 등 계산
  const no = isEdit && artist ? artist.id : artists.length > 0 ? artists.length + 1 : 1;
  const songCount = isEdit && artist ? artist.songs?.length || 0 : 0;
  const createdAt = isEdit && artist ? artist.createdAt : undefined;
  const createdBy = isEdit && artist ? artist.createdBy : undefined;
  const updatedAt = isEdit && artist ? artist.updatedAt : undefined;
  const updatedBy = isEdit && artist ? artist.updatedBy : undefined;

  const now = new Date();
  const nowStr = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSave = async () => {
    if (!name.trim()) return alert('아티스트 명칭을 입력하세요.');
    if (!categoryId) return alert('카테고리를 선택하세요.');
    setLoading(true);
    try {
      if (isEdit && artist) {
        // 수정 모드
        console.log('Updating artist with data:', {
          id: artist.id,
          name,
          description,
          imageUrl,
          categoryId,
          updatedBy: 'sysadmin',
          isActive,
        });
        await updateArtist.mutateAsync({
          id: artist.id,
          name,
          description,
          imageUrl,
          categoryId,
          updatedBy: 'sysadmin',
          isActive,
        });
      } else {
        // 생성 모드
        console.log('Creating artist with data:', {
          name,
          description,
          imageUrl,
          categoryId,
          createdBy: 'sysadmin',
          isActive,
        });
        await createArtist.mutateAsync({
          name,
          description,
          imageUrl,
          categoryId,
          createdBy: 'sysadmin',
          isActive,
        });
      }
      router.push('/posts?tab=artist');
    } catch (e) {
      console.error('Artist save error:', e);
      alert(isEdit ? '아티스트 수정에 실패했습니다.' : '아티스트 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && loadingArtist) return <div style={{ color: '#fff', padding: 32 }}>로딩 중...</div>;
  if (isEdit && errorArtist)
    return <div style={{ color: '#fff', padding: 32 }}>아티스트 정보를 불러올 수 없습니다.</div>;

  return (
    <div style={{ padding: 24, background: '#181818', minHeight: '100vh' }}>
      <style>{`
        .btn-anim {
          transition: background 0.18s, color 0.18s, opacity 0.18s, transform 0.18s;
        }
        .btn-anim:hover, .btn-anim:focus {
          opacity: 0.85;
          transform: scale(1.04);
        }
        .btn-anim:active {
          opacity: 0.7;
          transform: scale(0.98);
        }
      `}</style>
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
          {isEdit && artist ? `아티스트 수정: ${artist.name}` : '아티스트 생성'}
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
          onClick={() => router.push('/posts?tab=artist')}
          disabled={loading}
        >
          취소
        </button>
      </div>
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
              상태
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <select
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: 180,
                }}
                value={isActive ? 'active' : 'inactive'}
                onChange={(e) => setIsActive(e.target.value === 'active')}
              >
                <option value="active">활성화</option>
                <option value="inactive">비활성화</option>
              </select>
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
              아티스트 이름
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <input
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: 240,
                }}
                placeholder="아티스트 명칭을 입력하세요."
                value={name}
                onChange={(e) => setName(e.target.value)}
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
              설명
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <textarea
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: 240,
                  height: 80,
                  resize: 'vertical',
                }}
                placeholder="아티스트에 대한 설명을 입력하세요."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              썸네일 이미지 URL
            </td>
            <td style={{ padding: 8, background: '#262626', border: '1px solid #1A1A1A' }}>
              <input
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: 240,
                }}
                placeholder="썸네일 이미지 URL을 입력하세요."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
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
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontWeight: 500,
                  fontSize: 15,
                  border: 'none',
                  borderRadius: 4,
                  padding: '8px 16px',
                  width: 240,
                }}
                value={categoryId || ''}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">카테고리를 선택하세요</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
              곡 수
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
              {songCount}
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
              최초 생성 일자
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
              {createdAt
                ? new Date(createdAt).toLocaleString('ko-KR', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : nowStr}
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
              최초 생성자
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
              {createdBy || '백살이'}
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
              마지막 수정 일자
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
              {updatedAt
                ? new Date(updatedAt).toLocaleString('ko-KR', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : nowStr}
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
              마지막 수정자
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
              {updatedBy || '백살이'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
