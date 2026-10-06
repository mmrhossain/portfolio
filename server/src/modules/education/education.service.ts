import { Prisma } from "../../generated/prisma/client.js";
import { NotFoundError } from "../../shared/errors.js";
import {
  buildPaginationMeta,
  parseOrderBy,
  parsePagination,
} from "../../shared/utils/pagination.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateEducationInput,
  UpdateEducationInput,
} from "./education.schemas.js";

const SORTABLE_FIELDS = ["order", "startDate", "institution", "createdAt"];

function toDate(value?: string | null) {
  if (!value) return null;
  return new Date(value);
}

function buildWhere(input: { search?: string }): Prisma.EducationWhereInput {
  const where: Prisma.EducationWhereInput = { isActive: true };

  if (input.search) {
    where.OR = [
      { institution: { contains: input.search, mode: "insensitive" } },
      { degree: { contains: input.search, mode: "insensitive" } },
      { field: { contains: input.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export const educationService = {
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
      prisma.education.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy as Prisma.EducationOrderByWithRelationInput,
      }),
      prisma.education.count({ where }),
    ]);

    return { items, meta: buildPaginationMeta(total, page, limit) };
  },

  async getById(id: string) {
    const education = await prisma.education.findUnique({ where: { id } });
    if (!education) throw new NotFoundError("Education not found.");
    return education;
  },

  async create(input: CreateEducationInput) {
    return prisma.education.create({
      data: {
        institution: input.institution,
        degree: input.degree,
        field: input.field ?? null,
        location: input.location ?? null,
        startDate: new Date(input.startDate),
        endDate: toDate(input.endDate),
        description: input.description as Prisma.InputJsonValue,
        order: input.order ?? 0,
        isActive: input.isActive ?? true,
      },
    });
  },

  async update(id: string, input: UpdateEducationInput) {
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Education not found.");

    const data: Prisma.EducationUpdateInput = {};
    if (input.institution !== undefined) data.institution = input.institution;
    if (input.degree !== undefined) data.degree = input.degree;
    if (input.field !== undefined) data.field = input.field;
    if (input.location !== undefined) data.location = input.location;
    if (input.startDate !== undefined) data.startDate = new Date(input.startDate);
    if (input.endDate !== undefined) data.endDate = toDate(input.endDate);
    if (input.description !== undefined) {
      data.description = input.description as Prisma.InputJsonValue;
    }
    if (input.order !== undefined) data.order = input.order;
    if (input.isActive !== undefined) data.isActive = input.isActive;

    return prisma.education.update({ where: { id }, data });
  },

  async delete(id: string) {
    const existing = await prisma.education.findUnique({ where: { id } });
    if (!existing) throw new NotFoundError("Education not found.");
    await prisma.education.delete({ where: { id } });
  },
};
