'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import Nulltry from '../../assets/Nulltry.png';
import { trpc } from '../../utils/trpc';

// TODO: Replace with real DB fetch
const mockCategoryOrder = [
  { id: 1, name: 'K-POP' },
  { id: 2, name: 'J-POP' },
  { id: 3, name: 'POP' },
  { id: 4, name: 'OST' },
  { id: 5, name: 'JAZZ' },
];

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

type Category = {
  id: number;
  name: string;
  code?: string;
  status?: string;
  songCount?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  // 필요한 필드 추가
};

// 카테고리 수정 모달(카테고리 생성과 동일 UI, props로 category 전달)
function CategoryEditModal({ category, onClose }: { category: Category; onClose: () => void }) {
  // ... 기타 상태 및 저장 로직(생성 페이지와 동일하게 확장 가능)
  return (
    <div
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#181818',
          borderRadius: 8,
          padding: 32,
          minWidth: 600,
          minHeight: 400,
          boxShadow: '0 8px 32px #000a',
          position: 'relative',
        }}
      >
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
          카테고리 수정: {category.name}
        </h2>
        {/* 기존 카테고리 생성 폼과 동일한 UI/입력 필드 배치 */}
        {/* ... (카테고리 생성 페이지의 테이블/폼 복사) ... */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: 24,
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  // 메타태그 설정
  // useEffect 및 setPageMeta, setDefaultMeta 관련 코드 모두 삭제

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [filters, setFilters] = useState({ order: '', status: '', creator: '' });
  const [orderModal, setOrderModal] = useState(false);
  const [orderList, setOrderList] = useState(mockCategoryOrder);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [movingIdx, setMovingIdx] = useState<number | null>(null);
  const [moveDirection, setMoveDirection] = useState<'up' | 'down' | null>(null);

  // Modal animation helpers
  const [modalVisible, setModalVisible] = useState(false);
  const openModal = () => {
    setOrderModal(true);
    setTimeout(() => setModalVisible(true), 10);
  };
  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setOrderModal(false), 200);
  };

  // Keyboard ESC close
  React.useEffect(() => {
    if (!orderModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [orderModal]);

  // Move up/down with animation
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

  const { data: categories = [], refetch } = trpc.category.list.useQuery();
  const updateOrder = trpc.category.updateOrder.useMutation({
    onSuccess: () => refetch(),
  });

  const router = useRouter();

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const pagedCategories = categories.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(categories.length / pageSize);

  // orderList를 DB categories로 동기화 - useRef로 안전하게 처리
  const prevCategoriesRef = useRef(categories);

  useEffect(() => {
    // 이전 categories와 현재 categories가 실제로 다른지 확인
    const prevCategories = prevCategoriesRef.current;
    const hasChanged =
      prevCategories !== categories ||
      (categories && prevCategories && categories.length !== prevCategories.length);

    if (hasChanged) {
      if (categories && categories.length > 0) {
        const sorted = [...categories].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setOrderList(sorted);
      } else {
        setOrderList([]);
      }
      prevCategoriesRef.current = categories;
    }
  }, [categories]);

  // 저장(순서 일괄 업데이트) 핸들러
  const saveOrder = async () => {
    const newOrders = orderList.map((cat, idx) => ({ id: cat.id, order: idx + 1 }));
    await updateOrder.mutateAsync({ orders: newOrders });
    closeModal();
  };

  const [editModal, setEditModal] = useState<{ open: boolean; category?: Category }>({
    open: false,
  });

  return (
    <div
      style={{
        padding: 24,
        minHeight: '100vh',
        boxSizing: 'border-box',
        background: 'transparent',
      }}
    >
      <style>{`
        .category-search-input::placeholder {
          color: #545454;
          opacity: 1;
        }
        .category-filter-select option { color: #545454; }
        .nowrap { white-space: nowrap; }
        .filter-dropdown-anim {
          transition: max-height 0.35s cubic-bezier(.4,0,.2,1), opacity 0.35s cubic-bezier(.4,0,.2,1);
          overflow: hidden;
        }
        .filter-dropdown-closed {
          max-height: 0;
          opacity: 0;
          pointer-events: none;
        }
        .filter-dropdown-open {
          max-height: 80px;
          opacity: 1;
        }
        .fade-anim {
          transition: opacity 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1);
          opacity: 1;
          transform: translateY(0);
        }
        .fade-anim-hide {
          opacity: 0;
          transform: translateY(-8px);
          pointer-events: none;
        }
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
        .select-anim {
          transition: box-shadow 0.18s, border-color 0.18s, background 0.18s, color 0.18s, transform 0.18s;
        }
        .select-anim:focus {
          box-shadow: 0 0 0 2px #3379B7;
          border-color: #3379B7;
          background: #232226;
          color: #3379B7;
          transform: scale(1.03);
        }
        .select-anim:hover {
          background: #232226;
          color: #3379B7;
        }
        .category-filter-select option {
          background: #232226;
          color: #545454;
          font-weight: 500;
          border-radius: 4px;
          padding: 8px 16px;
        }
        .category-filter-select option:checked {
          background: #3379B7;
          color: #fff;
        }
        .modal-bg {
          position: fixed; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.6); z-index: 1000;
          display: flex; align-items: center; justify-content: center;
          opacity: 0; pointer-events: none; transition: opacity 0.25s;
        }
        .modal-bg.visible { opacity: 1; pointer-events: auto; }
        .modal-card {
          background: #2C2C2C; border-radius: 8px; box-shadow: 0 8px 32px #000a; padding: 24px; min-width: 738px; min-height: 320px;
          opacity: 0; transform: translateY(40px) scale(0.98); transition: opacity 0.25s, transform 0.25s;
        }
        .modal-card.visible { opacity: 1; transform: translateY(0) scale(1); }
        .modal-title { color: #5B5B5B; font-size: 14px; font-weight: 600; margin-bottom: 14px; }
        .modal-table { width: 100%; border-collapse: collapse; background: #262626; }
        .modal-table th, .modal-table td { border: 1px solid #1A1A1A; padding: 0 16px; height: 48px; text-align: left; font-size: 15px; }
        .modal-table th { color: #5B5B5B; font-weight: 600; background: #262626; }
        .modal-table td { color: #5B5B5B; background: #262626; }
        .modal-table tr.selected td, .modal-table tr:hover td { background: #484848 !important; color: #D5D5D5 !important; font-weight: 700; }
        .modal-table tr { transition: background 0.18s; cursor: pointer; }
        .modal-table tr:not(.selected):hover td { background: #484848; color: #D5D5D5; }
        .modal-table th:first-child, .modal-table td:first-child { width: 54px; min-width: 54px; max-width: 54px; text-align: center; }
        .modal-table th:last-child, .modal-table td:last-child { width: 610px; min-width: 610px; max-width: 610px; }
        .modal-actions { display: flex; flex-direction: column; align-items: stretch; gap: 10px; margin-left: 16px; }
        .modal-actions button { width: 70px; height: 40px; border-radius: 6px; border: none; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.18s, color 0.18s, opacity 0.18s, transform 0.18s; }
        .modal-actions .up, .modal-actions .down { background: #262626; color: #C7DBEC; display: flex; align-items: center; justify-content: center; }
        .modal-actions .save { background: #3379B7; color: #C7DBEC; margin-top: 12px; }
        .modal-actions .cancel { background: #B73333; color: #C7DBEC; }
        .modal-actions button:hover, .modal-actions button:focus { opacity: 0.85; transform: scale(1.04); }
        .modal-actions button:active { opacity: 0.7; transform: scale(0.98); }
        @keyframes slideUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-48px); }
        }
        @keyframes slideDown {
          0% { transform: translateY(0); }
          100% { transform: translateY(48px); }
        }
        .slide-up { animation: slideUp 0.2s cubic-bezier(.4,0,.2,1); }
        .slide-down { animation: slideDown 0.2s cubic-bezier(.4,0,.2,1); }
        .icon-btn svg { transition: stroke 0.18s, opacity 0.18s, transform 0.18s; }
        .icon-btn:hover svg, .icon-btn:focus svg { opacity: 0.85; transform: scale(1.08); }
        .icon-btn:active svg { opacity: 0.7; transform: scale(0.96); }
        .icon-btn[title='수정']:hover svg path { stroke: #3379B7; }
        .icon-btn[title='삭제']:hover svg, .icon-btn[title='삭제']:focus svg { filter: drop-shadow(0 0 2px #B73333); }
        .fade-anim {
          transition: opacity 0.2s, transform 0.2s;
        }
        .fade-anim-hide {
          opacity: 0;
          transform: translateY(-10px);
        }
      `}</style>
      {/* Title & Top Controls */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, flex: 1, color: '#585858' }}>
          등록/수정/관리
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
          <span style={{ marginLeft: 8 }}>카테고리 순서 관리</span>
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
          onClick={() => router.push('/categories/create')}
        >
          <IconPlus />
          <span style={{ marginLeft: 8 }}>카테고리 생성</span>
        </button>
      </div>
      {/* Modal */}
      {orderModal && (
        <div className={`modal-bg${modalVisible ? ' visible' : ''}`} onClick={closeModal}>
          <div
            className={`modal-card${modalVisible ? ' visible' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-title">카테고리 순서 관리</div>
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
                        alt="등록된 카테고리가 없습니다."
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
                        등록된 카테고리가 없습니다.
                      </div>
                    </div>
                  </>
                ) : (
                  <table className="modal-table">
                    <thead>
                      <tr>
                        <th style={{ width: 54 }}>No.</th>
                        <th style={{ width: 610 }}>카테고리 이름</th>
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
                                alt="등록된 카테고리가 없습니다."
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
                                등록된 카테고리가 없습니다.
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        orderList.map((cat, idx) => (
                          <tr
                            key={cat.id}
                            className={
                              (selectedIdx === idx ? 'selected ' : '') +
                              (movingIdx === idx && moveDirection === 'up' ? 'slide-up ' : '') +
                              (movingIdx === idx && moveDirection === 'down' ? 'slide-down ' : '')
                            }
                            onClick={() => setSelectedIdx(idx)}
                          >
                            <td>{idx + 1}</td>
                            <td>{cat.name}</td>
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
                <button className="cancel" onClick={closeModal}>
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Search & Filter + Save/Cancel */}
      <div style={{ background: '#262626', padding: '12px 24px', position: 'relative' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}
        >
          <input
            className="category-search-input"
            placeholder="카테고리를 입력하세요"
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
                value={filters.order}
                onChange={(e) => setFilters((f) => ({ ...f, order: e.target.value }))}
              >
                <option value="">순번 순 정렬</option>
                <option value="asc">오름차순</option>
                <option value="desc">내림차순</option>
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
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="">상태</option>
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
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
      {/* Table Header Wrapper */}
      <div style={{ background: '#2C2C2C', padding: '12px 24px', borderRadius: 4, marginTop: 24 }}>
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
              padding: '12px 0',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            No.
          </div>
          <div
            style={{
              flex: '0 0 110px',
              padding: '12px 0',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            Code
          </div>
          <div
            style={{
              flex: '0 0 90px',
              padding: '12px 0',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            상태
          </div>
          <div
            style={{
              flex: 1,
              padding: '12px 0',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            카테고리 이름
          </div>
          <div
            style={{
              flex: '0 0 120px',
              padding: '12px 0',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            카테고리 적용 수
          </div>
          <div
            style={{
              flex: '0 0 160px',
              padding: '12px 0',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            최초 생성 일자/자
          </div>
          <div
            style={{
              flex: '0 0 160px',
              padding: '12px 0',
              textAlign: 'center',
              borderRight: '1px solid #1A1A1A',
              background: '#262626',
            }}
          >
            마지막 수정 일자/자
          </div>
          <div
            style={{
              flex: '0 0 90px',
              padding: '12px 0',
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
            border: '2px solid #212121',
            borderTop: 'none',
            borderRadius: '0 0 4px 4px',
            overflow: 'hidden',
          }}
        >
          {categories?.length === 0
            ? null
            : pagedCategories.map((cat: Category, idx: number) => (
                <div
                  key={cat.id}
                  style={{
                    padding: 0,
                    background: '#2C2C2C',
                    borderBottom: '1px solid #212121',
                    boxSizing: 'border-box',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 15,
                      background: '#262626',
                      color: '#5B5B5B',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        flex: '0 0 60px',
                        textAlign: 'center',
                        borderRight: '1px solid #1A1A1A',
                        background: '#262626',
                        color: '#5B5B5B',
                        padding: '8px 0',
                      }}
                    >
                      {(page - 1) * pageSize + idx + 1}
                    </div>
                    <div
                      style={{
                        flex: '0 0 110px',
                        textAlign: 'center',
                        borderRight: '1px solid #1A1A1A',
                        background: '#262626',
                        color: '#5B5B5B',
                        padding: '8px 0',
                      }}
                    >
                      {cat.code}
                    </div>
                    <div
                      style={{
                        flex: '0 0 90px',
                        textAlign: 'center',
                        borderRight: '1px solid #1A1A1A',
                        background: '#262626',
                        padding: '8px 0',
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
                          background: cat.status === 'active' ? '#3379B7' : '#B73333',
                          color: '#fff',
                        }}
                      >
                        {cat.status === 'active' ? '활성화' : '비활성화'}
                      </span>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        textAlign: 'center',
                        borderRight: '1px solid #1A1A1A',
                        background: '#262626',
                        color: '#5B5B5B',
                        padding: '8px 0',
                      }}
                    >
                      {cat.name}
                    </div>
                    <div
                      style={{
                        flex: '0 0 120px',
                        textAlign: 'center',
                        borderRight: '1px solid #1A1A1A',
                        background: '#262626',
                        color: '#5B5B5B',
                        padding: '8px 0',
                      }}
                    >
                      {cat.songCount && cat.songCount > 0 ? cat.songCount : '-'}
                    </div>
                    <div
                      style={{
                        flex: '0 0 160px',
                        textAlign: 'center',
                        borderRight: '1px solid #1A1A1A',
                        background: '#262626',
                        color: '#5B5B5B',
                        padding: '8px 0',
                      }}
                    >
                      {cat.createdAt
                        ? `${new Date(cat.createdAt).toLocaleString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} / ${cat.createdBy}`
                        : '-'}
                    </div>
                    <div
                      style={{
                        flex: '0 0 160px',
                        textAlign: 'center',
                        borderRight: '1px solid #1A1A1A',
                        background: '#262626',
                        color: '#5B5B5B',
                        padding: '8px 0',
                      }}
                    >
                      {cat.updatedAt
                        ? `${new Date(cat.updatedAt).toLocaleString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} / ${cat.updatedBy}`
                        : '-'}
                    </div>
                    <div
                      style={{
                        flex: '0 0 90px',
                        textAlign: 'center',
                        background: '#262626',
                        color: '#5B5B5B',
                        padding: '8px 0',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <button
                        className="icon-btn"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="수정"
                        onClick={() =>
                          router.push(
                            `/categories/create?edit=1&id=${cat.id}&name=${encodeURIComponent(cat.name)}`,
                          )
                        }
                      >
                        <IconEdit />
                      </button>
                      <button
                        className="icon-btn"
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                        title="삭제"
                      >
                        <IconDelete />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '24px 0 0 0',
            gap: 8,
          }}
        >
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            style={{
              background: '#232226',
              color: '#858585',
              border: 'none',
              borderRadius: 4,
              padding: '6px 16px',
              fontWeight: 600,
              fontSize: 15,
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              opacity: page === 1 ? 0.5 : 1,
            }}
          >
            이전
          </button>
          <span style={{ color: '#888', fontWeight: 600, fontSize: 15 }}>
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            style={{
              background: '#232226',
              color: '#858585',
              border: 'none',
              borderRadius: 4,
              padding: '6px 16px',
              fontWeight: 600,
              fontSize: 15,
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
              opacity: page === totalPages ? 0.5 : 1,
            }}
          >
            다음
          </button>
        </div>
      )}
      {/* 모달 렌더링 */}
      {editModal.open && editModal.category && (
        <CategoryEditModal
          category={editModal.category}
          onClose={() => setEditModal({ open: false })}
        />
      )}
    </div>
  );
}
