import { z } from "zod";
import { customerService } from "../../services/customer.service";
import { ToolDefinition } from "../types";

const inputSchema = z.object({
  customerId: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
});

export const getCustomerAppointmentsTool: ToolDefinition<z.infer<typeof inputSchema>, unknown> = {
  name: "get_customer_appointments",
  description: "Find a customer's appointments using either the customer ID, phone number, or name.",
  inputSchema,
  execute: async (input) => {
    const customer = input.customerId
      ? await customerService.getById(input.customerId)
      : await customerService.findByPhoneOrName({
          phone: input.phone,
          name: input.name,
        });

    if (!customer) {
      return { customer: null, appointments: [] };
    }

    const appointments = await customerService.getById(customer.id);
    return {
      customer,
      appointments: appointments.appointments,
    };
  },
};
