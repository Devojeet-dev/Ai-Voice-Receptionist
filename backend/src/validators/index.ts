import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});

export type PaginationValues = z.infer<typeof paginationSchema>;

export const parsePagination = (
  query: Record<string, string | string[] | undefined>
): PaginationValues => {
  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const rawLimit = Array.isArray(query.limit) ? query.limit[0] : query.limit;

  const page = Number(rawPage ?? "1");
  const limit = Number(rawLimit ?? "10");

  return paginationSchema.parse({
    page: Number.isFinite(page) ? page : 1,
    limit: Number.isFinite(limit) ? limit : 10,
  });
};

export const validateBody = <T>(schema: z.ZodType<T>, data: unknown): T => {
  return schema.parse(data);
};

export const validateQuery = <T>(schema: z.ZodType<T>, data: unknown): T => {
  return schema.parse(data);
};

export const getParamId = (value: string | string[] | undefined): string => {
  const normalized = Array.isArray(value) ? value[0] : value;

  if (!normalized || normalized.trim() === "") {
    throw new Error("Resource ID is required");
  }

  return normalized;
};

export const businessCreateSchema = z.object({
  name: z.string().trim().min(1, "Business name is required").max(255),
  industry: z.string().trim().min(1, "Industry is required").max(255),
  phone: z.string().trim().max(50).optional().nullable(),
  email: z.string().trim().email("Invalid email format").max(255).optional().nullable(),
  address: z.string().trim().max(500).optional().nullable(),
  description: z.string().trim().max(2000).optional().nullable(),
});

export const businessUpdateSchema = businessCreateSchema.partial();

export const staffCreateSchema = z.object({
  businessId: z.string().trim().min(1, "Business ID is required"),
  name: z.string().trim().min(1, "Staff name is required").max(255),
  role: z.string().trim().min(1, "Role is required").max(255),
  bio: z.string().trim().max(2000).optional().nullable(),
  isActive: z.boolean().optional().default(true),
});

export const staffUpdateSchema = staffCreateSchema.partial();

export const serviceCreateSchema = z.object({
  businessId: z.string().trim().min(1, "Business ID is required"),
  name: z.string().trim().min(1, "Service name is required").max(255),
  description: z.string().trim().max(2000).optional().nullable(),
  durationMinutes: z.coerce.number().int().min(1, "Duration must be at least 1 minute"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  isActive: z.boolean().optional().default(true),
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const customerCreateSchema = z.object({
  name: z.string().trim().min(1, "Customer name is required").max(255),
  phone: z.string().trim().min(5, "Phone number is required").max(50),
  email: z.string().trim().email("Invalid email format").max(255).optional().nullable(),
});

export const customerUpdateSchema = customerCreateSchema.partial();

export const appointmentStatusSchema = z.enum([
  "BOOKED",
  "CANCELLED",
  "COMPLETED",
  "NO_SHOW",
]);

export const appointmentCreateSchema = z
  .object({
    businessId: z.string().trim().min(1, "Business ID is required"),
    customerId: z.string().trim().min(1, "Customer ID is required"),
    staffId: z.string().trim().min(1, "Staff ID is required"),
    serviceId: z.string().trim().min(1, "Service ID is required"),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    status: appointmentStatusSchema.optional().default("BOOKED"),
    notes: z.string().trim().max(2000).optional().nullable(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const appointmentUpdateSchema = appointmentCreateSchema.partial();

export const dayOfWeekSchema = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

export const availabilityCreateSchema = z
  .object({
    staffId: z.string().trim().min(1, "Staff ID is required"),
    dayOfWeek: dayOfWeekSchema,
    startTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid start time format"),
    endTime: z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Invalid end time format"),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });

export const availabilityUpdateSchema = availabilityCreateSchema.partial();

export const conversationCreateSchema = z.object({
  businessId: z.string().trim().min(1, "Business ID is required"),
  customerId: z.string().trim().min(1, "Customer ID is required"),
  transcript: z.string().trim().min(1, "Transcript is required").max(20000),
  intent: z.string().trim().max(255).optional().nullable(),
  response: z.string().trim().max(20000).optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
});

export const conversationUpdateSchema = conversationCreateSchema.partial();
