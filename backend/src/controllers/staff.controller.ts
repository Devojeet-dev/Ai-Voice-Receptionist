import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
  getParamId,
  parsePagination,
  staffCreateSchema,
  staffUpdateSchema,
  validateBody,
} from "../validators";
import { staffService } from "../services/staff.service";

export const staffController = {
  getAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const result = await staffService.getAll({
      page: pagination.page,
      limit: pagination.limit,
      businessId: typeof req.query.businessId === "string" ? req.query.businessId : undefined,
      role: typeof req.query.role === "string" ? req.query.role : undefined,
      isActive: typeof req.query.isActive === "string" ? req.query.isActive === "true" : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result.data, "Staff fetched successfully", result.meta)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    const staff = await staffService.getById(id);
    res.status(200).json(new ApiResponse(200, staff, "Staff fetched successfully"));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(staffCreateSchema, req.body);
    const { businessId, ...rest } = payload;
    const staff = await staffService.create({
      ...rest,
      business: { connect: { id: businessId } },
    });
    res.status(201).json(new ApiResponse(201, staff, "Staff created successfully"));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(staffUpdateSchema, req.body);
    const id = getParamId(req.params.id);
    const { businessId, ...rest } = payload;
    const staff = await staffService.update(id, {
      ...rest,
      ...(businessId ? { business: { connect: { id: businessId } } } : {}),
    });
    res.status(200).json(new ApiResponse(200, staff, "Staff updated successfully"));
  }),

  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    await staffService.remove(id);
    res.status(200).json(new ApiResponse(200, null, "Staff deleted successfully"));
  }),
};
