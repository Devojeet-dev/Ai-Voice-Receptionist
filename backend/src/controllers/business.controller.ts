import { Request, Response } from "express";
import {
  businessCreateSchema,
  businessUpdateSchema,
  getParamId,
  parsePagination,
  validateBody,
} from "../validators";
import { businessService } from "../services/business.service";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const businessController = {
  getAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const { page, limit } = pagination;

    const result = await businessService.getAll({
      page,
      limit,
      name: typeof req.query.name === "string" ? req.query.name : undefined,
      industry: typeof req.query.industry === "string" ? req.query.industry : undefined,
      email: typeof req.query.email === "string" ? req.query.email : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result.data, "Businesses fetched successfully", result.meta)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    const business = await businessService.getById(id);
    res.status(200).json(new ApiResponse(200, business, "Business fetched successfully"));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(businessCreateSchema, req.body);
    const business = await businessService.create(payload);
    res.status(201).json(new ApiResponse(201, business, "Business created successfully"));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(businessUpdateSchema, req.body);
    const id = getParamId(req.params.id);
    const business = await businessService.update(id, payload);
    res.status(200).json(new ApiResponse(200, business, "Business updated successfully"));
  }),

  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    await businessService.remove(id);
    res.status(200).json(new ApiResponse(200, null, "Business deleted successfully"));
  }),
};
