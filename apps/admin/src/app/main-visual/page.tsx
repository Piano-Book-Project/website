'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Nulltry from '../../assets/Nulltry.png';
import { trpc } from '../../utils/trpc';

function IconSort() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <rect x="4" y="7" width="16" height="2" rx="1" fill="#858585" />
      <rect x="4" y="11" width="16" height="2" rx="1" fill="#858585" />
      <rect x="4" y="15" width="16" height="2" rx="1" fill="#858585" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ display: 'block' }}>
      <rect x="11" y="4" width="2" height="16" rx="1" fill="#858585" />
      <rect x="4" y="11" width="16" height="2" rx="1" fill="#858585" />
    </svg>
  );
}
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
// SVG 아이콘 컴포넌트 추가
function IconEdit() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block' }}>
      <path
        d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z"
        stroke="#5B5B5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.85 7.15a1.5 1.5 0 0 0 0-2.12l-1.88-1.88a1.5 1.5 0 0 0-2.12 0l-1.06 1.06 4 4 1.06-1.06z"
        stroke="#5B5B5B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconDelete() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: 'block' }}>
      <rect x="5" y="8" width="10" height="7" rx="2" stroke="#B73333" strokeWidth="1.5" />
      <path d="M8 8V6a2 2 0 0 1 4 0v2" stroke="#B73333" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3 8h14" stroke="#B73333" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

type MainVisual = {
  id: number;
  code: string;
  category: string;
  artistName: string;
  songName: string;
  displayType: 'image' | 'youtube' | 'streaming';
  imageUrl?: string;
  youtubeUrl?: string;
  isLive: boolean;
  liveStatus: 'online' | 'offline';
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
};

export default function MainVisualPage() {
  const router = useRouter();
  const [orderModal, setOrderModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [orderList, setOrderList] = useState<MainVisual[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    displayType: '',
    liveStatus: '',
    creator: '',
  });

  // 실제 DB 데이터 fetch
  const {
    data: mainVisuals = [],
    refetch: refetchMainVisuals,
    isLoading: loadingMainVisuals,
  } = trpc.mainVisual.list.useQuery();

  const { data: categories = [] } = trpc.category.list.useQuery();

  const openModal = () => {
    setOrderModal(true);
    setOrderList([...mainVisuals]);
    setTimeout(() => setModalVisible(true), 10);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setOrderModal(false), 250);
    setSelectedIdx(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (orderModal) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [orderModal]);

  const moveUp = () => {
    if (selectedIdx === null || selectedIdx === 0 || orderList.length === 0) return;
    const newList = [...orderList];
    const temp = newList[selectedIdx];
    newList[selectedIdx] = newList[selectedIdx - 1];
    newList[selectedIdx - 1] = temp;
    setOrderList(newList);
    setSelectedIdx(selectedIdx - 1);
  };

  const moveDown = () => {
    if (selectedIdx === null || selectedIdx === orderList.length - 1 || orderList.length === 0)
      return;
    const newList = [...orderList];
    const temp = newList[selectedIdx];
    newList[selectedIdx] = newList[selectedIdx + 1];
    newList[selectedIdx + 1] = temp;
    setOrderList(newList);
    setSelectedIdx(selectedIdx + 1);
  };

  // tRPC 뮤테이션
  const updateOrderMutation = trpc.mainVisual.updateOrder.useMutation();
  const deleteMutation = trpc.mainVisual.delete.useMutation();

  const saveOrder = async () => {
    try {
      const orderItems = orderList.map((item, index) => ({
        id: item.id,
        order: index + 1,
      }));

      await updateOrderMutation.mutateAsync({ items: orderItems });
      await refetchMainVisuals();
      closeModal();
    } catch (error) {
      console.error('Error saving order:', error);
      alert('순서 저장 중 오류가 발생했습니다.');
    }
  };

  // 검색 및 필터링
  const filteredMainVisuals = mainVisuals.filter((item: any) => {
    const matchesSearch =
      searchTerm === '' ||
      item.artistName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.songName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === '' || item.category === filters.category;
    const matchesDisplayType =
      filters.displayType === '' || item.displayType === filters.displayType;
    const matchesLiveStatus = filters.liveStatus === '' || item.liveStatus === filters.liveStatus;
    const matchesCreator = filters.creator === '' || item.createdBy === filters.creator;

    return (
      matchesSearch && matchesCategory && matchesDisplayType && matchesLiveStatus && matchesCreator
    );
  });

  const handleEdit = (id: number) => {
    router.push(`/main-visual/create?id=${id}&edit=1`);
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteMutation.mutateAsync({ id });
        await refetchMainVisuals();
      } catch (error) {
        console.error('Error deleting main visual:', error);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <style>{`
        .nowrap {
          white-space: nowrap;
        }
        .category-filter-select {
          position: relative;
          pointer-events: none;
        }
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
        .category-filter-select option {
          background: #232226;
          color: #545454;
          font-weight: 500;
          border-radius: 4px;
          padding: 8px 16px;
        }
        .category-filter-select option:checked {
          background: #3379b7;
          color: #fff;
        }
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
        .fade-anim {
          transition:
            opacity 0.2s,
            transform 0.2s;
        }
        .fade-anim-hide {
          opacity: 0;
          transform: translateY(-10px);
        }
      `}</style>
      {/* Title & Top Controls */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1, color: '#585858' }}>
          메인비주얼 등록/수정/관리
        </h2>
        <button
          className="btn-anim"
          onClick={openModal}
          style={{
            background: '#2F2F2F',
            color: '#858585',
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            borderRadius: 4,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <IconSort />
          <span style={{ marginLeft: 8 }}>메인비주얼 순서 관리</span>
        </button>
        <button
          className="btn-anim"
          style={{
            background: '#2F2F2F',
            color: '#858585',
            fontSize: 16,
            fontWeight: 500,
            border: 'none',
            borderRadius: 4,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            marginLeft: 12,
          }}
          onClick={() => router.push('/main-visual/create')}
        >
          <IconPlus />
          <span style={{ marginLeft: 8 }}>메인비주얼 생성</span>
        </button>
      </div>
      {/* Modal */}
      {orderModal && (
        <div className={`modal-bg${modalVisible ? ' visible' : ''}`} onClick={closeModal}>
          <div
            className={`modal-card${modalVisible ? ' visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-title">메인비주얼 순서 관리</div>
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
                        alt="등록된 메인비주얼이 없습니다."
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
                        등록된 메인비주얼이 없습니다.
                      </div>
                    </div>
                  </>
                ) : (
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th style={{ width: 54 }}>No.</th>
                        <th style={{ width: 610 }}>메인비주얼 제목</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={selectedIdx === idx ? 'selected' : ''}
                          onClick={() => setSelectedIdx(idx)}
                        >
                          <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                          <td>{`${item.artistName} - ${item.songName}`}</td>
                        </tr>
                      ))}
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
                <button className="cancel" onClick={closeModal}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
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
            className="category-search-input"
            placeholder="아티스트명, 노래명, 카테고리를 입력하세요"
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
              style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}
            >
              <button
                className={filterOpen ? 'btn-anim fade-anim' : 'btn-anim fade-anim fade-anim-hide'}
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
                className={filterOpen ? 'btn-anim fade-anim' : 'btn-anim fade-anim fade-anim-hide'}
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
        {/* Filter Section (animated, normal flow, no margin) */}
        {filterOpen && (
          <div
            className={`filter-dropdown-anim ${filterOpen ? 'filter-dropdown-open' : 'filter-dropdown-closed'}`}
            style={{
              display: 'flex',
              gap: 8,
              background: '#262626',
              padding: '24px 0 0 0',
              borderRadius: 4,
            }}
          >
            {/* Dropdown 1 */}
            <div style={{ position: 'relative', minWidth: 140 }}>
              <select
                className="category-filter-select select-anim"
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  width: '100%',
                  padding: '0 40px 0 16px',
                  appearance: 'none',
                }}
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              >
                <option value="">카테고리</option>
                {categories.map((category: any) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <IconChevronDown />
              </span>
            </div>
            {/* Dropdown 2 */}
            <div style={{ position: 'relative', minWidth: 120 }}>
              <select
                className="category-filter-select select-anim"
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  width: '100%',
                  padding: '0 40px 0 16px',
                  appearance: 'none',
                }}
                value={filters.displayType}
                onChange={(e) => setFilters((f) => ({ ...f, displayType: e.target.value }))}
              >
                <option value="">표시 유형</option>
                <option value="image">이미지</option>
                <option value="youtube">유튜브</option>
                <option value="streaming">스트리밍</option>
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <IconChevronDown />
              </span>
            </div>
            {/* Dropdown 3 */}
            <div style={{ position: 'relative', minWidth: 120 }}>
              <select
                className="category-filter-select select-anim"
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  width: '100%',
                  padding: '0 40px 0 16px',
                  appearance: 'none',
                }}
                value={filters.liveStatus}
                onChange={(e) => setFilters((f) => ({ ...f, liveStatus: e.target.value }))}
              >
                <option value="">라이브 상태</option>
                <option value="online">온라인</option>
                <option value="offline">오프라인</option>
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <IconChevronDown />
              </span>
            </div>
            {/* Dropdown 4 */}
            <div style={{ position: 'relative', minWidth: 120 }}>
              <select
                className="category-filter-select select-anim"
                style={{
                  background: '#1C1C1C',
                  color: '#545454',
                  fontSize: 12,
                  border: 'none',
                  borderRadius: 4,
                  height: 40,
                  width: '100%',
                  padding: '0 40px 0 16px',
                  appearance: 'none',
                }}
                value={filters.creator}
                onChange={(e) => setFilters((f) => ({ ...f, creator: e.target.value }))}
              >
                <option value="">생성자</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }}
              >
                <IconChevronDown />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Visual Table */}
      <div
        style={{
          background: '#2C2C2C',
          padding: '12px 24px',
          borderRadius: 4,
          marginTop: 24,
        }}
      >
        <div
          style={{
            display: 'flex',
            background: '#262626',
            color: '#5B5B5B',
            fontWeight: 600,
            border: '1px solid #1A1A1A',
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
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            No.
          </div>
          <div
            style={{
              flex: '0 0 80px',
              padding: '12px 0px',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            Code
          </div>
          <div
            style={{
              flex: '0 0 100px',
              padding: '12px 0px',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            카테고리
          </div>
          <div
            style={{
              flex: '0 0 120px',
              padding: '12px 0px',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            아티스트 명
          </div>
          <div
            style={{
              flex: '1 1 0%',
              padding: '12px 0px',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            노래 명
          </div>
          <div
            style={{
              flex: '0 0 120px',
              padding: '12px 0px',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            표기 유무
          </div>
          <div
            style={{
              flex: '0 0 120px',
              padding: '12px 0px',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            등록일시
          </div>
          <div
            style={{
              flex: '0 0 100px',
              padding: '12px 0px',
              textAlign: 'center',
              background: '#262626',
            }}
          >
            기능
          </div>
        </div>
        <div
          style={{
            background: '#2C2C2C',
            border: '1px solid #1A1A1A',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            overflow: 'hidden',
          }}
        >
          {loadingMainVisuals ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                color: '#888',
              }}
            >
              <div
                style={{
                  color: '#888',
                  fontWeight: 600,
                  fontSize: 16,
                  marginTop: 16,
                  textAlign: 'center',
                }}
              >
                메인 비주얼 데이터를 불러오는 중...
              </div>
            </div>
          ) : filteredMainVisuals.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px 0',
                color: '#888',
              }}
            >
              <Image
                src={Nulltry}
                width={134}
                height={202}
                alt="등록된 메인비주얼이 없습니다."
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
                등록된 메인비주얼이 없습니다.
              </div>
            </div>
          ) : (
            <div style={{ background: '#2C2C2C' }}>
              {filteredMainVisuals.map((item: any, idx: number) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    borderBottom: '1px solid #1A1A1A',
                    background: '#2C2C2C',
                    transition: 'background 0.18s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#484848';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#2C2C2C';
                  }}
                >
                  <div
                    style={{
                      flex: '0 0 60px',
                      padding: '12px 0px',
                      textAlign: 'center',
                      borderRight: '1px solid #1A1A1A',
                      background: 'inherit',
                      color: '#fff',
                      fontSize: 15,
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div
                    style={{
                      flex: '0 0 80px',
                      padding: '12px 0px',
                      textAlign: 'center',
                      borderRight: '1px solid #1A1A1A',
                      background: 'inherit',
                      color: '#fff',
                      fontSize: 15,
                    }}
                  >
                    {item.code}
                  </div>
                  <div
                    style={{
                      flex: '0 0 100px',
                      padding: '12px 0px',
                      textAlign: 'center',
                      borderRight: '1px solid #1A1A1A',
                      background: 'inherit',
                      color: '#fff',
                      fontSize: 15,
                    }}
                  >
                    {item.category}
                  </div>
                  <div
                    style={{
                      flex: '0 0 120px',
                      padding: '12px 0px',
                      textAlign: 'center',
                      borderRight: '1px solid #1A1A1A',
                      background: 'inherit',
                      color: '#fff',
                      fontSize: 15,
                    }}
                  >
                    {item.category === 'LIVE' ? '-' : item.artistName}
                  </div>
                  <div
                    style={{
                      flex: '1 1 0%',
                      padding: '12px 0px',
                      textAlign: 'center',
                      borderRight: '1px solid #1A1A1A',
                      background: 'inherit',
                      color: '#fff',
                      fontSize: 15,
                    }}
                  >
                    {item.category === 'LIVE' ? '-' : item.songName}
                  </div>
                  <div
                    style={{
                      flex: '0 0 120px',
                      padding: '12px 0px',
                      textAlign: 'center',
                      borderRight: '1px solid #1A1A1A',
                      background: 'inherit',
                      color: '#fff',
                      fontSize: 15,
                    }}
                  >
                    {item.displayType === 'image' && '이미지'}
                    {item.displayType === 'youtube' && '유튜브'}
                    {item.displayType === 'streaming' && (
                      <span style={{ color: item.liveStatus === 'online' ? '#4CAF50' : '#FF5722' }}>
                        {item.liveStatus === 'online' ? '라이브' : '오프라인'}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      flex: '0 0 120px',
                      padding: '12px 0px',
                      textAlign: 'center',
                      borderRight: '1px solid #1A1A1A',
                      background: 'inherit',
                      color: '#fff',
                      fontSize: 15,
                    }}
                  >
                    {item.createdAt}
                  </div>
                  <div
                    style={{
                      flex: '0 0 100px',
                      padding: '12px 0px',
                      textAlign: 'center',
                      background: 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <button
                      className="icon-btn"
                      title="수정"
                      onClick={() => handleEdit(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        borderRadius: 4,
                      }}
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="icon-btn"
                      title="삭제"
                      onClick={() => handleDelete(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 4,
                        borderRadius: 4,
                      }}
                    >
                      <IconDelete />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
