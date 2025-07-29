'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { trpc } from '../../../utils/trpc';

export default function CategoryCreatePageWrapper() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', padding: 32 }}>로딩 중...</div>}>
      <CategoryCreatePage />
    </Suspense>
  );
}

function CategoryCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEdit = searchParams?.get('edit') === '1';
  const editId = searchParams?.get('id');
  const editName = searchParams?.get('name') || '';

  const {
    data: category,
    isLoading: loadingCategory,
    error: errorCategory,
  } = trpc.category.get.useQuery(isEdit && editId ? { id: Number(editId) } : { id: -1 }, {
    enabled: isEdit && !!editId,
  });

  const { data: categories = [] } = trpc.category.list.useQuery();

  const [name, setName] = React.useState(editName);
  const [status, setStatus] = React.useState('active');
  const [loading, setLoading] = React.useState(false);
  const createCategory = trpc.category.create.useMutation();
  const updateCategory = trpc.category.update.useMutation();

  React.useEffect(() => {
    if (isEdit && category) {
      setName(category.name || '');
      setStatus(category.status || 'active');
    }
  }, [isEdit, category]);

  const no =
    isEdit && category
      ? category.order
      : categories.length > 0
        ? (categories[categories.length - 1].order ?? categories.length) + 1
        : 1;
  const code = isEdit && category ? category.code : `CT-${String(no).padStart(3, '0')}`;
  const songCount =
    isEdit && category
      ? (category.artists?.reduce(
          (sum: any, artist: any) => sum + ((artist as any).songs?.length || 0),
          0,
        ) ?? '-')
      : '-';
  const createdAt = isEdit && category ? category.createdAt : undefined;
  const createdBy = isEdit && category ? category.createdBy : undefined;
  const updatedAt = isEdit && category ? category.updatedAt : undefined;
  const updatedBy = isEdit && category ? category.updatedBy : undefined;

  const now = new Date();
  const nowStr = now.toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleSave = async () => {
    if (!name.trim()) return alert('카테고리 명칭을 입력하세요.');
    setLoading(true);
    try {
      if (isEdit && category) {
        console.log('Updating category with data:', {
          id: category.id,
          name,
          status,
          updatedBy: 'sysadmin',
          isActive: status === 'active',
        });
        await updateCategory.mutateAsync({
          id: category.id,
          name,
          updatedBy: 'sysadmin',
          isActive: status === 'active',
        });
      } else {
        console.log('Creating category with data:', {
          name,
          createdBy: 'sysadmin',
          isActive: status === 'active',
        });
        await createCategory.mutateAsync({
          name,
          createdBy: 'sysadmin',
          isActive: status === 'active',
        });
      }
      router.push('/categories');
    } catch (e) {
      console.error('Category save error:', e);
      alert(isEdit ? '카테고리 수정에 실패했습니다.' : '카테고리 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (isEdit && loadingCategory)
    return <div style={{ color: '#fff', padding: 32 }}>로딩 중...</div>;
  if (isEdit && errorCategory)
    return <div style={{ color: '#fff', padding: 32 }}>카테고리 정보를 불러올 수 없습니다.</div>;

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
          {isEdit && category ? `카테고리 수정: ${category.name}` : '카테고리 생성'}
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
          onClick={() => router.back()}
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
              Code
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
              {code}
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
                value={status}
                onChange={(e) => setStatus(e.target.value)}
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
              카테고리 이름
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
                placeholder="카테고리 명칭을 입력하세요."
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
              카테고리 적용 수
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
