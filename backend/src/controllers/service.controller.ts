import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
  getParamId,
  parsePagination,
  serviceCreateSchema,
  serviceUpdateSchema,
  validateBody,
} from "../validators";
import { serviceService } from "../services/service.service";

export const serviceController = {
  getAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const result = await serviceService.getAll({
      page: pagination.page,
      limit: pagination.limit,
      businessId: typeof req.query.businessId === "string" ? req.query.businessId : undefined,
      name: typeof req.query.name === "string" ? req.query.name : undefined,
      isActive: typeof req.query.isActive === "string" ? req.query.isActive === "true" : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result.data, "Services fetched successfully", result.meta)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    const service = await serviceService.getById(id);
    res.status(200).json(new ApiResponse(200, service, "Service fetched successfully"));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(serviceCreateSchema, req.body);
    const { businessId, ...rest } = payload;
    const service = await serviceService.create({
      ...rest,
      business: { connect: { id: businessId } },
    });
    res.status(201).json(new ApiResponse(201, service, "Service created successfully"));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(serviceUpdateSchema, req.body);
    const id = getParamId(req.params.id);
    const { businessId, ...rest } = payload;
    const service = await serviceService.update(id, {
      ...rest,
      ...(businessId ? { business: { connect: { id: businessId } } } : {}),
    });
    res.status(200).json(new ApiResponse(200, service, "Service updated successfully"));
  }),

  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    await serviceService.remove(id);
    res.status(200).json(new ApiResponse(200, null, "Service deleted successfully"));
  }),
};
