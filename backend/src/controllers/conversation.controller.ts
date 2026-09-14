import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
  conversationCreateSchema,
  conversationUpdateSchema,
  getParamId,
  parsePagination,
  validateBody,
} from "../validators";
import { conversationService } from "../services/conversation.service";

export const conversationController = {
  getAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const result = await conversationService.getAll({
      page: pagination.page,
      limit: pagination.limit,
      businessId: typeof req.query.businessId === "string" ? req.query.businessId : undefined,
      customerId: typeof req.query.customerId === "string" ? req.query.customerId : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result.data, "Conversations fetched successfully", result.meta)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    const conversation = await conversationService.getById(id);
    res.status(200).json(new ApiResponse(200, conversation, "Conversation fetched successfully"));
  }),

  getByCustomer: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const customerId = getParamId(req.params.customerId);
    const result = await conversationService.getByCustomer(customerId, pagination.page, pagination.limit);
    res.status(200).json(new ApiResponse(200, result.data, "Customer conversations fetched successfully", result.meta));
  }),

  getByBusiness: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const businessId = getParamId(req.params.businessId);
    const result = await conversationService.getByBusiness(businessId, pagination.page, pagination.limit);
    res.status(200).json(new ApiResponse(200, result.data, "Business conversations fetched successfully", result.meta));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(conversationCreateSchema, req.body);
    const { businessId, customerId, ...rest } = payload;
    const metadataValue =
      rest.metadata === null
        ? Prisma.JsonNull
        : (rest.metadata as Prisma.InputJsonValue | undefined);

    const conversation = await conversationService.create({
      ...rest,
      metadata: metadataValue,
      business: { connect: { id: businessId } },
      customer: { connect: { id: customerId } },
    });
    res.status(201).json(new ApiResponse(201, conversation, "Conversation created successfully"));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(conversationUpdateSchema, req.body);
    const id = getParamId(req.params.id);
    const { businessId, customerId, ...rest } = payload;
    const metadataValue =
      rest.metadata === null
        ? Prisma.JsonNull
        : (rest.metadata as Prisma.InputJsonValue | undefined);

    const conversation = await conversationService.update(id, {
      ...rest,
      metadata: metadataValue,
      ...(businessId ? { business: { connect: { id: businessId } } } : {}),
      ...(customerId ? { customer: { connect: { id: customerId } } } : {}),
    });
    res.status(200).json(new ApiResponse(200, conversation, "Conversation updated successfully"));
  }),

  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    await conversationService.remove(id);
    res.status(200).json(new ApiResponse(200, null, "Conversation deleted successfully"));
  }),
};
