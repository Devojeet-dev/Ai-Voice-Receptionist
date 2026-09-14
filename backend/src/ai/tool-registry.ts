import { ToolDefinition, ToolRegistry } from "./types";
import { getBusinessInfoTool } from "./tools/business.tool";
import { getStaffTool } from "./tools/staff.tool";
import { getServicesTool } from "./tools/service.tool";
import { checkAvailabilityTool } from "./tools/availability.tool";
import { getCustomerAppointmentsTool } from "./tools/customer.tool";
import { createAppointmentTool, cancelAppointmentTool, rescheduleAppointmentTool } from "./tools/appointment.tool";

const registry: Record<string, ToolDefinition<unknown, unknown>> = {
  get_business_info: getBusinessInfoTool as ToolDefinition<unknown, unknown>,
  get_staff: getStaffTool as ToolDefinition<unknown, unknown>,
  get_services: getServicesTool as ToolDefinition<unknown, unknown>,
  check_availability: checkAvailabilityTool as ToolDefinition<unknown, unknown>,
  get_customer_appointments: getCustomerAppointmentsTool as ToolDefinition<unknown, unknown>,
  create_appointment: createAppointmentTool as ToolDefinition<unknown, unknown>,
  cancel_appointment: cancelAppointmentTool as ToolDefinition<unknown, unknown>,
  reschedule_appointment: rescheduleAppointmentTool as ToolDefinition<unknown, unknown>,
};

export const toolRegistry: ToolRegistry = registry;
export const toolNames = Object.keys(toolRegistry);
