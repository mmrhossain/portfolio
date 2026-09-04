"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { blogsApi } from "@/lib/api/blogs";
import { getErrorMessage } from "@/lib/api/client";

import type { Blog } from "@/types";
import type { BlogFormValues } from "@/components/admin/blogs/blog.form";

import { BlogTable } from "@/components/admin/blogs/blog.table";

import { TableRowsSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";

import { Button } from "@/components/ui/button";
import {CreateBlogDialog} from "@/components/admin/blogs/create.blog.dialog";
import {EditBlogDialog} from "@/components/admin/blogs/edit.blog.dialog";

interface Props {
    initialData?: any;
}

export function BlogsClient({ initialData }: Props) {
    const queryClient = useQueryClient();

    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<Blog | null>(null);

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["blogs", "admin"],
        queryFn: () => blogsApi.listAdmin(),
        initialData,
    });

    const blogs = data?.data ?? [];
    const meta = data?.meta;

    console.log("blogs", blogs);

    const invalidate = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["blogs"],
        });
    };

    // CREATE
    const createMutation = useMutation({
        mutationFn: (payload: BlogFormValues) =>
            blogsApi.create(payload),

        onSuccess: async () => {
            toast.success("Blog created");

            await invalidate();

            setCreating(false);
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    // UPDATE
    const updateMutation = useMutation({
        mutationFn: ({
                         id,
                         payload,
                     }: {
            id: string;
            payload: BlogFormValues;
        }) => blogsApi.update(id, payload),

        onSuccess: async () => {
            toast.success("Blog updated");

            await invalidate();

            setEditing(null);
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    // DELETE
    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            blogsApi.delete(id),

        onSuccess: async () => {
            toast.success("Blog deleted");

            await invalidate();
        },

        onError: (error) => {
            toast.error(getErrorMessage(error));
        },
    });

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                    <h1 className="font-display text-3xl font-bold">
                        Blogs
                    </h1>

                    <p className="text-muted-foreground">
                        Manage portfolio blog posts
                    </p>
                </div>

                <Button
                    onClick={() => setCreating(true)}
                >
                    <Plus className="h-4 w-4" />
                    New Post
                </Button>
            </div>

            {/* Table */}
            <div className="min-w-0 rounded-2xl border border-border bg-card">
                {isLoading ? (
                    <TableRowsSkeleton rows={8} />
                ) : isError ? (
                    <div className="p-6">
                        <ErrorState
                            onRetry={() => refetch()}
                        />
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="p-6">
                        <EmptyState
                            title="No blogs found"
                            description="Create your first blog post to get started."
                        />
                    </div>
                ) : (
                    <BlogTable
                        blogs={blogs}
                        onEdit={(blog) => setEditing(blog)}
                        onDelete={(id) =>
                            deleteMutation.mutate(id)
                        }
                        loading={deleteMutation.isPending}
                    />
                )}

            </div>

            {/* Create */}
            <CreateBlogDialog
                open={creating}
                onOpenChange={setCreating}
                onSubmit={(values) =>
                    createMutation.mutate(values)
                }
                loading={createMutation.isPending}
            />

            {/* Edit */}
            {editing && (
                <EditBlogDialog
                    blog={editing}
                    open={!!editing}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditing(null);
                        }
                    }}
                    onSubmit={(values) =>
                        updateMutation.mutate({
                            id: editing.id,
                            payload: values,
                        })
                    }
                    loading={updateMutation.isPending}
                />
            )}
        </div>
    );
}