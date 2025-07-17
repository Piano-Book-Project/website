import { formatSongTitle } from '../utils';

test('formatSongTitle trims whitespace', () => {
  expect(formatSongTitle('  Song Title  ')).toBe('Song Title');
});
