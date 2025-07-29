'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import Nulltry from '../../assets/Nulltry.png';
import { trpc } from '../../utils/trpc';

function IconChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <path
        d="M7 10l5 5 5-5"
        stroke="#858585"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconArrowUp() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 15l5-5 5 5"
        stroke="#C7DBEC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconArrowDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M7 9l5 5 5-5"
        stroke="#C7DBEC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type Artist = {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  categoryId: number;
  category: {
    id: number;
    name: string;
  };
  songs: Song[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
};

type Song = {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  youtubeUrl?: string;
  hasImage: boolean;
  hasAttachment: boolean;
  pdfUrl?: string;
  artistId: number;
  artist: {
    id: number;
    name: string;
  };
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  isFeaturedMainVisual: boolean;
};

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 메타태그 설정
  // useEffect 및 setPageMeta, setDefaultMeta 관련 코드 모두 삭제

  // 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({
    categoryId: '',
    status: '',
    creator: '',
  });
  const [modalVisible, setModalVisible] = useState(false);

  // URL 쿼리 파라미터에서 탭 상태 초기화
  const [activeTab, setActiveTab] = useState<'artist' | 'song'>(() => {
    const tabParam = searchParams.get('tab');
    return tabParam === 'song' ? 'song' : 'artist';
  });

  // 순서 관리 모달 상태
  const [orderModal, setOrderModal] = useState(false);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [movingIdx, setMovingIdx] = useState<number | null>(null);
  const [moveDirection, setMoveDirection] = useState<'up' | 'down' | null>(null);

  // tRPC API 호출
  const { data: artists = [], isLoading: artistsLoading } = trpc.artist.list.useQuery({
    isActive: true,
  });
  const { data: songs = [], isLoading: songsLoading } = trpc.song.list.useQuery({ isActive: true });
  const { data: categories = [] } = trpc.category.list.useQuery({});

  // 순서 관리 모달 열기
  const openOrderModal = () => {
    const currentData = activeTab === 'artist' ? filteredArtists : filteredSongs;
    console.log('Opening modal with data:', currentData);
    setOrderList([...currentData]);
    setOrderModal(true);
    setTimeout(() => {
      setModalVisible(true);
      console.log('Modal visible set to true');
    }, 10);
  };

  // 순서 관리 모달 닫기
  const closeOrderModal = () => {
    setModalVisible(false);
    setTimeout(() => setOrderModal(false), 200);
  };

  // 위로 이동
  const moveUp = () => {
    if (selectedIdx === null || selectedIdx === 0) return;
    setMovingIdx(selectedIdx);
    setMoveDirection('up');
    setTimeout(() => {
      const newList = [...orderList];
      [newList[selectedIdx - 1], newList[selectedIdx]] = [
        newList[selectedIdx],
        newList[selectedIdx - 1],
      ];
      setOrderList(newList);
      setSelectedIdx(selectedIdx - 1);
      setMovingIdx(null);
      setMoveDirection(null);
    }, 200);
  };

  // 아래로 이동
  const moveDown = () => {
    if (selectedIdx === null || selectedIdx === orderList.length - 1) return;
    setMovingIdx(selectedIdx);
    setMoveDirection('down');
    setTimeout(() => {
      const newList = [...orderList];
      [newList[selectedIdx + 1], newList[selectedIdx]] = [
        newList[selectedIdx],
        newList[selectedIdx + 1],
      ];
      setOrderList(newList);
      setSelectedIdx(selectedIdx + 1);
      setMovingIdx(null);
      setMoveDirection(null);
    }, 200);
  };

  // 순서 저장
  const saveOrder = async () => {
    // TODO: Implement API call
    console.log('Saving order:', orderList);
    closeOrderModal();
  };

  // 검색 및 필터링된 데이터
  const filteredArtists = React.useMemo(() => {
    return artists.filter((artist) => {
      // 검색어 필터링 (유사어 처리)
      const searchMatch =
        !searchTerm ||
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // 카테고리 필터링
      const categoryMatch =
        !filters.categoryId || artist.categoryId.toString() === filters.categoryId;

      // 상태 필터링
      const statusMatch =
        !filters.status ||
        (filters.status === 'active' && artist.isActive) ||
        (filters.status === 'inactive' && !artist.isActive);

      // 생성자 필터링
      const creatorMatch =
        !filters.creator || artist.createdBy.toLowerCase().includes(filters.creator.toLowerCase());

      return searchMatch && categoryMatch && statusMatch && creatorMatch;
    });
  }, [artists, searchTerm, filters]);

  const filteredSongs = React.useMemo(() => {
    return songs.filter((song) => {
      // 검색어 필터링 (유사어 처리)
      const searchMatch =
        !searchTerm ||
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.name.toLowerCase().includes(searchTerm.toLowerCase());

      // 카테고리 필터링 (아티스트의 카테고리)
      const categoryMatch =
        !filters.categoryId || song.artist.categoryId.toString() === filters.categoryId;

      // 상태 필터링
      const statusMatch =
        !filters.status ||
        (filters.status === 'active' && song.isActive) ||
        (filters.status === 'inactive' && !song.isActive);

      // 생성자 필터링
      const creatorMatch =
        !filters.creator || song.createdBy.toLowerCase().includes(filters.creator.toLowerCase());

      return searchMatch && categoryMatch && statusMatch && creatorMatch;
    });
  }, [songs, searchTerm, filters]);

  // Keyboard ESC close
  React.useEffect(() => {
    if (!orderModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeOrderModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [orderModal]);

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: 'transparent',
      }}
    >
      {/* 제목과 버튼 영역 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            flex: '1 1 0%',
            color: 'rgb(88, 88, 88)',
          }}
        >
          {activeTab === 'artist' ? '아티스트 등록/수정/관리' : '노래 등록/수정/관리'}
        </h2>
        <button
          className="btn-anim"
          style={{
            background: 'rgb(47, 47, 47)',
            color: 'rgb(133, 133, 133)',
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            borderRadius: 4,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
          }}
          onClick={openOrderModal}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
            <rect x="4" y="7" width="16" height="2" rx="1" fill="#858585"></rect>
            <rect x="4" y="11" width="16" height="2" rx="1" fill="#858585"></rect>
            <rect x="4" y="15" width="16" height="2" rx="1" fill="#858585"></rect>
          </svg>
          <span style={{ marginLeft: 8 }}>
            {activeTab === 'artist' ? '아티스트 순서 관리' : '노래 순서 관리'}
          </span>
        </button>
        <button
          className="btn-anim"
          style={{
            background: 'rgb(47, 47, 47)',
            color: 'rgb(133, 133, 133)',
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            borderRadius: 4,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 12,
          }}
          onClick={() =>
            router.push(activeTab === 'artist' ? '/posts/artist/create' : '/posts/song/create')
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
            <rect x="11" y="4" width="2" height="16" rx="1" fill="#858585"></rect>
            <rect x="4" y="11" width="16" height="2" rx="1" fill="#858585"></rect>
          </svg>
          <span style={{ marginLeft: 8 }}>
            {activeTab === 'artist' ? '아티스트 생성' : '노래 생성'}
          </span>
        </button>
      </div>

      {/* 순서 관리 모달 */}
      {orderModal && (
        <div className={`modal-bg${modalVisible ? ' visible' : ''}`} onClick={closeOrderModal}>
          <div
            className={`modal-card${modalVisible ? ' visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-title">
              {activeTab === 'artist' ? '아티스트 순서 관리' : '노래 순서 관리'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', minHeight: 320 }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: orderList.length === 0 ? 'center' : 'flex-start',
                  alignItems: 'center',
                  minHeight: 320,
                }}
              >
                {orderList.length === 0 ? (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                      }}
                    >
                      <Image
                        src={Nulltry}
                        width={134}
                        height={202}
                        alt={`등록된 ${activeTab === 'artist' ? '아티스트' : '노래'}가 없습니다.`}
                        style={{ maxWidth: 134, maxHeight: 202 }}
                      />
                      <div
                        style={{
                          color: '#888',
                          fontWeight: 600,
                          fontSize: 16,
                          marginTop: 16,
                          textAlign: 'center',
                        }}
                      >
                        등록된 {activeTab === 'artist' ? '아티스트' : '노래'}가 없습니다.
                      </div>
                    </div>
                  </>
                ) : (
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th style={{ width: 54 }}>No.</th>
                        <th style={{ width: 610 }}>
                          {activeTab === 'artist' ? '아티스트 이름' : '노래 제목'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.length === 0 ? (
                        <tr>
                          <td
                            colSpan={2}
                            style={{ padding: 0, background: 'transparent', height: 220 }}
                          >
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 220,
                              }}
                            >
                              <Image
                                src={Nulltry}
                                width={134}
                                height={202}
                                alt={`등록된 ${activeTab === 'artist' ? '아티스트' : '노래'}가 없습니다.`}
                                style={{ maxWidth: 134, maxHeight: 202 }}
                              />
                              <div
                                style={{
                                  color: '#888',
                                  fontWeight: 600,
                                  fontSize: 16,
                                  marginTop: 16,
                                  textAlign: 'center',
                                }}
                              >
                                등록된 {activeTab === 'artist' ? '아티스트' : '노래'}가 없습니다.
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orderList.map((item, idx) => (
                          <tr
                            key={idx}
                            className={
                              (selectedIdx === idx ? 'selected ' : '') +
                              (movingIdx === idx && moveDirection === 'up' ? 'slide-up ' : '') +
                              (movingIdx === idx && moveDirection === 'down' ? 'slide-down ' : '')
                            }
                            onClick={() => setSelectedIdx(idx)}
                          >
                            <td>{idx + 1}</td>
                            <td>
                              {activeTab === 'artist'
                                ? (item as Artist).name
                                : (item as Song).title}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="modal-actions" style={{ marginLeft: 8 }}>
                <button
                  className="up"
                  onClick={moveUp}
                  disabled={selectedIdx === null || selectedIdx === 0 || orderList.length === 0}
                >
                  <IconArrowUp />
                </button>
                <button
                  className="down"
                  onClick={moveDown}
                  disabled={
                    selectedIdx === null ||
                    selectedIdx === orderList.length - 1 ||
                    orderList.length === 0
                  }
                >
                  <IconArrowDown />
                </button>
                <button className="save" onClick={saveOrder} disabled={orderList.length === 0}>
                  저장
                </button>
                <button className="cancel" onClick={closeOrderModal}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab UI */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          className={activeTab === 'artist' ? 'tab-active' : 'tab-inactive'}
          style={{
            background: activeTab === 'artist' ? '#23232b' : '#18181b',
            color: activeTab === 'artist' ? '#fff' : '#858585',
            border: 'none',
            borderRadius: 8,
            padding: '10px 32px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'background 0.18s, color 0.18s',
          }}
          onClick={() => {
            setActiveTab('artist');
            router.push('/posts?tab=artist');
          }}
        >
          아티스트
        </button>
        <button
          className={activeTab === 'song' ? 'tab-active' : 'tab-inactive'}
          style={{
            background: activeTab === 'song' ? '#23232b' : '#18181b',
            color: activeTab === 'song' ? '#fff' : '#858585',
            border: 'none',
            borderRadius: 8,
            padding: '10px 32px',
            fontWeight: 700,
            fontSize: 16,
            cursor: 'pointer',
            transition: 'background 0.18s, color 0.18s',
          }}
          onClick={() => {
            setActiveTab('song');
            router.push('/posts?tab=song');
          }}
        >
          노래
        </button>
      </div>

      {/* 검색바/필터/테이블 영역 */}
      {activeTab === 'artist' ? (
        // 아티스트 검색/필터/테이블
        <>
          {/* 검색바/필터 */}
          <div style={{ background: '#262626', padding: '12px 24px', position: 'relative' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'flex-start',
              }}
            >
              <input
                className="artist-search-input"
                placeholder="아티스트명, 설명을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  fontSize: 12,
                  padding: '0 16px',
                  width: 260,
                  outline: 'none',
                }}
              />
              <button
                className="btn-anim"
                style={{
                  background: '#2F2F2F',
                  color: '#858585',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  padding: '0 24px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  cursor: 'pointer',
                  width: 82,
                  justifyContent: 'center',
                }}
                onClick={() => setSearchTerm('')}
              >
                검색
              </button>
              <button
                className="btn-anim"
                style={{
                  background: filterOpen || filterActive ? '#3379B7' : '#2F2F2F',
                  color: filterOpen || filterActive ? '#C7DBEC' : '#858585',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  padding: '0 24px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  gap: 8,
                  cursor: 'pointer',
                  width: 82,
                  justifyContent: 'center',
                  minWidth: 82,
                }}
                onClick={() => setFilterOpen((v) => !v)}
              >
                <span className="nowrap">필터</span>
              </button>
              <div style={{ flex: 1 }} />
              {filterOpen && (
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <button
                    className={
                      filterOpen ? 'btn-anim fade-anim' : 'btn-anim fade-anim fade-anim-hide'
                    }
                    style={{
                      width: 82,
                      height: 40,
                      background: '#B73333',
                      color: '#C7DBEC',
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setFilterOpen(false);
                      setFilterActive(false);
                    }}
                  >
                    취소
                  </button>
                  <button
                    className={
                      filterOpen ? 'btn-anim fade-anim' : 'btn-anim fade-anim fade-anim-hide'
                    }
                    style={{
                      width: 82,
                      height: 40,
                      background: '#3379B7',
                      color: '#C7DBEC',
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 500,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setFilterOpen(false);
                      setFilterActive(true);
                    }}
                  >
                    저장
                  </button>
                </div>
              )}
            </div>

            {/* 필터 드롭다운 */}
            {filterOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'rgb(44, 44, 44)',
                  border: '1px solid rgb(26, 26, 26)',
                  borderRadius: 4,
                  padding: '16px',
                  marginTop: 8,
                  zIndex: 1000,
                }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                  <label
                    style={{
                      color: 'rgb(91, 91, 91)',
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 60,
                    }}
                  >
                    카테고리:
                  </label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, categoryId: e.target.value }))
                    }
                    style={{
                      background: 'rgb(28, 28, 28)',
                      color: 'rgb(84, 84, 84)',
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      fontSize: 12,
                      padding: '0px 8px',
                      outline: 'none',
                      minWidth: 120,
                    }}
                  >
                    <option value="">전체</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                  <label
                    style={{
                      color: 'rgb(91, 91, 91)',
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 60,
                    }}
                  >
                    상태:
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                    style={{
                      background: 'rgb(28, 28, 28)',
                      color: 'rgb(84, 84, 84)',
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      fontSize: 12,
                      padding: '0px 8px',
                      outline: 'none',
                      minWidth: 120,
                    }}
                  >
                    <option value="">전체</option>
                    <option value="active">활성화</option>
                    <option value="inactive">비활성화</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <label
                    style={{
                      color: 'rgb(91, 91, 91)',
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 60,
                    }}
                  >
                    생성자:
                  </label>
                  <input
                    type="text"
                    placeholder="생성자명 입력"
                    value={filters.creator}
                    onChange={(e) => setFilters((prev) => ({ ...prev, creator: e.target.value }))}
                    style={{
                      background: 'rgb(28, 28, 28)',
                      color: 'rgb(84, 84, 84)',
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      fontSize: 12,
                      padding: '0px 8px',
                      outline: 'none',
                      minWidth: 120,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    className="btn-anim"
                    style={{
                      background: 'rgb(51, 121, 183)',
                      color: '#fff',
                      fontSize: 12,
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      padding: '0px 16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setFilterActive(true)}
                  >
                    적용
                  </button>
                  <button
                    className="btn-anim"
                    style={{
                      background: 'rgb(183, 51, 51)',
                      color: '#fff',
                      fontSize: 12,
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      padding: '0px 16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setFilters({ categoryId: '', status: '', creator: '' });
                      setFilterActive(false);
                    }}
                  >
                    초기화
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* 아티스트 테이블 */}
          <div
            style={{
              background: 'rgb(44, 44, 44)',
              padding: '12px 24px',
              borderRadius: 4,
              marginTop: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                background: 'rgb(38, 38, 38)',
                color: 'rgb(91, 91, 91)',
                fontWeight: 600,
                border: '1px solid rgb(26, 26, 26)',
                borderRadius: 4,
                overflow: 'hidden',
                fontSize: 15,
              }}
            >
              <div
                style={{
                  flex: '0 0 60px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                No.
              </div>
              <div
                style={{
                  flex: '0 0 90px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                상태
              </div>
              <div
                style={{
                  flex: '1 1 0%',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                아티스트명
              </div>
              <div
                style={{
                  flex: '0 0 120px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                카테고리
              </div>
              <div
                style={{
                  flex: '0 0 120px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                곡 수
              </div>
              <div
                style={{
                  flex: '0 0 160px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                최초 생성 일자/자
              </div>
              <div
                style={{
                  flex: '0 0 160px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                마지막 수정 일자/자
              </div>
              <div
                style={{
                  flex: '0 0 90px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                기능
              </div>
            </div>
            {artistsLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#858585' }}>
                로딩 중...
              </div>
            ) : filteredArtists.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#858585' }}>
                <Image
                  src={Nulltry}
                  alt="No data"
                  width={257}
                  height={387}
                  style={{ marginBottom: 16 }}
                />
                <div>
                  {searchTerm || filterActive
                    ? '검색 결과가 없습니다'
                    : '등록된 아티스트가 없습니다'}
                </div>
              </div>
            ) : (
              filteredArtists.map((artist, idx) => (
                <div
                  key={artist.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 15,
                    background: 'rgb(38, 38, 38)',
                    color: 'rgb(91, 91, 91)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      flex: '0 0 60px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div
                    style={{
                      flex: '0 0 90px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      padding: '8px 0px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        minWidth: 56,
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        padding: '4px 8px',
                        background: artist.isActive ? '#3379B7' : '#666',
                        color: '#fff',
                      }}
                    >
                      {artist.isActive ? '활성화' : '비활성화'}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: '1 1 0%',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {artist.name}
                  </div>
                  <div
                    style={{
                      flex: '0 0 120px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {artist.categoryId || '-'}
                  </div>
                  <div
                    style={{
                      flex: '0 0 120px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {artist.songs?.length || 0}
                  </div>
                  <div
                    style={{
                      flex: '0 0 160px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {new Date(artist.createdAt).toLocaleDateString('ko-KR')} / {artist.createdBy}
                  </div>
                  <div
                    style={{
                      flex: '0 0 160px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {new Date(artist.updatedAt).toLocaleDateString('ko-KR')} / {artist.updatedBy}
                  </div>
                  <div
                    style={{
                      flex: '0 0 90px',
                      textAlign: 'center',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <button
                      className="icon-btn"
                      title="수정"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={() =>
                        router.push(
                          `/posts/artist/create?edit=1&id=${artist.id}&name=${encodeURIComponent(artist.name)}`,
                        )
                      }
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ display: 'block' }}
                      >
                        <path
                          d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z"
                          stroke="#5B5B5B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M14.85 7.15a1.5 1.5 0 0 0 0-2.12l-1.88-1.88a1.5 1.5 0 0 0-2.12 0l-1.06 1.06 4 4 1.06-1.06z"
                          stroke="#5B5B5B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <button
                      className="icon-btn"
                      title="삭제"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ display: 'block' }}
                      >
                        <rect
                          x="5"
                          y="8"
                          width="10"
                          height="7"
                          rx="2"
                          stroke="#B73333"
                          strokeWidth="1.5"
                        ></rect>
                        <path
                          d="M8 8V6a2 2 0 0 1 4 0v2"
                          stroke="#B73333"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M3 8h14"
                          stroke="#B73333"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        // 노래 검색/필터/테이블
        <>
          {/* 검색바/필터 */}
          <div
            style={{
              background: 'rgb(38, 38, 38)',
              padding: '12px 24px',
              position: 'relative',
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'flex-start',
              }}
            >
              <input
                className="post-search-input"
                placeholder="노래 제목, 설명, 아티스트명을 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'rgb(28, 28, 28)',
                  color: 'rgb(84, 84, 84)',
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  fontSize: 12,
                  padding: '0px 16px',
                  width: 260,
                  outline: 'none',
                }}
              />
              <button
                className="btn-anim"
                style={{
                  background: 'rgb(47, 47, 47)',
                  color: 'rgb(133, 133, 133)',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  padding: '0px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  cursor: 'pointer',
                  width: 82,
                  justifyContent: 'center',
                }}
                onClick={() => setSearchTerm('')}
              >
                초기화
              </button>
              <button
                className="btn-anim"
                style={{
                  background: filterActive ? 'rgb(51, 121, 183)' : 'rgb(47, 47, 47)',
                  color: filterActive ? '#fff' : 'rgb(133, 133, 133)',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  padding: '0px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 500,
                  gap: 8,
                  cursor: 'pointer',
                  width: 82,
                  justifyContent: 'center',
                  minWidth: 82,
                }}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <span className="nowrap">필터</span>
                <IconChevronDown />
              </button>
              <div style={{ flex: '1 1 0%' }}></div>
            </div>

            {/* 필터 드롭다운 */}
            {filterOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: 'rgb(44, 44, 44)',
                  border: '1px solid rgb(26, 26, 26)',
                  borderRadius: 4,
                  padding: '16px',
                  marginTop: 8,
                  zIndex: 1000,
                }}
              >
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                  <label
                    style={{
                      color: 'rgb(91, 91, 91)',
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 60,
                    }}
                  >
                    카테고리:
                  </label>
                  <select
                    value={filters.categoryId}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, categoryId: e.target.value }))
                    }
                    style={{
                      background: 'rgb(28, 28, 28)',
                      color: 'rgb(84, 84, 84)',
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      fontSize: 12,
                      padding: '0px 8px',
                      outline: 'none',
                      minWidth: 120,
                    }}
                  >
                    <option value="">전체</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id.toString()}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
                  <label
                    style={{
                      color: 'rgb(91, 91, 91)',
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 60,
                    }}
                  >
                    상태:
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                    style={{
                      background: 'rgb(28, 28, 28)',
                      color: 'rgb(84, 84, 84)',
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      fontSize: 12,
                      padding: '0px 8px',
                      outline: 'none',
                      minWidth: 120,
                    }}
                  >
                    <option value="">전체</option>
                    <option value="active">활성화</option>
                    <option value="inactive">비활성화</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <label
                    style={{
                      color: 'rgb(91, 91, 91)',
                      fontSize: 12,
                      fontWeight: 600,
                      minWidth: 60,
                    }}
                  >
                    생성자:
                  </label>
                  <input
                    type="text"
                    placeholder="생성자명 입력"
                    value={filters.creator}
                    onChange={(e) => setFilters((prev) => ({ ...prev, creator: e.target.value }))}
                    style={{
                      background: 'rgb(28, 28, 28)',
                      color: 'rgb(84, 84, 84)',
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      fontSize: 12,
                      padding: '0px 8px',
                      outline: 'none',
                      minWidth: 120,
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button
                    className="btn-anim"
                    style={{
                      background: 'rgb(51, 121, 183)',
                      color: '#fff',
                      fontSize: 12,
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      padding: '0px 16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => setFilterActive(true)}
                  >
                    적용
                  </button>
                  <button
                    className="btn-anim"
                    style={{
                      background: 'rgb(183, 51, 51)',
                      color: '#fff',
                      fontSize: 12,
                      border: 'none',
                      borderRadius: 4,
                      height: 32,
                      padding: '0px 16px',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setFilters({ categoryId: '', status: '', creator: '' });
                      setFilterActive(false);
                    }}
                  >
                    초기화
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* 노래 테이블 */}
          <div
            style={{
              background: 'rgb(44, 44, 44)',
              padding: '12px 24px',
              borderRadius: 4,
              marginTop: 24,
            }}
          >
            <div
              style={{
                display: 'flex',
                background: 'rgb(38, 38, 38)',
                color: 'rgb(91, 91, 91)',
                fontWeight: 600,
                border: '1px solid rgb(26, 26, 26)',
                borderRadius: 4,
                overflow: 'hidden',
                fontSize: 15,
              }}
            >
              <div
                style={{
                  flex: '0 0 60px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                No.
              </div>
              <div
                style={{
                  flex: '0 0 90px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                상태
              </div>
              <div
                style={{
                  flex: '1 1 0%',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                노래 제목
              </div>
              <div
                style={{
                  flex: '0 0 120px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                아티스트
              </div>
              <div
                style={{
                  flex: '0 0 160px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                최초 생성 일자/자
              </div>
              <div
                style={{
                  flex: '0 0 160px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  borderRight: '1px solid rgb(26, 26, 26)',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                마지막 수정 일자/자
              </div>
              <div
                style={{
                  flex: '0 0 90px',
                  padding: '12px 0px',
                  textAlign: 'center',
                  background: 'rgb(38, 38, 38)',
                }}
              >
                기능
              </div>
            </div>
            {songsLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#858585' }}>
                로딩 중...
              </div>
            ) : filteredSongs.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#858585' }}>
                <Image
                  src={Nulltry}
                  alt="No data"
                  width={257}
                  height={387}
                  style={{ marginBottom: 16 }}
                />
                <div>
                  {searchTerm || filterActive ? '검색 결과가 없습니다' : '등록된 노래가 없습니다'}
                </div>
              </div>
            ) : (
              filteredSongs.map((song, idx) => (
                <div
                  key={song.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 15,
                    background: 'rgb(38, 38, 38)',
                    color: 'rgb(91, 91, 91)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      flex: '0 0 60px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div
                    style={{
                      flex: '0 0 90px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      padding: '8px 0px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        minWidth: 56,
                        borderRadius: 12,
                        fontWeight: 700,
                        fontSize: 14,
                        padding: '4px 8px',
                        background: song.isActive ? '#3379B7' : '#666',
                        color: '#fff',
                      }}
                    >
                      {song.isActive ? '활성화' : '비활성화'}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: '1 1 0%',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {song.title}
                  </div>
                  <div
                    style={{
                      flex: '0 0 120px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {song.artist?.name || '-'}
                  </div>
                  <div
                    style={{
                      flex: '0 0 160px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {new Date(song.createdAt).toLocaleDateString('ko-KR')} / {song.createdBy}
                  </div>
                  <div
                    style={{
                      flex: '0 0 160px',
                      textAlign: 'center',
                      borderRight: '1px solid rgb(26, 26, 26)',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                    }}
                  >
                    {new Date(song.updatedAt).toLocaleDateString('ko-KR')} / {song.updatedBy}
                  </div>
                  <div
                    style={{
                      flex: '0 0 90px',
                      textAlign: 'center',
                      background: 'rgb(38, 38, 38)',
                      color: 'rgb(91, 91, 91)',
                      padding: '8px 0px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <button
                      className="icon-btn"
                      title="수정"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      onClick={() =>
                        router.push(
                          `/posts/song/create?edit=1&id=${song.id}&title=${encodeURIComponent(song.title)}`,
                        )
                      }
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ display: 'block' }}
                      >
                        <path
                          d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z"
                          stroke="#5B5B5B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M14.85 7.15a1.5 1.5 0 0 0 0-2.12l-1.88-1.88a1.5 1.5 0 0 0-2.12 0l-1.06 1.06 4 4 1.06-1.06z"
                          stroke="#5B5B5B"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </button>
                    <button
                      className="icon-btn"
                      title="삭제"
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        style={{ display: 'block' }}
                      >
                        <rect
                          x="5"
                          y="8"
                          width="10"
                          height="7"
                          rx="2"
                          stroke="#B73333"
                          strokeWidth="1.5"
                        ></rect>
                        <path
                          d="M8 8V6a2 2 0 0 1 4 0v2"
                          stroke="#B73333"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                        <path
                          d="M3 8h14"
                          stroke="#B73333"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* 이하 기존 모달/기능 등 유지 */}
      {/* ... */}

      <style>{`
        .modal-bg {
          position: fixed;
          left: 0;
          top: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s;
        }
        .modal-bg.visible {
          opacity: 1;
          pointer-events: auto;
        }
        .modal-card {
          background: #2c2c2c;
          border-radius: 8px;
          box-shadow: 0 8px 32px #000a;
          padding: 24px;
          min-width: 738px;
          min-height: 320px;
          opacity: 0;
          transform: translateY(40px) scale(0.98);
          transition:
            opacity 0.25s,
            transform 0.25s;
        }
        .modal-card.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .modal-title {
          color: #5b5b5b;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 14px;
        }
        .modal-table {
          width: 100%;
          border-collapse: collapse;
          background: #262626;
        }
        .modal-table th,
        .modal-table td {
          border: 1px solid #1a1a1a;
          padding: 0 16px;
          height: 48px;
          text-align: left;
          font-size: 15px;
        }
        .modal-table th {
          color: #5b5b5b;
          font-weight: 600;
          background: #262626;
        }
        .modal-table td {
          color: #5b5b5b;
          background: #262626;
        }
        .modal-table tr.selected td,
        .modal-table tr:hover td {
          background: #484848 !important;
          color: #d5d5d5 !important;
          font-weight: 700;
        }
        .modal-table tr {
          transition: background 0.18s;
          cursor: pointer;
        }
        .modal-table tr:not(.selected):hover td {
          background: #484848;
          color: #d5d5d5;
        }
        .modal-table th:first-child,
        .modal-table td:first-child {
          width: 54px;
          min-width: 54px;
          max-width: 54px;
          text-align: center;
        }
        .modal-table th:last-child,
        .modal-table td:last-child {
          width: 610px;
          min-width: 610px;
          max-width: 610px;
        }
        .modal-actions {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 10px;
          margin-left: 16px;
        }
        .modal-actions button {
          width: 70px;
          height: 40px;
          border-radius: 6px;
          border: none;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background 0.18s,
            color 0.18s,
            opacity 0.18s,
            transform 0.18s;
        }
        .modal-actions .up,
        .modal-actions .down {
          background: #262626;
          color: #c7dbec;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-actions .save {
          background: #3379b7;
          color: #c7dbec;
          margin-top: 12px;
        }
        .modal-actions .cancel {
          background: #b73333;
          color: #c7dbec;
        }
        .modal-actions button:hover,
        .modal-actions button:focus {
          opacity: 0.85;
          transform: scale(1.04);
        }
        .modal-actions button:active {
          opacity: 0.7;
          transform: scale(0.98);
        }
        @keyframes slideUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-48px);
          }
        }
        @keyframes slideDown {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(48px);
          }
        }
        .slide-up {
          animation: slideUp 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-down {
          animation: slideDown 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .icon-btn svg {
          transition:
            stroke 0.18s,
            opacity 0.18s,
            transform 0.18s;
        }
        .icon-btn:hover svg,
        .icon-btn:focus svg {
          opacity: 0.85;
          transform: scale(1.08);
        }
        .icon-btn:active svg {
          opacity: 0.7;
          transform: scale(0.96);
        }
        .icon-btn[title='수정']:hover svg path {
          stroke: #3379b7;
        }
        .icon-btn[title='삭제']:hover svg,
        .icon-btn[title='삭제']:focus svg {
          filter: drop-shadow(0 0 2px #b73333);
        }
      `}</style>
    </div>
  );
}
