"use client";

import Image from "next/image";
import { FolderKanban } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/pagination";

import { ProjectActions } from "./project.actions";

import type { Project } from "@/types";

interface Props {
  data: any;
  onCreate: () => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  loading: boolean;
}

const statusVariant = {
  PUBLISHED: "success",
  DRAFT: "warning",
  ARCHIVED: "secondary",
} as const;

export function ProjectsTable({
                                data,
                                onEdit,
                                onDelete,
                                loading,
                              }: Props) {
  const projects = data?.data ?? [];
  const meta = data?.meta;

  return (
      <div className="w-full min-w-0 space-y-6">
        {/* Table responsive wrapper */}
        <div className="w-full min-w-0 overflow-x-auto rounded-2xl border">
          <Table className="min-w-[750px]">
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Action</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>

            <TableBody>
              {projects.map((project: Project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="flex min-w-0 gap-3">
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={56}
                            height={40}
                            className="h-[40px] w-[56px] shrink-0 object-cover"
                        />

                        <div className="min-w-0">
                          <p className="truncate font-medium">
                            {project.title}
                          </p>

                          <p className="truncate text-xs text-muted-foreground">
                            {project.tags.slice(0, 3).join(", ")}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                          variant={
                              statusVariant[
                                  project.status as keyof typeof statusVariant
                                  ] ?? "default"
                          }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                          variant={
                            project.featured
                                ? "accent"
                                : "outline"
                          }
                      >
                        {project.featured ? "Yes" : "No"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {new Date(
                          project.updatedAt
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                              variant="ghost"
                              size="icon"
                              disabled={loading}
                          >
                            <FolderKanban className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <ProjectActions
                              project={project}
                              onEdit={() => onEdit(project)}
                              onDelete={() => onDelete(project.id)}
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {meta && (
            <Pagination
                meta={meta}
                onPageChange={() => {}}
                className="py-4"
            />
        )}
      </div>
  );
}