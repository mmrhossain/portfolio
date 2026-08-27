
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { formatDateTime } from "@/lib/utils";
import EmptyLoader from "next/dist/build/webpack/loaders/empty-loader";
import {EmptyState} from "@/components/shared/empty-state";

interface Props {
  messages: any[];
}

export function RecentMessages({ messages }: Props) {
  
  return (
    <Card >
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Recent messages</CardTitle>

          <CardDescription>Latest inquiries</CardDescription>
        </div>

        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/messages">
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {messages?.length > 0 ? messages?.map((message) => (
            <div key={message.id} className="mb-3 rounded-xl border p-3">
              <p className="font-medium break-words">{message.name}</p>

              <p className="line-clamp-2 break-words text-xs text-muted-foreground">{message.body}</p>

              <p className="text-xs text-muted-foreground">
                {formatDateTime(message.createdAt)}
              </p>

              <Badge>{message.status}</Badge>
            </div>
        )): <EmptyState className={"py-8"}/>}
      </CardContent>
    </Card>
  );
}
