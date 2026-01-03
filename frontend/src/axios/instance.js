import { createApiAxios, configInfo } from "./base.js";
import { applyInterceptors } from "./interceptors.js";

/**
 * API-specific instance
 * Instance inilah yang akan digunakan oleh 29 modul fitur kita.
 * Sudah dilengkapi dengan baseURL /api/v1 dan Interceptor Refresh Token.
 */
const apiInstance = createApiAxios();

// Terapkan Interceptor ke instance utama
applyInterceptors(apiInstance, configInfo);

// Default export untuk memudahkan import di services
export default apiInstance