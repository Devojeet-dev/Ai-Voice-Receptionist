import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
  availabilityCreateSchema,
  availabilityUpdateSchema,
  getParamId,
  parsePagination,
  validateBody,
} from "../validators";
import { availabilityService } from "../services/availability.service";

export const availabilityController = {
  getAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const result = await availabilityService.getAll({
      page: pagination.page,
      limit: pagination.limit,
      staffId: typeof req.query.staffId === "string" ? req.query.staffId : undefined,
      dayOfWeek: typeof req.query.dayOfWeek === "string" ? (req.query.dayOfWeek as "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY") : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result.data, "Availability fetched successfully", result.meta)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    const availability = await availabilityService.getById(id);
    res.status(200).json(new ApiResponse(200, availability, "Availability record fetched successfully"));
  }),

  getByStaff: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const staffId = getParamId(req.params.staffId);
    const result = await availabilityService.getByStaff(staffId, pagination.page, pagination.limit);
    res.status(200).json(new ApiResponse(200, result.data, "Staff availability fetched successfully", result.meta));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(availabilityCreateSchema, req.body);
    const { staffId, ...rest } = payload;
    const availability = await availabilityService.create({
      ...rest,
      staff: { connect: { id: staffId } },
    });
    res.status(201).json(new ApiResponse(201, availability, "Availability created successfully"));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(availabilityUpdateSchema, req.body);
    const id = getParamId(req.params.id);
    const { staffId, ...rest } = payload;
    const availability = await availabilityService.update(id, {
      ...rest,
      ...(staffId ? { staff: { connect: { id: staffId } } } : {}),
    });
    res.status(200).json(new ApiResponse(200, availability, "Availability updated successfully"));
  }),

  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    await availabilityService.remove(id);
    res.status(200).json(new ApiResponse(200, null, "Availability deleted successfully"));
  }),
};
