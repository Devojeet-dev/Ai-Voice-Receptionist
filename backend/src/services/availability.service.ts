import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";

export interface AvailabilityListFilters {
  page: number;
  limit: number;
  staffId?: string;
  dayOfWeek?: "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";
}

export const availabilityService = {
  async getAll(filters: AvailabilityListFilters): Promise<{
    data: Prisma.AvailabilityGetPayload<{ include: { staff: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { page, limit, staffId, dayOfWeek } = filters;

    const where: Prisma.AvailabilityWhereInput = {
      ...(staffId ? { staffId } : {}),
      ...(dayOfWeek ? { dayOfWeek } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.availability.findMany({
        where,
        include: { staff: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ staffId: "asc" }, { dayOfWeek: "asc" }],
      }),
      prisma.availability.count({ where }),
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

  async getById(id: string): Promise<Prisma.AvailabilityGetPayload<{ include: { staff: true } }>> {
    const availability = await prisma.availability.findUnique({
      where: { id },
      include: { staff: true },
    });

    if (!availability) {
      throw new ApiError(404, "Availability record not found");
    }

    return availability;
  },

  async getByStaff(staffId: string, page: number, limit: number): Promise<{
    data: Prisma.AvailabilityGetPayload<{ include: { staff: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const where: Prisma.AvailabilityWhereInput = { staffId };

    const [items, total] = await Promise.all([
      prisma.availability.findMany({
        where,
        include: { staff: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { dayOfWeek: "asc" },
      }),
      prisma.availability.count({ where }),
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

  async create(data: Prisma.AvailabilityCreateInput): Promise<Prisma.AvailabilityGetPayload<object>> {
    const staffId = data.staff?.connect?.id;
    if (!staffId) {
      throw new ApiError(400, "Staff relationship is required");
    }

    const staff = await prisma.staff.findUnique({ where: { id: staffId } });
    if (!staff) {
      throw new ApiError(404, "Staff not found");
    }

    return prisma.availability.create({ data, include: { staff: true } });
  },

  async update(id: string, data: Prisma.AvailabilityUpdateInput): Promise<Prisma.AvailabilityGetPayload<object>> {
    await this.ensureExists(id);
    return prisma.availability.update({ where: { id }, data, include: { staff: true } });
  },

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await prisma.availability.delete({ where: { id } });
  },

  async ensureExists(id: string): Promise<void> {
    const availability = await prisma.availability.findUnique({ where: { id } });
    if (!availability) {
      throw new ApiError(404, "Availability record not found");
    }
  },
};
