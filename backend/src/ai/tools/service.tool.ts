import { z } from "zod";
import { serviceService } from "../../services/service.service";
import { ToolDefinition } from "../types";

const inputSchema = z.object({
  businessId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional().default(true),
});

export const getServicesTool: ToolDefinition<z.infer<typeof inputSchema>, unknown> = {
  name: "get_services",
  description: "List and search services with duration, price, and description details.",
  inputSchema,
  execute: async (input) => {
    const result = await serviceService.getAll({
      page: 1,
      limit: 20,
      businessId: input.businessId,
      name: input.name,
      isActive: input.isActive,
    });

    return result.data;
  },
};
