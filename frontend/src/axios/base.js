import axios from "axios";

const isDev = import.meta.env.DEV;

const prodUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? (prodUrl.endsWith('/api/v1') ? prodUrl : `${prodUrl}/api/v1`)
  : "http://localhost:5000/api/v1";

export const createApiAxios = () =>
  axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // WAJIB untuk HTTP-Only Cookies (Refresh Token)
  });

export const configInfo = { isDev, API_BASE_URL };