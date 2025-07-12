import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';

export type Permission = {
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
};
export type Role = {
    role: string;
    description: string;
    permissions: Record<string, Permission>;
};
export type RolesResponse = {
    data: Role[];
};

export function useRoles() {
    return useQuery({
        queryKey: ['roles'],
        queryFn: async () => {
            const { data } = await api.get<RolesResponse>('/admin/roles');
            return data;
        },
    });
}

export function useUpdateRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ role, ...rest }: Partial<Role> & { role: string }) => {
            const { data } = await api.put(`/admin/roles/${role}`, rest);
            return data;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] })
    });
} 