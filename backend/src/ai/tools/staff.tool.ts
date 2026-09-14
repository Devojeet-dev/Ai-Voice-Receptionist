import { z } from "zod";
import { staffService } from "../../services/staff.service";
import { ToolDefinition } from "../types";

const inputSchema = z.object({
  businessId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  role: z.string().trim().min(1).optional(),
  isActive: z.boolean().optional().default(true),
});

export const getStaffTool: ToolDefinition<z.infer<typeof inputSchema>, unknown> = {
  name: "get_staff",
  description: "Find staff members by business, name, role, or active status.",
  inputSchema,
  execute: async (input) => {
    const result = await staffService.getAll({
      page: 1,
      limit: 20,
      businessId: input.businessId,
      role: input.role,
      isActive: input.isActive,
    });

    if (input.name) {
      const staff = result.data.filter((item) =>
        item.name.toLowerCase().includes(input.name!.toLowerCase())
      );
      return staff;
    }

    return result.data;
  },
};
