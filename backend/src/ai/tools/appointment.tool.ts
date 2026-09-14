import { z } from "zod";
import { appointmentService } from "../../services/appointment.service";
import { customerService } from "../../services/customer.service";
import { ToolDefinition } from "../types";

const createAppointmentSchema = z.object({
  businessId: z.string().trim().min(1),
  customerId: z.string().trim().min(1).optional(),
  customerPhone: z.string().trim().min(1).optional(),
  customerName: z.string().trim().min(1).optional(),
  staffId: z.string().trim().min(1),
  serviceId: z.string().trim().min(1),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  notes: z.string().trim().max(2000).optional(),
});

const cancelAppointmentSchema = z.object({
  appointmentId: z.string().trim().min(1),
  customerId: z.string().trim().min(1).optional(),
  businessId: z.string().trim().min(1).optional(),
});

const rescheduleAppointmentSchema = z.object({
  appointmentId: z.string().trim().min(1),
  customerId: z.string().trim().min(1).optional(),
  businessId: z.string().trim().min(1).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const createAppointmentTool: ToolDefinition<z.infer<typeof createAppointmentSchema>, unknown> = {
  name: "create_appointment",
  description: "Create a validated appointment after checking availability and customer/staff/service constraints.",
  inputSchema: createAppointmentSchema,
  execute: async (input) => {
    const customerId = input.customerId ?? (await customerService.findByPhoneOrName({
      phone: input.customerPhone,
      name: input.customerName,
    }))?.id;

    if (!customerId) {
      throw new Error("Customer could not be resolved from the supplied details");
    }

    const availability = await appointmentService.checkAvailability({
      businessId: input.businessId,
      staffId: input.staffId,
      serviceId: input.serviceId,
      startTime: input.startTime,
      endTime: input.endTime,
    });

    if (!availability.available) {
      throw new Error("Requested slot is unavailable");
    }

    return appointmentService.create({
      business: { connect: { id: input.businessId } },
      customer: { connect: { id: customerId } },
      staff: { connect: { id: input.staffId } },
      service: { connect: { id: input.serviceId } },
      startTime: input.startTime,
      endTime: input.endTime,
      notes: input.notes ?? null,
      status: "BOOKED",
    });
  },
};

export const cancelAppointmentTool: ToolDefinition<z.infer<typeof cancelAppointmentSchema>, unknown> = {
  name: "cancel_appointment",
  description: "Cancel an existing appointment after validating the customer and business association.",
  inputSchema: cancelAppointmentSchema,
  execute: async (input) => {
    return appointmentService.cancelAppointment({
      appointmentId: input.appointmentId,
      customerId: input.customerId,
      businessId: input.businessId,
    });
  },
};

export const rescheduleAppointmentTool: ToolDefinition<z.infer<typeof rescheduleAppointmentSchema>, unknown> = {
  name: "reschedule_appointment",
  description: "Reschedule an existing appointment after validating the new slot.",
  inputSchema: rescheduleAppointmentSchema,
  execute: async (input) => {
    return appointmentService.rescheduleAppointment({
      appointmentId: input.appointmentId,
      customerId: input.customerId,
      businessId: input.businessId,
      startTime: input.startTime,
      endTime: input.endTime,
    });
  },
};
