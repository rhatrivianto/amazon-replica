import apiInstance from './axios/instance.js';

const axiosBaseQuery = ({ baseUrl } = { baseUrl: '' }) =>
  async (args) => {
    // 0. FIX UTAMA: Normalisasi Arguments (Support String vs Object)
    // RTK Query mengirim string jika endpoint hanya me-return string (e.g. query: () => '/cart')
    const requestConfig = typeof args === 'string' ? { url: args } : args;
    const { url, method, data, body, params, headers } = requestConfig;

    try {
      // 1. Safety Check: Mencegah request ke /undefined
      if (!url) {
        return {
          error: {
            status: 400,
            data: "Internal Error: URL is missing in API request",
          },
        };
      }

      // 2. Normalisasi Method & Payload
      const requestMethod = method ? method.toUpperCase() : 'GET';
      
      // FIX: Pastikan payload hanya dikirim untuk method yang mendukung body (POST, PUT, PATCH, DELETE)
      const hasPayload = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(requestMethod);
      
      // FIX: Prioritaskan 'body' jika 'data' kosong/undefined (RTK Query biasanya pakai body)
      // Kita gunakan logika yang lebih aman agar payload tidak tertukar
      const requestData = hasPayload ? (body || data) : undefined;

      // DEBUG: Cek di Console Browser apa yang dikirim
      console.log(`🚀 [API Request] ${requestMethod} ${url}`, JSON.stringify(requestData, null, 2));

      const result = await apiInstance({
        url: baseUrl + url,
        method: requestMethod,
        data: requestData, 
        params,
        // FIX: Hanya sertakan headers jika ada isinya, agar tidak menimpa default Content-Type di instance.js
        ...(headers && { headers }),
      });
      
      // DEBUG: Cek Response
      console.log(`✅ [API Response] ${requestMethod} ${url}`, result.data);

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQuery;