import { formatUserName } from '../utils';

test('formatUserName trims whitespace', () => {
  expect(formatUserName('  Alice  ')).toBe('Alice');
}); 