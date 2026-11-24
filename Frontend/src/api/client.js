import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config/env'

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// FastAPI returns validation errors as an array of { loc, msg }.
function formatDetail(detail) {
  if (!detail) return null
  if (typeof detail === 'string') return detail
  if (Array.isArray(detail)) {
    return detail
      .map((d) => `${String(d.loc?.at(-1) ?? 'field').replaceAll('_', ' ')}: ${d.msg}`)
      .join(' · ')
  }
  return null
}

async function request(path, { method = 'GET', body, timeout = REQUEST_TIMEOUT_MS } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeout)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      throw new ApiError(formatDetail(data?.detail) || `Request failed (${res.status})`, res.status)
    }
    return data
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (err.name === 'AbortError') {
      throw new ApiError('The server took too long to respond. Please try again.')
    }
    throw new ApiError('Unable to reach the prediction service. Please make sure the API is running.')
  } finally {
    clearTimeout(timer)
  }
}

export const predictLoan = (payload) => request('/predict', { method: 'POST', body: payload })
export const checkHealth = () => request('/health', { timeout: 5000 })
