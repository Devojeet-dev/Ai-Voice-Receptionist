import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
  customerCreateSchema,
  customerUpdateSchema,
  getParamId,
  parsePagination,
  validateBody,
} from "../validators";
import { customerService } from "../services/customer.service";

export const customerController = {
  getAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const result = await customerService.getAll({
      page: pagination.page,
      limit: pagination.limit,
      name: typeof req.query.name === "string" ? req.query.name : undefined,
      phone: typeof req.query.phone === "string" ? req.query.phone : undefined,
      email: typeof req.query.email === "string" ? req.query.email : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result.data, "Customers fetched successfully", result.meta)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    const customer = await customerService.getById(id);
    res.status(200).json(new ApiResponse(200, customer, "Customer fetched successfully"));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(customerCreateSchema, req.body);
    const customer = await customerService.create(payload);
    res.status(201).json(new ApiResponse(201, customer, "Customer created successfully"));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(customerUpdateSchema, req.body);
    const id = getParamId(req.params.id);
    const customer = await customerService.update(id, payload);
    res.status(200).json(new ApiResponse(200, customer, "Customer updated successfully"));
  }),

  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    await customerService.remove(id);
    res.status(200).json(new ApiResponse(200, null, "Customer deleted successfully"));
  }),
};
