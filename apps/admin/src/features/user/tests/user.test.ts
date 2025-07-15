import { formatAdminUserName } from '../utils';

test('formatAdminUserName trims and uppercases', () => {
  expect(formatAdminUserName('  Bob  ')).toBe('BOB');
}); 