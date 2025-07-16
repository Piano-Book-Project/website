import { useQuery } from '@tanstack/react-query';
import { trpc } from '../../../lib/trpc';

export function useCurrentSong(songId: number = 1) {
  // tRPC 쿼리: song.get({ id })
  return trpc.song.get.useQuery({ id: songId });
} 