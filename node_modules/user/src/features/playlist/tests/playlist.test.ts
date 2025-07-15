import { formatPlaylistName } from '../utils';

test('formatPlaylistName trims whitespace', () => {
  expect(formatPlaylistName('  My Playlist  ')).toBe('My Playlist');
}); 