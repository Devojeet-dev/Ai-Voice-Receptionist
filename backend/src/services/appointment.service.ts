import { Prisma } from "@prisma/client";
import prisma from "../config/database";
import { ApiError } from "../utils/ApiError";

export interface AppointmentListFilters {
  page: number;
  limit: number;
  businessId?: string;
  customerId?: string;
  staffId?: string;
  serviceId?: string;
  status?: "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
}

export const appointmentService = {
  async getAll(filters: AppointmentListFilters): Promise<{
    data: Prisma.AppointmentGetPayload<{ include: { business: true; customer: true; staff: true; service: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const { page, limit, businessId, customerId, staffId, serviceId, status } = filters;

    const where: Prisma.AppointmentWhereInput = {
      ...(businessId ? { businessId } : {}),
      ...(customerId ? { customerId } : {}),
      ...(staffId ? { staffId } : {}),
      ...(serviceId ? { serviceId } : {}),
      ...(status ? { status } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: { business: true, customer: true, staff: true, service: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: "asc" },
      }),
      prisma.appointment.count({ where }),
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

  async getById(id: string): Promise<Prisma.AppointmentGetPayload<{
    include: {
      business: true;
      customer: true;
      staff: true;
      service: true;
    };
  }>> {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { business: true, customer: true, staff: true, service: true },
    });

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    return appointment;
  },

  async getByStaff(staffId: string, page: number, limit: number): Promise<{
    data: Prisma.AppointmentGetPayload<{ include: { business: true; customer: true; service: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.getScopedAppointments({ staffId }, page, limit);
  },

  async getByCustomer(customerId: string, page: number, limit: number): Promise<{
    data: Prisma.AppointmentGetPayload<{ include: { business: true; staff: true; service: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.getScopedAppointments({ customerId }, page, limit);
  },

  async getByBusiness(businessId: string, page: number, limit: number): Promise<{
    data: Prisma.AppointmentGetPayload<{ include: { customer: true; staff: true; service: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    return this.getScopedAppointments({ businessId }, page, limit);
  },

  async create(data: Prisma.AppointmentCreateInput): Promise<Prisma.AppointmentGetPayload<object>> {
    const businessId = data.business?.connect?.id;
    const customerId = data.customer?.connect?.id;
    const staffId = data.staff?.connect?.id;
    const serviceId = data.service?.connect?.id;

    if (!businessId || !customerId || !staffId || !serviceId) {
      throw new ApiError(400, "Business, customer, staff, and service relationships are required");
    }

    const [business, customer, staff, service] = await Promise.all([
      prisma.business.findUnique({ where: { id: businessId } }),
      prisma.customer.findUnique({ where: { id: customerId } }),
      prisma.staff.findUnique({ where: { id: staffId } }),
      prisma.service.findUnique({ where: { id: serviceId } }),
    ]);

    if (!business) throw new ApiError(404, "Business not found");
    if (!customer) throw new ApiError(404, "Customer not found");
    if (!staff) throw new ApiError(404, "Staff not found");
    if (!service) throw new ApiError(404, "Service not found");

    if (staff.businessId !== business.id) {
      throw new ApiError(400, "Staff does not belong to the provided business");
    }

    if (service.businessId !== business.id) {
      throw new ApiError(400, "Service does not belong to the provided business");
    }

    return prisma.appointment.create({
      data: {
        ...data,
        startTime: new Date(data.startTime as Date),
        endTime: new Date(data.endTime as Date),
      },
      include: { business: true, customer: true, staff: true, service: true },
    });
  },

  async update(id: string, data: Prisma.AppointmentUpdateInput): Promise<Prisma.AppointmentGetPayload<object>> {
    await this.ensureExists(id);

    const safeData = {
      ...data,
      ...(data.startTime ? { startTime: new Date(data.startTime as unknown as string | Date) } : {}),
      ...(data.endTime ? { endTime: new Date(data.endTime as unknown as string | Date) } : {}),
    };

    return prisma.appointment.update({
      where: { id },
      data: safeData,
      include: { business: true, customer: true, staff: true, service: true },
    });
  },

  async remove(id: string): Promise<void> {
    await this.ensureExists(id);
    await prisma.appointment.delete({ where: { id } });
  },

  async ensureExists(id: string): Promise<void> {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }
  },

  async getScopedAppointments(
    where: Prisma.AppointmentWhereInput,
    page: number,
    limit: number
  ): Promise<{
    data: Prisma.AppointmentGetPayload<{ include: { business: true; customer: true; staff: true; service: true } }>[];
    meta: { page: number; limit: number; total: number; totalPages: number };
  }> {
    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: { business: true, customer: true, staff: true, service: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: "asc" },
      }),
      prisma.appointment.count({ where }),
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
};
