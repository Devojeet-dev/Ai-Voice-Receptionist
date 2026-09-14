import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";

export interface StaffListFilters {
  page: number;
  limit: number;
  businessId?: string;
  role?: string;
  isActive?: boolean;
}

export const staffService = {
  async getAll(filters: StaffListFilters): Promise<{
    data: Prisma.StaffGetPayload<{ include: { business: true; services: true; availabilities: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { page, limit, businessId, role, isActive } = filters;

    const where: Prisma.StaffWhereInput = {
      ...(businessId ? { businessId } : {}),
      ...(role ? { role: { contains: role, mode: "insensitive" } } : {}),
      ...(typeof isActive === "boolean" ? { isActive } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.staff.findMany({
        where,
        include: { business: true, services: true, availabilities: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.staff.count({ where }),
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

  async getById(id: string): Promise<Prisma.StaffGetPayload<{
    include: {
      business: true;
      services: true;
      availabilities: true;
      appointments: { take: 10; orderBy: { createdAt: "desc" } };
    };
  }>> {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        business: true,
        services: true,
        availabilities: true,
        appointments: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });

    if (!staff) {
      throw new ApiError(404, "Staff member not found");
    }

    return staff;
  },

  async create(data: Prisma.StaffCreateInput): Promise<Prisma.StaffGetPayload<object>> {
    return prisma.staff.create({ data });
  },

  async update(id: string, data: Prisma.StaffUpdateInput): Promise<Prisma.StaffGetPayload<object>> {
    await this.ensureExists(id);
    return prisma.staff.update({ where: { id }, data });
  },

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await prisma.staff.delete({ where: { id } });
  },

  async ensureExists(id: string): Promise<void> {
    const staff = await prisma.staff.findUnique({ where: { id } });
    if (!staff) {
      throw new ApiError(404, "Staff member not found");
    }
  },
};
