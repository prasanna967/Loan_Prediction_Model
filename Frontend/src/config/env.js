// Centralised access to build-time environment variables (see .env.example).
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '')
export const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_REQUEST_TIMEOUT_MS) || 15000
