import apiInstance from "./axios/instance.js"

export const axiosBaseQuery = () => async ({ url, method, data, params, headers }) => {
  try {
    const result = await apiInstance({
      url,
      method,
      data,
      params,
      headers,
    });
    // Return hanya payload data utama agar RTK Query tetap bersih
    return { data: result.data };
  } catch (axiosError) {
    // Skala Amazon: Standarisasi format error agar UI tidak berantakan
    return {
      error: {
        status: axiosError.response?.status || 500,
        data: axiosError.response?.data?.message || axiosError.message || "Unknown Error",
      },
    };
  }
};