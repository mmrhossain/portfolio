"use client";

import {
    ExternalLink,
    Pencil,
    Trash2,
} from "lucide-react";

import Link from "next/link";

import {
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import type { Blog } from "@/types";

interface Props {
    blog: Blog;
    onEdit: () => void;
    onDelete: () => void;
    loading: boolean;
}

export function BlogActions({
                                blog,
                                onEdit,
                                onDelete,
                                loading,
                            }: Props) {
    return (
        <>
            <DropdownMenuLabel>
                Actions
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                onClick={onEdit}
                disabled={loading}
            >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <Link
                    href={`/blogs/${blog.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Blog
                </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                className="text-destructive"
                onClick={onDelete}
                disabled={loading}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                {loading ? "Deleting..." : "Delete"}
            </DropdownMenuItem>
        </>
    );
}