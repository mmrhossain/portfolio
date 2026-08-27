'use client';

import {
    Shield,
    Pencil,
    Trash2,
    UserRound,
} from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';

import { Switch } from '@/components/ui/switch';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Pagination } from '@/components/shared/pagination';
import { TableRowsSkeleton } from '@/components/shared/skeletons';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';

import { formatDate, getInitials } from '@/lib/utils';
import { useAuthStore } from '@/lib/auth/store';

interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string | null;
    role: 'ADMIN' | 'USER';
    isActive: boolean;
    createdAt: string;
}

interface UsersTableProps {
    users: User[];
    meta?: any;

    loading: boolean;
    error: boolean;

    refetch: () => void;

    onEdit: (user: User) => void;

    onDelete: (id: string) => void;

    onToggle: (
        id: string,
        payload: {
            isActive: boolean;
        }
    ) => void;

    onPageChange: (page: number) => void;
}

export function UsersTable({
                               users,
                               meta,
                               loading,
                               error,
                               refetch,
                               onEdit,
                               onDelete,
                               onToggle,
                               onPageChange,
                           }: UsersTableProps) {
    const currentUser = useAuthStore(
        (state) => state.user
    );

    if (loading) {
        return <TableRowsSkeleton rows={8} />;
    }

    if (error) {
        return (
            <div className="p-6">
                <ErrorState onRetry={refetch} />
            </div>
        );
    }

    if (!users.length) {
        return (
            <div className="p-6">
                <EmptyState title="No users found" />
            </div>
        );
    }

    return (
        <>
            <Table className="min-w-[720px]">
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>

                        <TableHead>
                            Role
                        </TableHead>

                        <TableHead>
                            Status
                        </TableHead>

                        <TableHead>
                            Joined
                        </TableHead>

                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-9 w-9">
                                        {user.avatarUrl && (
                                            <AvatarImage
                                                src={user.avatarUrl}
                                                alt={user.name}
                                            />
                                        )}

                                        <AvatarFallback>
                                            {getInitials(user.name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div>
                                        <p className="font-medium">
                                            {user.name}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell>
                                <Badge
                                    variant={
                                        user.role === 'ADMIN'
                                            ? 'accent'
                                            : 'secondary'
                                    }
                                >
                                    {user.role === 'ADMIN' && (
                                        <Shield className="mr-1 h-3 w-3" />
                                    )}

                                    {user.role}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={user.isActive}
                                        disabled={
                                            user.role === 'ADMIN' ||
                                            user.id === currentUser?.id
                                        }
                                        onCheckedChange={(
                                            checked
                                        ) =>
                                            onToggle(user.id, {
                                                isActive: checked,
                                            })
                                        }
                                    />

                                    <span className="text-sm">
                    {user.isActive
                        ? 'Active'
                        : 'Inactive'}
                  </span>
                                </div>
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {formatDate(user.createdAt)}
                            </TableCell>

                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                        >
                                            <UserRound className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>
                                            Actions
                                        </DropdownMenuLabel>

                                        <DropdownMenuSeparator />

                                        <DropdownMenuItem
                                            onClick={() =>
                                                onEdit(user)
                                            }
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            disabled={
                                                user.role === 'ADMIN'
                                            }
                                            className="text-destructive"
                                            onClick={() =>
                                                onDelete(user.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {meta && (
                <Pagination
                    meta={meta}
                    onPageChange={onPageChange}
                    className="py-4"
                />
            )}
        </>
    );
}