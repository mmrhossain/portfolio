'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface UserEditData {
    id: string;
    name: string;
    role: 'ADMIN' | 'USER';
    isActive: boolean;
}

interface UsersDialogProps {
    open: boolean;
    loading: boolean;

    user: UserEditData | null;

    onClose: () => void;

    onSave: (payload: {
        id: string;
        payload: {
            role: 'ADMIN' | 'USER';
            isActive: boolean;
        };
    }) => void;
}

export function UsersDialog({
                                open,
                                loading,
                                user,
                                onClose,
                                onSave,
                            }: UsersDialogProps) {
    const [role, setRole] = useState<
        'ADMIN' | 'USER'
    >('USER');

    const [isActive, setIsActive] =
        useState(true);

    useEffect(() => {
        if (!user) return;

        setRole(user.role);
        setIsActive(user.isActive);
    }, [user]);

    const handleSave = () => {
        if (!user) return;

        onSave({
            id: user.id,
            payload: {
                role,
                isActive,
            },
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) {
                    onClose();
                }
            }}
        >
            <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Edit User
                    </DialogTitle>

                    <DialogDescription>
                        Update role and account
                        status.
                    </DialogDescription>
                </DialogHeader>

                {user && (
                    <div className="space-y-4">
                        <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        Role
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Administrators have
                                        full access.
                                    </p>
                                </div>

                                <Badge
                                    variant={
                                        role === 'ADMIN'
                                            ? 'accent'
                                            : 'secondary'
                                    }
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setRole(
                                            role === 'ADMIN'
                                                ? 'USER'
                                                : 'ADMIN'
                                        )
                                    }
                                >
                                    {role}
                                </Badge>
                            </div>
                        </div>

                        <div className="rounded-xl border p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        Account Status
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Inactive users
                                        cannot log in.
                                    </p>
                                </div>

                                <Switch
                                    checked={isActive}
                                    onCheckedChange={
                                        setIsActive
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSave}
                        disabled={
                            loading || !user
                        }
                    >
                        {loading
                            ? 'Saving...'
                            : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}