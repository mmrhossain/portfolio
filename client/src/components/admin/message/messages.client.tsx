"use client";

import { useState } from "react";
import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { TableRowsSkeleton } from "@/components/shared/skeletons";


import { messagesApi } from "@/lib/api/messages";
import { getErrorMessage } from "@/lib/api/client";

import type {
    Message,
    MessageStatus,
} from "@/types";
import {MessageFilters} from "@/components/admin/message/message.filters";
import {MessagesTable} from "@/components/admin/message/messages.table";
import {MessageDetailsDialog} from "@/components/admin/message/message.dialog";

export function MessagesClient() {
    const queryClient = useQueryClient();

    const [page, setPage] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [selected, setSelected] =
        useState<Message | null>(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: [
            "messages",
            "admin",
            {
                page,
                search,
                status,
            },
        ],
        queryFn: () =>
            messagesApi.list({
                page,
                limit: 10,
                search,
                status:
                    status === "ALL"
                        ? undefined
                        : status,
            }),
    });

    const messages = data?.data ?? [];
    const meta = data?.meta;

    const invalidateMessages = () =>
        queryClient.invalidateQueries({
            queryKey: ["messages"],
        });

    const updateStatusMutation = useMutation({
        mutationFn: ({
                         id,
                         status,
                     }: {
            id: string;
            status: MessageStatus;
        }) =>
            messagesApi.updateStatus(
                id,
                status,
            ),

        onSuccess: () => {
            toast.success(
                "Message updated successfully.",
            );

            invalidateMessages();
        },

        onError: (error) => {
            toast.error(
                getErrorMessage(error),
            );
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            messagesApi.delete(id),

        onSuccess: () => {
            toast.success(
                "Message deleted successfully.",
            );

            invalidateMessages();

            if (
                selected &&
                selected.id
            ) {
                setSelected(null);
            }
        },

        onError: (error) => {
            toast.error(
                getErrorMessage(error),
            );
        },
    });

    const handleOpenMessage = (
        message: Message,
    ) => {
        setSelected(message);

        if (
            message.status === "NEW"
        ) {
            updateStatusMutation.mutate({
                id: message.id,
                status: "READ",
            });
        }
    };

    const handleReply = (
        id: string,
    ) => {
        updateStatusMutation.mutate({
            id,
            status: "REPLIED",
        });
    };

    const handleArchive = (
        id: string,
    ) => {
        updateStatusMutation.mutate({
            id,
            status: "ARCHIVED",
        });
    };

    const handleDelete = (
        id: string,
    ) => {
        const confirmed =
            window.confirm(
                "Are you sure you want to delete this message?",
            );

        if (!confirmed) return;

        deleteMutation.mutate(id);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="font-display text-3xl font-bold">
                        Messages
                    </h1>

                    <p className="mt-1 text-muted-foreground">
                        Inbox from the contact
                        form.
                    </p>
                </div>

                <MessageFilters
                    search={search}
                    status={status}
                    onSearchChange={(
                        value,
                    ) => {
                        setSearch(value);
                        setPage(1);
                    }}
                    onStatusChange={(
                        value,
                    ) => {
                        setStatus(value);
                        setPage(1);
                    }}
                />
            </div>

            <div className="min-w-0 rounded-2xl border border-border bg-card">
                {isLoading ? (
                    <TableRowsSkeleton rows={8} />
                ) : isError ? (
                    <div className="p-6">
                        <ErrorState
                            onRetry={() =>
                                refetch()
                            }
                        />
                    </div>
                ) : messages.length ===
                0 ? (
                    <div className="p-6">
                        <EmptyState
                            title="No messages found"
                            description={
                                search ||
                                status !== "ALL"
                                    ? "No messages match your filters."
                                    : "Messages from the contact form will appear here."
                            }
                        />
                    </div>
                ) : (
                    <MessagesTable
                        messages={messages}
                        onOpen={
                            handleOpenMessage
                        }
                        onReply={
                            handleReply
                        }
                        onDelete={
                            handleDelete
                        }
                    />
                )}

                {meta && (
                    <Pagination
                        meta={meta}
                        onPageChange={
                            setPage
                        }
                        className="py-4"
                    />
                )}
            </div>

            <MessageDetailsDialog
                message={selected}
                open={!!selected}
                onOpenChange={(
                    open,
                ) => {
                    if (!open) {
                        setSelected(null);
                    }
                }}
                onReply={() => {
                    if (!selected) return;

                    handleReply(
                        selected.id,
                    );
                }}
                onArchive={() => {
                    if (!selected) return;

                    handleArchive(
                        selected.id,
                    );
                }}
            />
        </div>
    );
}