import { Prisma } from "../../generated/prisma/client.js";
import { NotFoundError } from "../../shared/errors.js";
import {
  buildPaginationMeta,
  parseOrderBy,
  parsePagination,
} from "../../shared/utils/pagination.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateExperienceInput,
  UpdateExperienceInput,
} from "./experience.schemas.js";

const SORTABLE_FIELDS = ["order", "startDate", "company", "createdAt"];

function toDate(value?: string | null) {
  if (!value) return null;
  return new Date(value);
}

function buildWhere(input: { search?: string }): Prisma.ExperienceWhereInput {
  const where: Prisma.ExperienceWhereInput = { isActive: true };

  if (input.search) {
    where.OR = [
      { company: { contains: input.search, mode: "insensitive" } },
      { role: { contains: input.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export const experienceService = {
  async list(input: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    includeInactive?: boolean;
  }) {
    const { page, limit, skip } = parsePagination(input);
    const where = input.includeInactive ? {} : buildWhere(input);
    const orderBy = parseOrderBy(
      input.sortBy ?? "order",
      input.sortOrder ?? "asc",
      SORTABLE_FIELDS,
    );

    const [items, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy as Prisma.ExperienceOrderByWithRelationInput,
      }),
      prisma.experience.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(total, page, limit) };
  },

  async getById(id: string) {
    const experience = await prisma.experience.findUnique({ where: { id } });
    if (!experience) throw new NotFoundError("Experience not found.");
    return experience;
  },

  async create(input: CreateExperienceInput) {
    return prisma.experience.create({
      data: {
        company: input.company,
        role: input.role,
        location: input.location ?? null,
        startDate: new Date(input.startDate),
        endDate: toDate(input.endDate),
        description: input.description,
        order: input.order ?? 0,
        isActive: input.isActive ?? true,
      },
    });
  },

  async update(id: string, input: UpdateExperienceInput) {
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Experience not found.");

    const data: Prisma.ExperienceUpdateInput = {};
    if (input.company !== undefined) data.company = input.company;
    if (input.role !== undefined) data.role = input.role;
    if (input.location !== undefined) data.location = input.location;
    if (input.startDate !== undefined) data.startDate = new Date(input.startDate);
    if (input.endDate !== undefined) data.endDate = toDate(input.endDate);
    if (input.description !== undefined) data.description = input.description;
    if (input.order !== undefined) data.order = input.order;
    if (input.isActive !== undefined) data.isActive = input.isActive;

    return prisma.experience.update({ where: { id }, data });
  },

  async delete(id: string) {
    const existing = await prisma.experience.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Experience not found.");
    await prisma.experience.delete({ where: { id } });
  },
};
