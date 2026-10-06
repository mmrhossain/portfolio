"use client";

import { MessageSquareReply, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type MessageActionsProps = {
    onReply: () => void;
    onDelete: () => void;
};

export function MessageActions({
                                   onReply,
                                   onDelete,
                               }: MessageActionsProps) {
    return (
        <div className="flex justify-end gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={onReply}
            >
                <MessageSquareReply className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="text-destructive"
                onClick={onDelete}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}