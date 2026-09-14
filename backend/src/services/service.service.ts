import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";

export interface ServiceListFilters {
  page: number;
  limit: number;
  businessId?: string;
  name?: string;
  isActive?: boolean;
}

export const serviceService = {
  async getAll(filters: ServiceListFilters): Promise<{
    data: Prisma.ServiceGetPayload<{ include: { business: true; staff: true; appointments: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { page, limit, businessId, name, isActive } = filters;

    const where: Prisma.ServiceWhereInput = {
      ...(businessId ? { businessId } : {}),
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(typeof isActive === "boolean" ? { isActive } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { business: true, staff: true, appointments: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.service.count({ where }),
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

  async getById(id: string): Promise<Prisma.ServiceGetPayload<{
    include: {
      business: true;
      staff: true;
      appointments: { take: 10; orderBy: { createdAt: "desc" } };
    };
  }>> {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        business: true,
        staff: true,
        appointments: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });

    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    return service;
  },

  async create(data: Prisma.ServiceCreateInput): Promise<Prisma.ServiceGetPayload<object>> {
    return prisma.service.create({ data });
  },

  async update(id: string, data: Prisma.ServiceUpdateInput): Promise<Prisma.ServiceGetPayload<object>> {
    await this.ensureExists(id);
    return prisma.service.update({ where: { id }, data });
  },

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await prisma.service.delete({ where: { id } });
  },

  async ensureExists(id: string): Promise<void> {
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) {
      throw new ApiError(404, "Service not found");
    }
  },
};
