'use client';

import { useState, useDeferredValue } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {usersApi, UserUpdatePayload} from '@/lib/api/users';
import { getErrorMessage } from '@/lib/api/client';

import { UsersSearch } from './users.search';
import {UsersTable} from "@/components/admin/users/users.table";
import {UsersDialog} from "@/components/admin/users/user.dialog";

interface Props {
    initialUsers: any[];
    initialMeta: any;
}

export function UsersClient({
                                initialUsers,
                                initialMeta,
                            }: Props) {
    const queryClient = useQueryClient();

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState<any>(null);

    const debouncedSearch =
        useDeferredValue(search);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: [
            'users',
            page,
            debouncedSearch,
        ],
        queryFn: () =>
            usersApi.list({
                page,
                limit: 10,
                search: debouncedSearch,
            }),
        initialData: {
            data: initialUsers,
            meta: initialMeta,
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({id, payload}: {id: string, payload: UserUpdatePayload}) =>{
            return usersApi.update(id, payload)
        },

        onSuccess: () => {
            toast.success('User updated');

            queryClient.invalidateQueries({
                queryKey: ['users'],
            });

            setEditing(null);
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    const deleteMutation = useMutation({
        mutationFn: usersApi.delete,

        onSuccess: () => {
            toast.success('User deleted');

            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return (
        <div className="min-w-0 space-y-6">
            <UsersSearch
                value={search}
                onChange={setSearch}
            />

            <UsersTable
                users={data?.data ?? []}
                meta={data?.meta}
                loading={isLoading}
                error={isError}
                refetch={refetch}
                onEdit={setEditing}
                onDelete={(id) =>
                    deleteMutation.mutate(id)
                }
                onPageChange={setPage}
                onToggle={(id, payload) =>
                    updateMutation.mutate({
                        id,
                        payload,
                    })
                }
            />

            <UsersDialog
                user={editing}
                open={Boolean(editing)}
                onClose={() => setEditing(null)}
                onSave={(payload) =>
                    updateMutation.mutate(payload)
                }
                loading={updateMutation.isPending}
            />
        </div>
    );
}