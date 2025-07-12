import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

// 타입 정의
export type Permission = {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
};
export type Account = {
    id: string;
    pw: string;
    role: string;
    memo: string;
    isSuper: boolean;
    createdAt: string;
    updatedAt: string;
    permissions: Record<string, Permission>;
};
export type AccountsResponse = {
    data: Account[];
    total: number;
    page: number;
    pageSize: number;
};

// 계정 목록 조회
export function useAccounts(params: {
    search?: string;
    role?: string;
    sortBy?: string;
    order?: string;
    page?: number;
    pageSize?: number;
}) {
    return useQuery({
        queryKey: ['accounts', params],
        queryFn: async () => {
            const { data } = await api.get<AccountsResponse>('/admin/accounts', { params });
            return data;
        },
    });
}

// 계정 생성
export function useAddAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (account: Partial<Account>) => {
            const { data } = await api.post('/admin/accounts', account);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
    });
}

// 계정 수정
export function useUpdateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, ...rest }: Partial<Account> & { id: string }) => {
            const { data } = await api.put(`/admin/accounts/${id}`, rest);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
    });
}

// 계정 삭제
export function useDeleteAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.delete(`/admin/accounts/${id}`);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['accounts'] })
    });
} 