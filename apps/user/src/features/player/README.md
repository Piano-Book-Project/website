# Player Feature

플레이어/플레이바 관련 기능을 담당하는 도메인입니다.

## 구조

```
features/player/
├── components/
│   └── PlayerBar.tsx      # 하단 고정 플레이바 UI
├── stores/
│   └── playerStore.ts     # Zustand 기반 플레이어 상태 관리
├── types.ts               # Player, Song, Artist 타입 정의
├── utils.ts               # 시간 포맷, 이미지 처리 등 유틸
├── tests/
│   └── PlayerBar.test.tsx # 컴포넌트 테스트
└── index.ts               # 배럴 익스포트
```

## 주요 기능

### PlayerBar 컴포넌트

- 하단에 고정된 플레이바 UI
- 아티스트명, 곡 제목, 앨범 이미지 표시
- 재생/일시정지 컨트롤
- 하트(좋아요), 더보기 아이콘
- 이미지 없을 때 대체 UI
- 하단 "CHU PIANO" 하드코딩

### Player Store (Zustand)

- 선택된 곡 정보 관리
- 재생 상태 (isPlaying)
- 볼륨, 현재 시간 등
- 재생/일시정지/다음/이전 액션

## 사용법

```tsx
import PlayerBar from './features/player/components/PlayerBar';
import { usePlayerStore } from './features/player/stores/playerStore';

// App.tsx에서 하단 고정
<PlayerBar />;

// 다른 컴포넌트에서 플레이어 상태 사용
const { currentSong, play, pause } = usePlayerStore();
```

## 확장 가능한 기능

- 볼륨 컨트롤
- 진행바 (seek)
- 다음/이전 곡
- 플레이리스트 연동
- tRPC DB 연동
- 오디오 실제 재생

## DB 연동

현재는 mock 데이터를 사용하지만, 추후 tRPC를 통해 실제 DB에서 곡/아티스트 정보를 가져올 수 있습니다.

```tsx
// 예시: tRPC 연동
const { data: songs } = useQuery(['songs'], () => trpc.songs.getAll());
const { mutate: setCurrentSong } = useMutation((songId: string) =>
  trpc.player.setCurrentSong.mutate({ songId }),
);
```
