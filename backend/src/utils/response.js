// src/utils/response.js - UPDATE
export class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

// Untuk kompatibilitas dengan kode lama
export const success = (res, data = {}, status = 200, message = "Success") => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};

export const error = (res, message = "Something went wrong", status = 500) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

// Export default untuk kompatibilitas
export default {
  ApiResponse,
  success,
  error,
};
