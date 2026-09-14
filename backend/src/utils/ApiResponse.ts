/**
 * src/utils/ApiResponse.ts
 *
 * A reusable class for building consistent JSON responses.
 *
 * Usage:
 *   return res.status(200).json(new ApiResponse(200, data, "Fetched successfully"));
 *   return res.status(201).json(new ApiResponse(201, created, "Customer created"));
 */

export class ApiResponse<T = unknown, M = unknown> {
  public readonly success: boolean;
  public readonly statusCode: number;
  public readonly message: string;
  public readonly data: T;
  public readonly timestamp: string;
  public readonly meta?: M;

  constructor(
    statusCode: number,
    data: T,
    message: string = "Success",
    meta?: M
  ) {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
    this.meta = meta;
  }
}
