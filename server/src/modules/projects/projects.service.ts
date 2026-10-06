import {Prisma} from "../../generated/prisma/client.js"
import { ConflictError, NotFoundError } from "../../shared/errors.js";
import {
  buildPaginationMeta,
  parseOrderBy,
  parsePagination,
} from "../../shared/utils/pagination.js";
import { randomSlugSuffix, slugify } from "../../shared/utils/slugify.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "./projects.schemas.js";

const SORTABLE_FIELDS = ["createdAt", "updatedAt", "order", "title"];

function buildWhere(input: {
  search?: string;
  status?: string;
  featured?: string;
  publicOnly?: boolean;
}): Prisma.ProjectWhereInput {

  const where: Prisma.ProjectWhereInput = {};

  if (input.publicOnly) {
    where.status = "PUBLISHED";
  } else if (input.status) {
    where.status = input.status as Prisma.ProjectWhereInput["status"];
  }

  if (input.featured === "true") where.featured = true;
  if (input.featured === "false") where.featured = false;

  if (input.search) {
    where.OR = [{ title: { contains: input.search, mode: "insensitive" } }];
  }

  return where;
}

async function resolveUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${randomSlugSuffix(4)}`;
    const existing = await prisma.project.findUnique({
      where: { slug: candidate },
    });
    if (!existing) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export const projectsService = {
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    featured?: string;
    sortBy?: string;
    sortOrder?: string;
    publicOnly?: boolean;
  }) {
    const { page, limit, skip } = parsePagination(input);
    const where = buildWhere(input);
    const orderBy = parseOrderBy(
      input.sortBy,
      input.sortOrder,
      SORTABLE_FIELDS,
    );

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy as Prisma.ProjectOrderByWithRelationInput,
      }),
      prisma.project.count({ where }),
    ]);


    return { items, meta: buildPaginationMeta(total, page, limit) };
  },

  async getBySlug(slug: string, publicOnly = false) {
    const project = await prisma.project.findUnique({ where: { slug } });
    if (!project || (publicOnly && project.status !== "PUBLISHED")) {
      throw new NotFoundError("Project not found.");
    }
    return project;
  },

  async getById(id: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) throw new NotFoundError("Project not found.");
    return project;
  },

  async create(input: CreateProjectInput) {
    const slug = await resolveUniqueSlug(input.title);
    return prisma.project.create({
      data: {
        ...input,
        description: input.description as Prisma.InputJsonValue,
        longDescription:
          input.longDescription == null
            ? Prisma.DbNull
            : (input.longDescription as Prisma.InputJsonValue),
        slug,
      },
    });
  },

  async update(id: string, input: UpdateProjectInput) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Project not found.");

    const { description, longDescription, ...rest } = input;
    const data: Prisma.ProjectUpdateInput = {
      ...rest,
      ...(description !== undefined
        ? { description: description as Prisma.InputJsonValue }
        : {}),
      ...(longDescription !== undefined
        ? {
            longDescription:
              longDescription == null
                ? Prisma.DbNull
                : (longDescription as Prisma.InputJsonValue),
          }
        : {}),
    };
    if (input.title && input.title !== existing.title) {
      const existingSlug = await prisma.project.findUnique({
        where: { slug: slugify(input.title) },
      });
      if (existingSlug && existingSlug.id !== id) {
        throw new ConflictError("A project with this title already exists.");
      }
      data.slug = slugify(input.title);
    }

    return prisma.project.update({ where: { id }, data });
  },

  async delete(id: string) {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Project not found.");
    await prisma.project.delete({ where: { id } });
  },

  async getStats() {
    const [total, published, featured, drafts] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { status: "PUBLISHED" } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.project.count({ where: { status: "DRAFT" } }),
    ]);
    return { total, published, featured, drafts };
  },
};
