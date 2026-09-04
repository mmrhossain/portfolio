"use client";

import { Mail, MailOpen } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { formatDate } from "@/lib/utils";

import type {
    Message,
    MessageStatus,
} from "@/types";
import {MessageActions} from "@/components/admin/message/message.actions";


const statusVariant = {
    NEW: "warning",
    READ: "default",
    REPLIED: "success",
    ARCHIVED: "secondary",
} as const;

type Props = {
    messages: Message[];
    onOpen: (message: Message) => void;
    onReply: (id: string) => void;
    onDelete: (id: string) => void;
};

export function MessagesTable({
                                  messages,
                                  onOpen,
                                  onReply,
                                  onDelete,
                              }: Props) {
    return (
        <div className="w-full min-w-0 overflow-x-auto">
        <Table className="min-w-[720px]">
            <TableHeader>
                <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Received</TableHead>
                    <TableHead className="text-right">
                        Actions
                    </TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {messages.map((message) => (
                    <TableRow
                        key={message.id}
                        className="cursor-pointer"
                        onClick={() => onOpen(message)}
                    >
                        <TableCell className="min-w-0">
                            <div className="flex min-w-0 items-center gap-2">
                                {message.status === "NEW" ? (
                                    <Mail className="h-4 w-4 shrink-0 text-primary" />
                                ) : (
                                    <MailOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                                )}

                                <div className="min-w-0">
                                    <p className="truncate font-medium">
                                        {message.name}
                                    </p>

                                    <p className="truncate text-xs text-muted-foreground">
                                        {message.email}
                                    </p>
                                </div>
                            </div>
                        </TableCell>

                        <TableCell className="min-w-0">
                            <span className="block truncate">
                                {message.subject || "No subject"}
                            </span>
                        </TableCell>

                        <TableCell>
                            <Badge
                                variant={
                                    statusVariant[
                                        message.status as MessageStatus
                                        ]
                                }
                            >
                                {message.status}
                            </Badge>
                        </TableCell>

                        <TableCell>
                            {formatDate(message.createdAt)}
                        </TableCell>

                        <TableCell
                            className="text-right"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MessageActions
                                onReply={() => onReply(message.id)}
                                onDelete={() => onDelete(message.id)}
                            />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}