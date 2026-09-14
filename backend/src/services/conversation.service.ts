import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";

export interface ConversationListFilters {
  page: number;
  limit: number;
  businessId?: string;
  customerId?: string;
}

export const conversationService = {
  async getAll(filters: ConversationListFilters): Promise<{
    data: Prisma.ConversationGetPayload<{ include: { business: true; customer: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { page, limit, businessId, customerId } = filters;

    const where: Prisma.ConversationWhereInput = {
      ...(businessId ? { businessId } : {}),
      ...(customerId ? { customerId } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: { business: true, customer: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.conversation.count({ where }),
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

  async getById(id: string): Promise<Prisma.ConversationGetPayload<{ include: { business: true; customer: true } }>> {
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { business: true, customer: true },
    });

    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }

    return conversation;
  },

  async getByCustomer(customerId: string, page: number, limit: number): Promise<{
    data: Prisma.ConversationGetPayload<{ include: { business: true; customer: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const where: Prisma.ConversationWhereInput = { customerId };

    const [items, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: { business: true, customer: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.conversation.count({ where }),
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

  async getByBusiness(businessId: string, page: number, limit: number): Promise<{
    data: Prisma.ConversationGetPayload<{ include: { business: true; customer: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const where: Prisma.ConversationWhereInput = { businessId };

    const [items, total] = await Promise.all([
      prisma.conversation.findMany({
        where,
        include: { business: true, customer: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.conversation.count({ where }),
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

  async create(data: Prisma.ConversationCreateInput): Promise<Prisma.ConversationGetPayload<object>> {
    return prisma.conversation.create({ data, include: { business: true, customer: true } });
  },

  async update(id: string, data: Prisma.ConversationUpdateInput): Promise<Prisma.ConversationGetPayload<object>> {
    await this.ensureExists(id);
    return prisma.conversation.update({ where: { id }, data, include: { business: true, customer: true } });
  },

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await prisma.conversation.delete({ where: { id } });
  },

  async ensureExists(id: string): Promise<void> {
    const conversation = await prisma.conversation.findUnique({ where: { id } });
    if (!conversation) {
      throw new ApiError(404, "Conversation not found");
    }
  },
};
