import { z } from "zod";
import { appointmentService } from "../../services/appointment.service";
import { ToolDefinition } from "../types";

const inputSchema = z.object({
  businessId: z.string().trim().min(1),
  staffId: z.string().trim().min(1).optional(),
  serviceId: z.string().trim().min(1).optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
});

export const checkAvailabilityTool: ToolDefinition<z.infer<typeof inputSchema>, unknown> = {
  name: "check_availability",
  description: "Check whether a requested appointment slot is available and return alternatives if unavailable.",
  inputSchema,
  execute: async (input) => {
    return appointmentService.checkAvailability({
      businessId: input.businessId,
      staffId: input.staffId,
      serviceId: input.serviceId,
      startTime: input.startTime,
      endTime: input.endTime,
    });
  },
};
