import { screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import { customRender } from '../../test/utils/test-utils';
import { vi } from 'vitest';

describe('Login page', () => {
    it('renders login form', () => {
        customRender(<Login />);
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /로그인/i })).toBeInTheDocument();
    });

    it('shows error on empty submit', async () => {
        customRender(<Login />);
        fireEvent.click(screen.getByRole('button', { name: /로그인/i }));
        await waitFor(() => {
            expect(screen.getByText(/아이디와 비밀번호를 모두 입력해 주세요/i)).toBeInTheDocument();
        });
    });

    it('shows error on invalid credentials', async () => {
        // mock fetch
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' })
        }) as any;
        customRender(<Login />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong' } });
        fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByRole('button', { name: /로그인/i }));
        await waitFor(() => {
            expect(screen.getByText(/아이디 또는 비밀번호가 올바르지 않습니다/i)).toBeInTheDocument();
        });
    });
}); 