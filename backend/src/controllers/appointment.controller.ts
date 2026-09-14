import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {
  appointmentCreateSchema,
  appointmentUpdateSchema,
  getParamId,
  parsePagination,
  validateBody,
} from "../validators";
import { appointmentService } from "../services/appointment.service";

export const appointmentController = {
  getAll: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const result = await appointmentService.getAll({
      page: pagination.page,
      limit: pagination.limit,
      businessId: typeof req.query.businessId === "string" ? req.query.businessId : undefined,
      customerId: typeof req.query.customerId === "string" ? req.query.customerId : undefined,
      staffId: typeof req.query.staffId === "string" ? req.query.staffId : undefined,
      serviceId: typeof req.query.serviceId === "string" ? req.query.serviceId : undefined,
      status: typeof req.query.status === "string" ? (req.query.status as "BOOKED" | "CANCELLED" | "COMPLETED" | "NO_SHOW") : undefined,
    });

    res.status(200).json(
      new ApiResponse(200, result.data, "Appointments fetched successfully", result.meta)
    );
  }),

  getById: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    const appointment = await appointmentService.getById(id);
    res.status(200).json(new ApiResponse(200, appointment, "Appointment fetched successfully"));
  }),

  getByStaff: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const staffId = getParamId(req.params.staffId);
    const result = await appointmentService.getByStaff(staffId, pagination.page, pagination.limit);
    res.status(200).json(new ApiResponse(200, result.data, "Staff appointments fetched successfully", result.meta));
  }),

  getByCustomer: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const customerId = getParamId(req.params.customerId);
    const result = await appointmentService.getByCustomer(customerId, pagination.page, pagination.limit);
    res.status(200).json(new ApiResponse(200, result.data, "Customer appointments fetched successfully", result.meta));
  }),

  getByBusiness: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pagination = parsePagination(req.query as Record<string, string | string[] | undefined>);
    const businessId = getParamId(req.params.businessId);
    const result = await appointmentService.getByBusiness(businessId, pagination.page, pagination.limit);
    res.status(200).json(new ApiResponse(200, result.data, "Business appointments fetched successfully", result.meta));
  }),

  create: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(appointmentCreateSchema, req.body);
    const { businessId, customerId, staffId, serviceId, ...rest } = payload;
    const appointment = await appointmentService.create({
      ...rest,
      business: { connect: { id: businessId } },
      customer: { connect: { id: customerId } },
      staff: { connect: { id: staffId } },
      service: { connect: { id: serviceId } },
    });
    res.status(201).json(new ApiResponse(201, appointment, "Appointment created successfully"));
  }),

  update: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const payload = validateBody(appointmentUpdateSchema, req.body);
    const id = getParamId(req.params.id);
    const { businessId, customerId, staffId, serviceId, ...rest } = payload;
    const appointment = await appointmentService.update(id, {
      ...rest,
      ...(businessId ? { business: { connect: { id: businessId } } } : {}),
      ...(customerId ? { customer: { connect: { id: customerId } } } : {}),
      ...(staffId ? { staff: { connect: { id: staffId } } } : {}),
      ...(serviceId ? { service: { connect: { id: serviceId } } } : {}),
    });
    res.status(200).json(new ApiResponse(200, appointment, "Appointment updated successfully"));
  }),

  remove: asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = getParamId(req.params.id);
    await appointmentService.remove(id);
    res.status(200).json(new ApiResponse(200, null, "Appointment deleted successfully"));
  }),
};
