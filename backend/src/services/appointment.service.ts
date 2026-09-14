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

  async checkAvailability(input: {
    businessId: string;
    staffId?: string;
    serviceId?: string;
    startTime: Date | string;
    endTime: Date | string;
    excludeAppointmentId?: string;
  }): Promise<{
    available: boolean;
    reason: string;
    conflicts: Array<{
      id: string;
      staffId: string;
      startTime: Date;
      endTime: Date;
      status: "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
    }>;
    suggestions: Array<{ startTime: string; endTime: string }>;
  }> {
    const requestedStart = new Date(input.startTime);
    const requestedEnd = new Date(input.endTime);

    if (Number.isNaN(requestedStart.getTime()) || Number.isNaN(requestedEnd.getTime())) {
      throw new ApiError(400, "Invalid appointment time supplied");
    }

    if (requestedEnd <= requestedStart) {
      throw new ApiError(400, "Appointment end time must be later than start time");
    }

    const business = await prisma.business.findUnique({ where: { id: input.businessId } });
    if (!business) {
      throw new ApiError(404, "Business not found");
    }

    const staff = input.staffId ? await prisma.staff.findUnique({ where: { id: input.staffId } }) : null;
    if (input.staffId && !staff) {
      throw new ApiError(404, "Staff not found");
    }

    if (staff && staff.businessId !== input.businessId) {
      throw new ApiError(400, "Staff does not belong to the provided business");
    }

    const service = input.serviceId ? await prisma.service.findUnique({ where: { id: input.serviceId } }) : null;
    if (input.serviceId && !service) {
      throw new ApiError(404, "Service not found");
    }

    if (service && service.businessId !== input.businessId) {
      throw new ApiError(400, "Service does not belong to the provided business");
    }

    if (staff && service) {
      const staffServiceLink = await prisma.staffService.findUnique({
        where: {
          staffId_serviceId: {
            staffId: staff.id,
            serviceId: service.id,
          },
        },
      });

      if (!staffServiceLink) {
        throw new ApiError(400, "Selected staff is not assigned to the selected service");
      }
    }

    const where: Prisma.AppointmentWhereInput = {
      status: { notIn: ["CANCELLED", "COMPLETED"] },
      ...(input.staffId ? { staffId: input.staffId } : {}),
      ...(input.excludeAppointmentId ? { NOT: { id: input.excludeAppointmentId } } : {}),
      AND: [
        { startTime: { lt: requestedEnd } },
        { endTime: { gt: requestedStart } },
      ],
    };

    const conflicts = await prisma.appointment.findMany({
      where,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        staffId: true,
        status: true,
      },
    });

    const hasConflict = conflicts.length > 0;
    const suggestions = hasConflict ? await this.generateAlternatives({
      businessId: input.businessId,
      staffId: input.staffId,
      serviceId: input.serviceId,
      startTime: requestedStart,
      endTime: requestedEnd,
      excludeAppointmentId: input.excludeAppointmentId,
    }) : [];

    return {
      available: !hasConflict,
      reason: hasConflict ? "Requested time overlaps with an existing appointment" : "Slot is available",
      conflicts: conflicts.map((conflict) => ({
        id: conflict.id,
        staffId: conflict.staffId,
        startTime: conflict.startTime,
        endTime: conflict.endTime,
        status: conflict.status,
      })),
      suggestions,
    };
  },

  async generateAlternatives(input: {
    businessId: string;
    staffId?: string;
    serviceId?: string;
    startTime: Date;
    endTime: Date;
    excludeAppointmentId?: string;
  }): Promise<Array<{ startTime: string; endTime: string }>> {
    const fallbackDurationMs = Math.max(30 * 60 * 1000, new Date(input.endTime).getTime() - new Date(input.startTime).getTime());
    const serviceDurationMs = input.serviceId
      ? (await prisma.service.findUnique({ where: { id: input.serviceId } }))?.durationMinutes
      : undefined;

    const slotDurationMs = serviceDurationMs ? serviceDurationMs * 60 * 1000 : fallbackDurationMs;
    const suggestions: Array<{ startTime: string; endTime: string }> = [];
    let cursor = new Date(input.startTime);

    for (let step = 0; step < 6; step += 1) {
      cursor = new Date(cursor.getTime() + 30 * 60 * 1000);
      const nextEnd = new Date(cursor.getTime() + slotDurationMs);

      const candidate = await this.checkAvailability({
        businessId: input.businessId,
        staffId: input.staffId,
        serviceId: input.serviceId,
        startTime: cursor,
        endTime: nextEnd,
        excludeAppointmentId: input.excludeAppointmentId,
      });

      if (candidate.available) {
        suggestions.push({
          startTime: cursor.toISOString(),
          endTime: nextEnd.toISOString(),
        });
      }

      if (suggestions.length >= 3) {
        break;
      }
    }

    return suggestions;
  },

  async cancelAppointment(input: {
    appointmentId: string;
    customerId?: string;
    businessId?: string;
  }): Promise<Prisma.AppointmentGetPayload<object>> {
    const appointment = await this.getById(input.appointmentId);

    if (input.customerId && appointment.customerId !== input.customerId) {
      throw new ApiError(403, "Appointment does not belong to the provided customer");
    }

    if (input.businessId && appointment.businessId !== input.businessId) {
      throw new ApiError(403, "Appointment does not belong to the provided business");
    }

    if (appointment.status === "CANCELLED") {
      throw new ApiError(400, "Appointment is already cancelled");
    }

    return prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: "CANCELLED" },
      include: { business: true, customer: true, staff: true, service: true },
    });
  },

  async rescheduleAppointment(input: {
    appointmentId: string;
    customerId?: string;
    businessId?: string;
    startTime: Date | string;
    endTime: Date | string;
  }): Promise<Prisma.AppointmentGetPayload<object>> {
    const appointment = await this.getById(input.appointmentId);

    if (input.customerId && appointment.customerId !== input.customerId) {
      throw new ApiError(403, "Appointment does not belong to the provided customer");
    }

    if (input.businessId && appointment.businessId !== input.businessId) {
      throw new ApiError(403, "Appointment does not belong to the provided business");
    }

    if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
      throw new ApiError(400, "Completed or cancelled appointments cannot be rescheduled");
    }

    const nextStart = new Date(input.startTime);
    const nextEnd = new Date(input.endTime);

    if (nextEnd <= nextStart) {
      throw new ApiError(400, "Rescheduled end time must be after start time");
    }

    const availability = await this.checkAvailability({
      businessId: appointment.businessId,
      staffId: appointment.staffId,
      serviceId: appointment.serviceId,
      startTime: nextStart,
      endTime: nextEnd,
      excludeAppointmentId: appointment.id,
    });

    if (!availability.available) {
      throw new ApiError(409, "Requested reschedule slot is unavailable", true);
    }

    return prisma.appointment.update({
      where: { id: appointment.id },
      data: {
        startTime: nextStart,
        endTime: nextEnd,
      },
      include: { business: true, customer: true, staff: true, service: true },
    });
  },
};
