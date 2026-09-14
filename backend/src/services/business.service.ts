import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";

export interface BusinessListFilters {
  page: number;
  limit: number;
  name?: string;
  industry?: string;
  email?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const businessService = {
  async getAll(filters: BusinessListFilters): Promise<PaginatedResult<Prisma.BusinessGetPayload<object>>> {
    const { page, limit, name, industry, email } = filters;

    const where: Prisma.BusinessWhereInput = {
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(industry ? { industry: { contains: industry, mode: "insensitive" } } : {}),
      ...(email ? { email: { contains: email, mode: "insensitive" } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.business.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async getById(id: string): Promise<Prisma.BusinessGetPayload<{
    include: {
      staff: true;
      services: true;
      appointments: { take: 10; orderBy: { createdAt: "desc" } };
      conversations: { take: 10; orderBy: { createdAt: "desc" } };
    };
  }>> {
    const business = await prisma.business.findUnique({
      where: { id },
      include: {
        staff: true,
        services: true,
        appointments: { take: 10, orderBy: { createdAt: "desc" } },
        conversations: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });

    if (!business) {
      throw new ApiError(404, "Business not found");
    }

    return business;
  },

  async create(data: Prisma.BusinessCreateInput): Promise<Prisma.BusinessGetPayload<object>> {
    return prisma.business.create({ data });
  },

  async update(
    id: string,
    data: Prisma.BusinessUpdateInput
  ): Promise<Prisma.BusinessGetPayload<object>> {
    await this.ensureExists(id);

    return prisma.business.update({
      where: { id },
      data,
    });
  },

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await prisma.business.delete({ where: { id } });
  },

  async ensureExists(id: string): Promise<void> {
    const business = await prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new ApiError(404, "Business not found");
    }
  },
};
