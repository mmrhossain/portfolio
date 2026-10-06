
import {Prisma} from "../../../src/generated/prisma/client.js"
import { ConflictError, NotFoundError } from "../../shared/errors.js";
import {
  buildPaginationMeta,
  parseOrderBy,
  parsePagination,
} from "../../shared/utils/pagination.js";
import { randomSlugSuffix, slugify } from "../../shared/utils/slugify.js";
import { wordCount } from "../../shared/utils/rich-text.js";
import { prisma } from "../../lib/prisma.js";
import type { CreateBlogInput, UpdateBlogInput } from "./blogs.schemas.js";

const SORTABLE_FIELDS = ["createdAt", "updatedAt", "publishedAt", "title"];

function buildWhere(input: {
  search?: string;
  category?: string;
  status?: string;
  publicOnly?: boolean;
}): Prisma.BlogWhereInput {
  const where: Prisma.BlogWhereInput = {};

  if (input.publicOnly) {
    where.status = "PUBLISHED";
    where.publishedAt = { lte: new Date() };
  }

  if (!input.publicOnly && input.status) {
    where.status = input.status as any;
  }

  if (input.category) {
    where.category = { equals: input.category, mode: "insensitive" };
  }

  if (input.search) {
    where.OR = [
      { title: { contains: input.search, mode: "insensitive" } },
      { excerpt: { contains: input.search, mode: "insensitive" } },
      { tags: { has: input.search } },
    ];
  }

  return where;
}

async function resolveUniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${randomSlugSuffix(4)}`;
    const existing = await prisma.blog.findUnique({
      where: { slug: candidate },
    });
    if (!existing) return candidate;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export const blogsService = {
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
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
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy as Prisma.BlogOrderByWithRelationInput,
      }),
      prisma.blog.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(total, page, limit) };
  },

  async getBySlug(slug: string, publicOnly = false, includeContent = false) {
    const blog = await prisma.blog.findUnique({
      where: { slug },
      ...(includeContent
        ? {}
        : {
            select: {
              id: true,
              title: true,
              slug: true,
              excerpt: true,
              coverImage: true,
              category: true,
              tags: true,
              readTime: true,
              publishedAt: true,
              createdAt: true,
              updatedAt: true,
              author: { select: { id: true, name: true, avatarUrl: true } },
            },
          }),
    });
    if (
      !blog ||
      (publicOnly && (blog.status !== "PUBLISHED" || !blog.publishedAt))
    ) {
      throw new NotFoundError("Blog not found.");
    }
    return blog;
  },

  async getById(id: string) {
    const blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) throw new NotFoundError("Blog not found.");
    return blog;
  },

  async create(input: CreateBlogInput, authorId: string) {
    const slug = await resolveUniqueSlug(input.title);
    const readTime =
      input.readTime ??
      Math.max(1, Math.ceil(wordCount(input.content) / 200));
    return prisma.blog.create({
      data: {
        ...input,
        content: input.content as Prisma.InputJsonValue,
        slug,
        readTime,
        author: { connect: { id: authorId } },
        publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      },
    });
  },

  async update(id: string, input: UpdateBlogInput) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Blog not found.");

    const { content, ...rest } = input;
    const data: Prisma.BlogUpdateInput = {
      ...rest,
      ...(content !== undefined
        ? { content: content as Prisma.InputJsonValue }
        : {}),
    };

    if (input.title && input.title !== existing.title) {
      const slugCandidate = slugify(input.title);
      const clash = await prisma.blog.findUnique({
        where: { slug: slugCandidate },
      });
      if (clash && clash.id !== id) {
        throw new ConflictError("A blog with this title already exists.");
      }
      data.slug = slugCandidate;
    }

    if (input.status === "PUBLISHED" && existing.status !== "PUBLISHED") {
      data.publishedAt = new Date();
    }

    return prisma.blog.update({ where: { id }, data });
  },

  async delete(id: string) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Blog not found.");
    await prisma.blog.delete({ where: { id } });
  },

  async getStats() {
    const [total, published, drafts, categories] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { status: "PUBLISHED" } }),
      prisma.blog.count({ where: { status: "DRAFT" } }),
      prisma.blog.findMany({
        where: { status: "PUBLISHED" },
        skip: 0,
        take: 100,
        orderBy: { publishedAt: "desc" },
      }),
    ]);

    const categoryCount = new Map<string, number>();
    for (const blog of categories) {
      const key = blog.category;
      categoryCount.set(key, (categoryCount.get(key) ?? 0) + 1);
    }

    return {
      total,
      published,
      drafts,
      categories: Array.from(categoryCount, ([name, count]) => ({
        name,
        count,
      })),
    };
  },
};
