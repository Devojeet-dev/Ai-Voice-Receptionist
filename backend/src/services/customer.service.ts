import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";

export interface CustomerListFilters {
  page: number;
  limit: number;
  name?: string;
  phone?: string;
  email?: string;
}

export const customerService = {
  async getAll(filters: CustomerListFilters): Promise<{
    data: Prisma.CustomerGetPayload<{ include: { appointments: true; conversations: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { page, limit, name, phone, email } = filters;

    const where: Prisma.CustomerWhereInput = {
      ...(name ? { name: { contains: name, mode: "insensitive" } } : {}),
      ...(phone ? { phone: { contains: phone, mode: "insensitive" } } : {}),
      ...(email ? { email: { contains: email, mode: "insensitive" } } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: { appointments: true, conversations: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
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

  async getById(id: string): Promise<Prisma.CustomerGetPayload<{
    include: {
      appointments: { take: 10; orderBy: { createdAt: "desc" } };
      conversations: { take: 10; orderBy: { createdAt: "desc" } };
    };
  }>> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        appointments: { take: 10, orderBy: { createdAt: "desc" } },
        conversations: { take: 10, orderBy: { createdAt: "desc" } },
      },
    });

    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }

    return customer;
  },

  async findByPhone(phone: string): Promise<Prisma.CustomerGetPayload<object> | null> {
    const normalizedPhone = phone.trim();
    if (!normalizedPhone) {
      return null;
    }

    return prisma.customer.findFirst({
      where: {
        phone: {
          contains: normalizedPhone,
          mode: "insensitive",
        },
      },
    });
  },

  async findByPhoneOrName(input: { phone?: string; name?: string }): Promise<Prisma.CustomerGetPayload<object> | null> {
    const { phone, name } = input;

    if (phone) {
      const customer = await this.findByPhone(phone);
      if (customer) return customer;
    }

    if (name) {
      return prisma.customer.findFirst({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      });
    }

    return null;
  },

  async create(data: Prisma.CustomerCreateInput): Promise<Prisma.CustomerGetPayload<object>> {
    return prisma.customer.create({ data });
  },

  async update(id: string, data: Prisma.CustomerUpdateInput): Promise<Prisma.CustomerGetPayload<object>> {
    await this.ensureExists(id);
    return prisma.customer.update({ where: { id }, data });
  },

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await prisma.customer.delete({ where: { id } });
  },

  async ensureExists(id: string): Promise<void> {
    const customer = await prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new ApiError(404, "Customer not found");
    }
  },
};
