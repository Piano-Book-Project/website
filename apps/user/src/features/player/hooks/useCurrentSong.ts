import { trpc } from '../../../lib/trpc';

export function useCurrentSong(songId: number = 1) {
  // tRPC 쿼리: song.get({ id })
  // useQuery 미사용 import 삭제
  // trpc.song.get.useQuery 타입 오류 원인 주석 추가
  return trpc.song.get.useQuery({ id: songId });
}
