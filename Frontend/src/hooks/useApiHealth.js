import { useEffect, useState } from 'react'
import { checkHealth } from '../api/client'

const POLL_INTERVAL_MS = 30000

/** Polls the API /health endpoint. Returns 'checking' | 'online' | 'offline'. */
export function useApiHealth() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let cancelled = false

    const ping = async () => {
      try {
        const res = await checkHealth()
        if (!cancelled) setStatus(res?.model_loaded ? 'online' : 'offline')
      } catch {
        if (!cancelled) setStatus('offline')
      }
    }

    ping()
    const id = setInterval(ping, POLL_INTERVAL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  return status
}
