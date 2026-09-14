import { z } from "zod";
import { businessService } from "../../services/business.service";
import { ToolDefinition } from "../types";

const inputSchema = z.object({
  businessId: z.string().trim().min(1).optional(),
  name: z.string().trim().min(1).optional(),
  industry: z.string().trim().min(1).optional(),
  email: z.string().trim().min(1).optional(),
  includeDetails: z.boolean().optional().default(false),
});

export const getBusinessInfoTool: ToolDefinition<z.infer<typeof inputSchema>, unknown> = {
  name: "get_business_info",
  description: "Fetch business information for a given business or business search filters.",
  inputSchema,
  execute: async (input) => {
    const { businessId, name, industry, email, includeDetails } = input;

    if (businessId) {
      const business = await businessService.getById(businessId);
      return {
        business,
        includeDetails,
      };
    }

    const result = await businessService.getAll({
      page: 1,
      limit: 10,
      name,
      industry,
      email,
    });

    return result.data;
  },
};
